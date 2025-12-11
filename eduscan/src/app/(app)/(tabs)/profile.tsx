import { logout } from "@core/modules/auth/api.auth";
import { formatName } from "@core/modules/profiles/utils.profiles";
import Button from "@design/Button/Button";
import useUser from "@functional/auth/useUser";
import ThemedText from "@design/Typography/ThemedText";
import DefaultView from "@design/View/DefaultView";
import { View, StyleSheet } from "react-native";
import Icons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors, Spacing } from "@style/theme";

export default function ProfilePage() {

    const user = useUser();    
 
    return (
        <DefaultView padding={false}>
            <View style={styles.container}>
                <ThemedText style={styles.header}>Profile</ThemedText>
                
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Icons name="account" size={64} color={Colors.white} />
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <ThemedText style={styles.label}>Name</ThemedText>
                    <ThemedText style={styles.value}>{formatName(user)}</ThemedText>
                </View>

                <View style={styles.infoCard}>
                    <ThemedText style={styles.label}>Email</ThemedText>
                    <ThemedText style={styles.value}>{user.email}</ThemedText>
                </View>

                <Button onPress={() => logout()} style={styles.logoutButton}>logout</Button>
            </View>
        </DefaultView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: Spacing["3xl"],
        paddingHorizontal: Spacing.md,
    },
    header: {
        fontSize: 24,
        fontWeight: "600",
        color: Colors.text,
        marginBottom: Spacing.xl,
    },
    avatarContainer: {
        marginBottom: Spacing["2xl"],
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.primary["500"],
        alignItems: "center",
        justifyContent: "center",
    },
    infoCard: {
        width: "90%",
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
    },
    label: {
        fontSize: 14,
        color: Colors.gray["500"],
        marginBottom: Spacing.xs / 2,
    },
    value: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: "500",
    },
    logoutButton: {
        marginTop: Spacing.xl,
    },
});