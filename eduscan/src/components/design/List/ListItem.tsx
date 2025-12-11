import isEmptyText from "@core/utils/isEmptyText";
import ThemedText from "@design/Typography/ThemedText";
import Icons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors, Spacing } from "@style/theme";
import { Href, Link } from "expo-router";
import { ColorValue, Pressable, StyleSheet, View } from "react-native";
import CheckMark from "@design/List/CheckMark";

type BaseProps = {
  title?: string;
  description?: string;
  icon?: any;
  iconColor?: ColorValue;
  color?: ColorValue;
  right?: string;
  variant?: string;
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
  variant,
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
      <CheckMark variant={variant}></CheckMark>
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
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginVertical: Spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  containerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
  },
  titleFlex: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
  },
  description: {
    fontSize: 14,
    color: Colors.gray["400"],
    marginTop: 2,
  },
  right: {
    marginLeft: "auto",
    marginRight: Spacing.sm,
  },
  icon: {
    marginRight: Spacing.md,
  },
});

export default ListItem;
