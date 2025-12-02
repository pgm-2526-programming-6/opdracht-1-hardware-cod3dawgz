import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { getProfiles } from "@core/modules/profiles/api.profiles";
import { Profile } from "@core/modules/profiles/types.profiles";
import { useEffect } from "react";
import { Link, useRouter } from "expo-router";
import Button from "@design/Button/Button";
import { logout } from "@core/modules/auth/api.auth";

export default function Index() {
  const [profiles, setProfiles] = useState<Profile[] | null>();
  const [error, setError] = useState<String | null>(null);

  useEffect(() => {
    getProfiles()
      .then((profiles) => {
        setProfiles(profiles);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  return (
    <View>
      <Link href="../(auth)/register">Go to Register</Link>
      <Link href="../(auth)/login">Go to Login</Link>

      <Button onPress={() => logout()}>logout</Button>

      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: Profile }) => (
          <Text>{item.first_name}</Text>
        )}
      />
    </View>
  );
}
