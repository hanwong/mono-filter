import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Mono.F.F",
  slug: "mono-filter",
  version: "1.0.1",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "monoff",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "ours.co.monoff",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSUserTrackingUsageDescription:
        "This identifier will be used to deliver personalized ads to you. To test AdMob correctly on TestFlight, please allow tracking.",
      NSPhotoLibraryUsageDescription:
        "Mono.F.F needs access to your photo library to let you select an image for editing and applying vintage filters.",
      NSPhotoLibraryAddUsageDescription:
        "Mono.F.F needs permission to save photos to your library so you can export and keep the edited images you create.",
      NSCameraUsageDescription:
        "Mono.F.F requires camera access to allow you to take a photo directly within the app for immediate editing and filtering.",
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: "ours.co.monoff",
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 280,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    [
      "react-native-google-mobile-ads",
      {
        androidAppId:
          process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID ||
          "ca-app-pub-3940256099942544~3347511713", // Fallback to Test ID
        iosAppId:
          process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID ||
          "ca-app-pub-3940256099942544~1458002511", // Fallback to Test ID
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "Mono.F.F needs access to your photo library to let you select an image for editing and applying vintage filters.",
        cameraPermission:
          "Mono.F.F requires camera access to allow you to take a photo directly within the app for immediate editing and filtering.",
      },
    ],
    [
      "expo-media-library",
      {
        photosPermission:
          "Mono.F.F needs access to your photo library to let you select an image for editing and applying vintage filters.",
        savePhotosPermission:
          "Mono.F.F needs permission to save photos to your library so you can export and keep the edited images you create.",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  updates: {
    url: "https://u.expo.dev/d672fa71-da12-40da-8b2f-e71c5c4f1396",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  extra: {
    router: {},
    eas: {
      projectId: "d672fa71-da12-40da-8b2f-e71c5c4f1396",
    },
  },
});
