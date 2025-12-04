import isEmptyText from "@core/utils/isEmptyText";
import ThemedText from "@design/Typography/ThemedText";
import Icons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors, Spacing } from "@style/theme";
import { Href, Link } from "expo-router";
import { ColorValue, Pressable, StyleSheet, View } from "react-native";

type BaseProps = {
  title: string;
  description?: string;
  icon?: any;
  iconColor?: ColorValue;
  color?: ColorValue;
  right?: string;
};

type HrefProps = BaseProps & {
  href: Href;
  onPress?: never;
};

type PressProps = BaseProps & {
  onPress: () => void;
  href?: never;
};

const ListItem = ({
  onPress,
  href,
  title,
  description,
  icon,
  iconColor = Colors.text,
  color,
  right,
}: HrefProps | PressProps) => {
  let textContent: React.ReactNode;
  if (!isEmptyText(description)) {
    textContent = (
      <View style={styles.containerText}>
        <ThemedText style={[styles.title, color && { color }]}>{title}</ThemedText>
        <ThemedText style={[styles.description]}>{description}</ThemedText>
      </View>
    );
  } else {
    textContent = <ThemedText style={[styles.titleFlex, color && { color }]}>{title}</ThemedText>;
  }

  let content = (
    <View style={styles.container}>
      {icon && <Icons style={styles.icon} name={icon} color={iconColor} size={24} />}
      {textContent}
      {right && <ThemedText style={[styles.right, color && { color }]}>{right}</ThemedText>}
    </View>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return (
    <Pressable onPress={onPress} android_ripple={{ color: Colors.ripple, foreground: true }}>
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  containerText: {
    flex: 1,
  },
  title: {},
  titleFlex: {
    flex: 1,
  },
  description: {
    color: Colors.gray["500"],
  },
  right: {
    marginLeft: "auto",
  },
  icon: {
    marginLeft: Spacing.xs,
    marginRight: Spacing.md,
  },
});

export default ListItem;
