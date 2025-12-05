import { Text, View } from "react-native";
import ThemedText from "@design/Typography/ThemedText";
import useUser from "@functional/auth/useUser";

export default function AttendancesPage() {

    const user = useUser();

  return (
    <View>    
      <ThemedText>Attendances</ThemedText>
      <Text>{user.id}</Text>
    </View>
  );
}
