import ThemedText from "@design/Typography/ThemedText";
import { Colors, Spacing } from "@style/theme";
import { StyleSheet } from "react-native";

type Props = {
  error: unknown;
};

const ErrorMessage = ({ error }: Props) => {
  if (error) {
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    return <ThemedText style={styles.text}>{message}</ThemedText>;
  }
  return null;
};

const styles = StyleSheet.create({
  text: {
    width: "100%",
    textAlign: "center",
    backgroundColor: Colors.error["100"],
    color: Colors.error["400"],
    padding: Spacing.sm,
    borderRadius: Spacing.xs,
    marginBottom: Spacing.md,
  },
});

export default ErrorMessage;
