import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Colors, Spacing, FontSizes, Fonts } from "@style/theme";
import { ReactNode } from "react";

type LegendItemProps = {
  label: string;
  backgroundColor: string;
  borderColor?: string;
  icon?: ReactNode;
  squareStyle?: ViewStyle;
};

const LegendItem = ({ label, backgroundColor, borderColor, icon, squareStyle }: LegendItemProps) => {
  return (
    <View style={styles.legendItem}>
      <View 
        style={[
          styles.legendSquare, 
          { backgroundColor },
          borderColor && { borderWidth: 2, borderColor },
          squareStyle
        ]}
      >
        {icon}
      </View>
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  legendSquare: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  legendText: {
    fontSize: FontSizes.default,
    fontFamily: Fonts.regular,
    color: Colors.gray["700"],
  },
});

export default LegendItem;
