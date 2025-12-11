import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, View } from "react-native";
import { Spacing } from "@style/theme";

type CheckMarkProps = {
  variant?: string;
  size?: number;
};

const CheckMark = ({ variant = "success", size = 24 }: CheckMarkProps) => {
  const isSuccess = variant === "success";
  const iconName = isSuccess ? "check" : "close";
  const color = isSuccess ? "#22c55e" : "#ef4444";

  return (
    <View style={styles.container}>
      <MaterialIcons
       name={iconName} size={size} color={color} />
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