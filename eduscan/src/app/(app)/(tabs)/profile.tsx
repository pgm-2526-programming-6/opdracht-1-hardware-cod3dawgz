import { logout } from "@core/modules/auth/api.auth";
import { formatName } from "@core/modules/profiles/utils.profiles";
import Button from "@design/Button/Button";
import useUser from "@functional/auth/useUser";
import ThemedText from "@design/Typography/ThemedText";
import DefaultView from "@design/View/DefaultView";

export default function ProfilePage() {

    const user = useUser();    
 
    return (
        <DefaultView>
            <ThemedText type="title">Your account details</ThemedText>
            <ThemedText>{formatName(user)}</ThemedText>
            <ThemedText>You are a: {user.is_teacher ? "Teacher" : "Student"}</ThemedText>
            <Button onPress={() => logout()} >logout</Button>
        </DefaultView>
    );
}