import { Client, CreateClientBody } from "@core/modules/clients/types.clients";
import ErrorMessage from "@design/Alert/ErrorMessage";
import Button from "@design/Button/Button";
import InputField from "@design/Form/InputField";
import DefaultView from "@design/View/DefaultView";
import { yupResolver } from "@hookform/resolvers/yup";
import { Spacing } from "@style/theme";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet } from "react-native";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required(),
});

type Props = {
  onSuccess: () => void;
  updateMethod: (data: CreateClientBody) => Promise<Client | null>;
};

const ClientForm = ({ updateMethod, onSuccess }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClientBody>({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(schema),
  });

  const { mutate, error, isPending } = useMutation({
    mutationFn: updateMethod,
    onSuccess: () => {
      onSuccess();
    },
  });

  const handleOnSubmit = (data: CreateClientBody) => {
    mutate(data);
  };

  return (
    <ScrollView keyboardShouldPersistTaps="always">
      <DefaultView>
        {!!error && <ErrorMessage error={error} />}

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value, onBlur } }) => (
            <InputField
              label="Client name"
              name="name"
              placeholder="client name"
              disabled={isPending}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.name?.message}
            />
          )}
        />

        <Button style={styles.button} onPress={handleSubmit(handleOnSubmit)} disabled={isPending}>
          Aanmaken
        </Button>
      </DefaultView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: Spacing.sm,
  },
});

export default ClientForm;
