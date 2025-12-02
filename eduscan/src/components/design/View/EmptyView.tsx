import Button from "@design/Button/Button";
import ThemedText from "@design/Typography/ThemedText";
import CenteredView from "@design/View/CenteredView";
import Icons from "@expo/vector-icons/Feather";
import { Colors, Spacing } from "@style/theme";
import { Href } from "expo-router";
import { StyleSheet } from "react-native";

type Props = {
  title: string;
  description: string;
  icon: keyof typeof Icons.glyphMap;
  href?: Href;
};

const EmptyView = ({ title, description, icon, href }: Props) => {
  return (
    <CenteredView>
      <Icons name={icon} size={Spacing["3xl"]} color={Colors.primary["400"]} />
      <ThemedText style={[styles.title, styles.text]} type="title">
        {title}
      </ThemedText>
      <ThemedText color="light" style={styles.text}>
        {description}
      </ThemedText>
      {href && (
        <Button href={href} style={styles.button}>
          Toevoegen
        </Button>
      )}
    </CenteredView>
  );
};

const styles = StyleSheet.create({
  title: {
    marginVertical: Spacing.xs,
  },
  text: {
    textAlign: "center",
    paddingHorizontal: Spacing.lg,
  },
  button: {
    marginTop: Spacing.md,
  },
});

export default EmptyView;
