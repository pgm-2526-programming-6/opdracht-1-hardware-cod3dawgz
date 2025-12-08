import { logout } from "@core/modules/auth/api.auth";
import { formatName } from "@core/modules/profiles/utils.profiles";
import Button from "@design/Button/Button";
import { Text, View } from "react-native";
import useUser from "@functional/auth/useUser";

export default function ProfilePage() {

    const user = useUser();    
 
    return (
        <View>
            <Text>Your account details</Text>
            <Text>{formatName(user)}</Text>
            <Text>You are a: {user.is_teacher ? "Teacher" : "Student"}</Text>
            <Button onPress={() => logout()} >logout</Button>
        </View>
    );
}