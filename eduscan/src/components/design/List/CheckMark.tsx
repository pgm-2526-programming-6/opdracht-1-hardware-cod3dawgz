import Icons from "@expo/vector-icons/Feather";
import { StyleSheet, View } from "react-native";
import { Spacing } from "@style/theme";

type CheckMarkProps = {
  variant?: string;
  size?: number;
};

const CheckMark = ({ variant = "success", size = 24 }: CheckMarkProps) => {
  const isSuccess = variant === "success";
  const iconName = isSuccess ? "check-circle" : "x-circle";
  const color = isSuccess ? "#22c55e" : "#ef4444";

  return (
    <View style={styles.container}>
      <Icons name={iconName} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xs,
  },
});

export default CheckMark; 