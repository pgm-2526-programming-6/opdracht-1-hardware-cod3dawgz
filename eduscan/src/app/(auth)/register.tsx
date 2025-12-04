import { registerUser } from "@core/modules/auth/api.auth";
import Button from "@design/Button/Button";
import { Text, View } from "react-native";

const Register = () => {
  const handleRegister = () => {
    registerUser({
      email: "test@arteveldehs.be",
      password: "secret123",
      first_name: "Maurice",
      last_name: "Halsberghe",
      is_teacher: true,
    }).then(() => {});
  };

  return (
    <View>
      <Text>Register screen</Text>
      <Button onPress={handleRegister}>Registreren</Button>
    </View>
  );
};

export default Register;