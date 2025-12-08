import ThemedText from "@design/Typography/ThemedText";
import { Colors, FontSizes, Spacing } from "@style/theme";
import { StyleSheet } from "react-native";

type Props = {
  children: string;
};

const FieldError = ({ children }: Props) => {
  return <ThemedText style={styles.error}>{children}</ThemedText>;
};

const styles = StyleSheet.create({
  error: {
    color: Colors.error["500"],
    fontSize: FontSizes.sm,
    marginTop: Spacing["2xs"],
    marginLeft: Spacing.xs,
    textAlign: "left",
    width: "100%",
  },
});

export default FieldError;
