import { LoginBody } from "@core/modules/auth/types.auth";
import ErrorMessage from "@design/Alert/ErrorMessage";
import Button from "@design/Button/Button";
import TextButton from "@design/Button/TextButton";
import InputField from "@design/Form/InputField";
import Logo from "@design/Logo/Logo";
import {  useRouter } from "expo-router";
import ThemedText from "@design/Typography/ThemedText";
import DefaultView from "@design/View/DefaultView";
import useAuth from "@functional/auth/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Spacing } from "@style/theme";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});


const Login = () => {
  const router = useRouter();
  const { login } = useAuth();

  const { mutate, error, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      router.replace("/(app)/(tabs)/home");
    },
  });


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const handleLogin = (data: LoginBody) => {
    mutate(data);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView keyboardShouldPersistTaps="always">
        <DefaultView>
          <Logo style={styles.logo} />

          <ThemedText type="title" style={styles.title}>
            Login met je account
          </ThemedText>

          {!!error && <ErrorMessage error={error} />}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, onBlur } }) => (
              <InputField
                label="Email"
                name="email"
                placeholder="john@doe.com"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                disabled={isPending}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value, onBlur } }) => (
              <InputField
                label="Wachtwoord"
                name="password"
                secureTextEntry
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                disabled={isPending}
                error={errors.password?.message}
              />
            )}
          />

          <Button disabled={isPending} style={styles.button} onPress={handleSubmit(handleLogin)}>
            Login
          </Button>

          <TextButton disabled={isPending} href="/(auth)/register">
            No account yet? Register
          </TextButton>
        </DefaultView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    marginBottom: Spacing["2xl"],
  },
  button: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  logo: {
    marginHorizontal: "auto",
    marginTop: Spacing["5xl"],
    marginBottom: Spacing["2xl"],
  },
});

export default Login;
