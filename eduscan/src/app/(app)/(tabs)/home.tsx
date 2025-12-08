import { Text, View } from "react-native";
import ThemedText from "@design/Typography/ThemedText";
import QRCode from "../../../app/qrcode/qrcode";

export default function Homepage() {

  return (
    <View>    
      <ThemedText> Home Screen </ThemedText>
      <QRCode />
    </View>
  );
}
