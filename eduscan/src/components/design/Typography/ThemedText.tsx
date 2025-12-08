import { Colors, Fonts, FontSizes } from "@style/theme";
import { Text, type TextProps, StyleSheet, TextStyle, StyleProp } from "react-native";

export type ThemedTextProps = TextProps & {
  type?: "default" | "title" | "subtitle" | "link";
  color?: "default" | "light";
  weight?: "normal" | "semi-bold" | "bold";
  style?: StyleProp<TextStyle>;
};

const ThemedText = ({
  style,
  type = "default",
  color = "default",
  weight = "normal",
  ...rest
}: ThemedTextProps) => {
  return (
    <Text
      style={[
        styles.default,
        type === "title" && styles.title,
        style,
        weight === "bold" && styles.bold,
        color === "light" && styles.light,
      ]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  default: {
    fontSize: FontSizes.default,
    fontFamily: Fonts.regular,
    color: Colors.text,
  },
  title: {
    fontSize: FontSizes.xl,
  },
  bold: {
    fontFamily: Fonts.bold,
  },
  light: {
    color: Colors.gray["600"],
  },
});

export default ThemedText;
