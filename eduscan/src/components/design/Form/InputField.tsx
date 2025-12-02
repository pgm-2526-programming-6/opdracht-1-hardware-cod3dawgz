import isEmptyText from "@core/utils/isEmptyText";
import FieldError from "@design/Form/FieldError";
import Label from "@design/Form/Label";
import { Colors, Fonts, FontSizes, Spacing } from "@style/theme";
import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from "react-native";

export type Props = TextInputProps & {
  name: string;
  value: string | undefined;
  label?: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  inputRef?: React.Ref<TextInput>;
  error?: string | null;
};

const InputField = ({
  name,
  value,
  label,
  onChangeText,
  placeholder,
  style,
  disabled = false,
  inputRef,
  error,
  ...rest
}: Props) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Label>{label}</Label>}
      <View style={[styles.background, !isEmptyText(error) && styles.backgroundError]}>
        <TextInput
          style={styles.input}
          value={value}
          editable={!disabled}
          onChangeText={onChangeText}
          ref={inputRef}
          placeholder={placeholder}
          {...rest}
        />
      </View>
      {!isEmptyText(error) && <FieldError>{error}</FieldError>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: Spacing.sm,
  },
  background: {
    width: "100%",
    backgroundColor: Colors.white,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.primary["100"],
  },
  backgroundError: {
    borderColor: Colors.error["500"],
  },
  input: {
    fontSize: FontSizes.default,
    fontFamily: Fonts.regular,
    color: Colors.text,
  },
});

export default InputField;
