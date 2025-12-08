import isEmptyText from "@core/utils/isEmptyText";
import { Picker, PickerProps } from "@react-native-picker/picker";
import { ItemValue } from "@react-native-picker/picker/typings/Picker";
import { Colors, Fonts, FontSizes, Spacing } from "@style/theme";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import FieldError from "./FieldError";
import Label from "./Label";

type SpinnerOption<T> = {
  label: string;
  value?: T;
};

export type SpinnerFieldProps<T = ItemValue> = {
  name: string;
  value: T;
  label?: string;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
  placeholder?: string;
  options: SpinnerOption<T>[];
  disabled?: boolean;
  error?: string | null;
} & PickerProps;

const SpinnerField = <T extends ItemValue>({
  name,
  value,
  label,
  onChange,
  style,
  placeholder,
  options,
  disabled = false,
  error,
  ...rest
}: SpinnerFieldProps<T>) => {
  // add empty option
  options = [{ label: "-- Choose " }, ...options];

  return (
    <View style={[styles.container, style]}>
      {label && <Label>{label}</Label>}
      <View style={[styles.background, !isEmptyText(error) && styles.backgroundError]}>
        <Picker
          selectedValue={value}
          style={styles.input}
          enabled={!disabled}
          onValueChange={(value) => onChange(value as T)}
          dropdownIconColor={Colors.text}
          {...rest}
        >
          {options.map((item: SpinnerOption<T>) => (
            <Picker.Item key={item.label} label={item.label} value={item.value} />
          ))}
        </Picker>
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
    paddingVertical: 0,
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

export default SpinnerField;
