import ThemedText from "@design/Typography/ThemedText";
import { Colors, FontSizes, Spacing } from "@style/theme";
import { Href, Link } from "expo-router";
import { Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native";

type BaseProps = {
  children: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
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

const Button = ({ onPress, href, children, style, disabled = false, variant = "primary" }: HrefProps | PressProps) => {
  const content = (
    <View style={[
      styles.background, 
      variant === "secondary" && styles.backgroundSecondary,
      variant === "danger" && styles.backgroundDanger,
      disabled && styles.backgroundDisabled
    ]}>
      <ThemedText style={[
        styles.text, 
        variant === "secondary" && styles.textSecondary,
        disabled && styles.textDisabled
      ]}>
        {children}
      </ThemedText>
    </View>
  );

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
      style={({ pressed }) => [style, pressed && styles.pressed]}
      android_ripple={{ color: Colors.ripple, foreground: true }}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.primary["600"],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginVertical: Spacing.md,
    borderRadius: Spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backgroundSecondary: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary["600"],
  },
  backgroundDanger: {
    backgroundColor: Colors.error["600"],
  },
  backgroundDisabled: {
    backgroundColor: Colors.gray["300"],
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    textAlign: "center",
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: "600",
  },
  textSecondary: {
    color: Colors.primary["600"],
  },
  textDisabled: {
    opacity: 0.5,
    color: Colors.gray["500"],
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});

export default Button;
