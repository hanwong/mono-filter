import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PhotoEditor from "@/components/PhotoEditor";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <PhotoEditor />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
