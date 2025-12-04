import { ColorValue, Pressable } from "react-native";
import Icons from "@expo/vector-icons/Feather";
import { Spacing } from "@style/theme";

type Props = {
  icon: keyof typeof Icons.glyphMap;
  onPress?: () => void;
  label: string;
  color?: ColorValue;
  size?: number;
};

const IconButton = ({ icon, label, color, size, onPress }: Props) => {
  return (
    <Pressable accessibilityLabel={label} onPress={onPress} android_ripple={{ borderless: true }}>
      <Icons name={icon} color={color} size={size || Spacing.xl} />
    </Pressable>
  );
};

export default IconButton;
