import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { getUsers } from "@core/modules/users/api.users";
import { User } from "@core/modules/users/types.users";
import { useEffect } from "react";
import { useLocation } from "../components/functional/location/location";

export default function Index() {
  const [users, setUsers] = useState<User[] | null>();
  const [userError, setUserError] = useState<string | null>(null);

  const { location, permission, locationError } = useLocation();

  useEffect(() => {
    getUsers()
      .then((users) => {
        setUsers(users);
      })
      .catch((error) => {
        setUserError(error.message);
      });
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Permission: {permission ?? "checking..."}</Text>

      {userError && (
        <Text style={{ color: "red", marginTop: 10 }}>
          User Error: {userError}
        </Text>
      )}
      {locationError && (
        <Text style={{ color: "red", marginTop: 10 }}>
          Location Error: {locationError}
        </Text>
      )}

      {location ? (
        <View style={{ marginTop: 15 }}>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          <Text>Accuracy: {location.coords.accuracy} meters</Text>
        </View>
      ) : (
        !locationError && <Text>Loading location...</Text>
      )}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: User }) => <Text>{item.name}</Text>}
      />
    </View>
  );
}
