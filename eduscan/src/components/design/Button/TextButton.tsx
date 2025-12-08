import ThemedText from "@design/Typography/ThemedText";
import { Colors, Fonts, FontSizes, Spacing } from "@style/theme";
import { Href, Link } from "expo-router";
import { Pressable, StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";

type BaseProps = {
  children: string;
  color?: string;
  disabled?: boolean;
};

type HrefProps = BaseProps & {
  href: Href;
  onPress?: never;
  style?: StyleProp<TextStyle>;
};

type PressProps = BaseProps & {
  onPress: () => void;
  href?: never;
  style?: StyleProp<ViewStyle>;
};

const TextButton = ({ onPress, href, children, color, style, disabled = false }: PressProps | HrefProps) => {
  const content = <ThemedText style={[styles.title, color && { color }]}>{children}</ThemedText>;

  if (href) {
    return (
      <Link href={href} disabled={disabled} style={style}>
        {content}
      </Link>
    );
  }

  return (
    <Pressable
      disabled={disabled}
      accessibilityLabel={children}
      onPress={onPress}
      style={style}
      android_ripple={{ color: Colors.ripple }}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    color: Colors.primary["500"],
    fontFamily: Fonts.bold,
    fontSize: FontSizes.default,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
});

export default TextButton;
