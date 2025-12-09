import { Text, View } from "react-native";
import ThemedText from "@design/Typography/ThemedText";
import DefaultView from "@design/View/DefaultView";
import QRCode from "@functional/qrcode/qrcode";


export default function Homepage() {

  return (
    <DefaultView>    
      <ThemedText> Home Screen </ThemedText>
      
      <QRCode />

    </DefaultView>


  );
}
