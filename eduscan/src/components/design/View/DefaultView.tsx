import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from "react-native";
import { Spacing } from "@style/theme";

type Props = {
  style?: StyleProp<ViewStyle>;
  padding?: boolean;
  children: React.ReactNode;
} & ViewProps;

const DefaultView = ({ style, padding = true, children, ...props }: Props) => {
  return (
    <View style={[styles.view, padding && styles.viewPadding, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  viewPadding: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
});

export default DefaultView;
