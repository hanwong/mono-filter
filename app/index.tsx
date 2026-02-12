import PhotoEditor from "@/components/PhotoEditor";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <PhotoEditor />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
