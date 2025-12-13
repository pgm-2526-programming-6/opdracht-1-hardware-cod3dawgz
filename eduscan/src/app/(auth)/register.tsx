import { RegisterBody } from "@core/modules/auth/types.auth";
import { registerUser } from "@core/modules/auth/api.auth";
import ErrorMessage from "@design/Alert/ErrorMessage";
import Button from "@design/Button/Button";
import TextButton from "@design/Button/TextButton";
import InputField from "@design/Form/InputField";
import { useRouter } from "expo-router";
import ThemedText from "@design/Typography/ThemedText";
import DefaultView from "@design/View/DefaultView";
import { yupResolver } from "@hookform/resolvers/yup";
import { Spacing } from "@style/theme";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";

const schema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid e-mail address").required("E=mail is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const defaultValues = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
};

type RegisterFormData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

const Register = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { mutate, error, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      router.replace("/(auth)/login");
    },
  });

  const handleRegister = (data: RegisterFormData) => {
    const registerData: RegisterBody = {
      ...data,
      is_teacher: false,
    };
    mutate(registerData);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView keyboardShouldPersistTaps="always">
        <DefaultView>

          <ThemedText type="title" style={styles.title}>
            Create an account
          </ThemedText>

          {!!error && <ErrorMessage error={error} />}

          <Controller
            control={control}
            name="first_name"
            render={({ field: { onChange, value, onBlur } }) => (
              <InputField
                label="First name"
                name="first_name"
                placeholder="John"
                autoComplete="given-name"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                disabled={isPending}
                error={errors.first_name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="last_name"
            render={({ field: { onChange, value, onBlur } }) => (
              <InputField
                label="Last name"
                name="last_name"
                placeholder="Doe"
                autoComplete="family-name"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                disabled={isPending}
                error={errors.last_name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value, onBlur } }) => (
              <InputField
                label="E-mail"
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
                label="Password"
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

          <Button
            disabled={isPending}
            style={styles.button}
            onPress={handleSubmit(handleRegister)}
          >
            Register
          </Button>

          <TextButton disabled={isPending} href="/(auth)/login">
            Already have an account? Log in
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
});

export default Register;