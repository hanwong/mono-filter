import {
  ClipOp,
  FilterMode,
  MipmapMode,
  Skia,
  type SkImage,
} from "@shopify/react-native-skia";

import { IDENTITY } from "../constants/filters";
import { GRAIN_SHADER, VIGNETTE_SHADER } from "../constants/shaders";

export interface RenderParams {
  image: SkImage;
  aspectRatio: number;
  frameWidth: number; // percentage (0-50)
  frameColor: string;
  backgroundColor: string;
  filterMatrix: number[];
  grain: number;
  vignette: number;
}

/**
 * Renders the composed image (frame + filters + effects) offscreen
 * at original image resolution and returns PNG bytes.
 */
export function renderOffscreen(params: RenderParams): Uint8Array | null {
  const {
    image,
    aspectRatio,
    frameWidth,
    frameColor,
    backgroundColor,
    filterMatrix,
    grain,
    vignette,
  } = params;

  const imgW = image.width();
  const imgH = image.height();
  const imgAspect = imgW / imgH;

  // Calculate output frame dimensions so the image fills the inner width
  // at its original resolution.
  //
  // The inner area width = frameW_out - 2 * padding
  // padding = min(frameW_out, frameH_out) * frameWidth / 100
  //
  // We want innerWidth = imgW, so we solve for frameW_out.

  let frameW: number;
  let frameH: number;

  if (aspectRatio <= 1) {
    // Portrait or square frame: frameW <= frameH, so minDim = frameW
    // innerWidth = frameW - 2 * frameW * (frameWidth / 100)
    //            = frameW * (1 - 2 * frameWidth / 100)
    const factor = 1 - (2 * frameWidth) / 100;
    frameW = factor > 0 ? imgW / factor : imgW;
    frameH = frameW / aspectRatio;
  } else {
    // Landscape frame: frameW > frameH, so minDim = frameH
    // frameH = frameW / aspectRatio
    // innerWidth = frameW - 2 * (frameW / aspectRatio) * (frameWidth / 100)
    //            = frameW * (1 - 2 * frameWidth / (100 * aspectRatio))
    const factor = 1 - (2 * frameWidth) / (100 * aspectRatio);
    frameW = factor > 0 ? imgW / factor : imgW;
    frameH = frameW / aspectRatio;
  }

  // Round to integers
  frameW = Math.round(frameW);
  frameH = Math.round(frameH);

  // Create offscreen surface
  const surface = Skia.Surface.Make(frameW, frameH);
  if (!surface) return null;

  const canvas = surface.getCanvas();

  // 1. Draw frame background
  const framePaint = Skia.Paint();
  framePaint.setColor(Skia.Color(frameColor));
  canvas.drawRect(Skia.XYWHRect(0, 0, frameW, frameH), framePaint);

  // 2. Calculate inner image area
  const minDim = Math.min(frameW, frameH);
  const paddingPx = (minDim * frameWidth) / 100;

  const innerX = paddingPx;
  const innerY = paddingPx;
  const innerW = Math.max(0, frameW - paddingPx * 2);
  const innerH = Math.max(0, frameH - paddingPx * 2);

  // 3. Clip to inner area
  canvas.save();
  canvas.clipRect(
    Skia.XYWHRect(innerX, innerY, innerW, innerH),
    ClipOp.Intersect,
    true,
  );

  // 4. Draw background behind image
  const bgPaint = Skia.Paint();
  bgPaint.setColor(Skia.Color(backgroundColor));
  canvas.drawRect(Skia.XYWHRect(innerX, innerY, innerW, innerH), bgPaint);

  // 5. Calculate image render dimensions (fill width)
  let renderW = innerW;
  let renderH = renderW / imgAspect;
  const renderX = innerX;
  const renderY = innerY + (innerH - renderH) / 2;

  // 6. Draw image with color filter
  const imgPaint = Skia.Paint();
  if (filterMatrix !== IDENTITY) {
    const cf = Skia.ColorFilter.MakeMatrix(filterMatrix);
    imgPaint.setColorFilter(cf);
  }

  const srcRect = Skia.XYWHRect(0, 0, imgW, imgH);
  const destRect = Skia.XYWHRect(renderX, renderY, renderW, renderH);

  canvas.drawImageRectOptions(
    image,
    srcRect,
    destRect,
    FilterMode.Linear,
    MipmapMode.Linear,
    imgPaint,
  );

  // 7. Draw grain overlay
  if (grain > 0) {
    const grainEffect = Skia.RuntimeEffect.Make(GRAIN_SHADER);
    if (grainEffect) {
      const grainPaint = Skia.Paint();
      grainPaint.setBlendMode(15); // BlendMode.Overlay = 15
      const grainShader = grainEffect.makeShader([grain]);
      grainPaint.setShader(grainShader);
      canvas.drawRect(
        Skia.XYWHRect(innerX, innerY, innerW, innerH),
        grainPaint,
      );
    }
  }

  // 8. Draw vignette overlay
  if (vignette > 0) {
    const vignetteEffect = Skia.RuntimeEffect.Make(VIGNETTE_SHADER);
    if (vignetteEffect) {
      const vignettePaint = Skia.Paint();
      const vignetteShader = vignetteEffect.makeShader([
        innerW,
        innerH,
        vignette,
      ]);
      vignettePaint.setShader(vignetteShader);
      canvas.drawRect(
        Skia.XYWHRect(innerX, innerY, innerW, innerH),
        vignettePaint,
      );
    }
  }

  canvas.restore();

  // 9. Export as PNG bytes
  const snapshot = surface.makeImageSnapshot();
  const bytes = snapshot.encodeToBytes();

  return bytes;
}
