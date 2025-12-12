import { View, StyleSheet, ViewStyle } from "react-native";
import { Spacing } from "@style/theme";
import { ReactNode } from "react";

type LegendProps = {
  children: ReactNode;
  style?: ViewStyle;
};

const Legend = ({ children, style }: LegendProps) => {
  return (
    <View style={[styles.legend, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xl,
    gap: Spacing.xl,
  },
});

export default Legend;
