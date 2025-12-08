import ThemedText from "@design/Typography/ThemedText";
import { Spacing } from "@style/theme";
import { StyleSheet } from "react-native";

type Props = {
  children: string;
};

const Label = ({ children }: Props) => {
  return <ThemedText style={styles.label}>{children}</ThemedText>;
};

const styles = StyleSheet.create({
  label: {
    width: "100%",
    marginLeft: Spacing["2xs"],
    marginBottom: Spacing["2xs"],
  },
});

export default Label;
