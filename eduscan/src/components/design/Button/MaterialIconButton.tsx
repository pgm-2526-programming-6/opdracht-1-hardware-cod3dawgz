import { ColorValue, Pressable, StyleSheet, ViewStyle } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Spacing } from "@style/theme";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
  label: string;
  color?: ColorValue;
  size?: number;
  style?: ViewStyle;
  disabled?: boolean;
};

const MaterialIconButton = ({ icon, label, color, size, onPress, style, disabled }: Props) => {
  return (
    <Pressable 
      accessibilityLabel={label} 
      onPress={onPress} 
      android_ripple={{ borderless: true }}
      style={[styles.button, style]}
      disabled={disabled}
    >
      <MaterialIcons name={icon} color={color} size={size || Spacing.xl} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: Spacing.xs,
    borderRadius: 8,
  },
});

export default MaterialIconButton;
