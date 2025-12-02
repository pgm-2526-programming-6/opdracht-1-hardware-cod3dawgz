import { useState, useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { getUsers } from "@core/modules/users/api.users";
import { User } from "@core/modules/users/types.users";
import useLocation from "../components/functional/location/location";
import QRCode from "../app/qrcode/qrcode";

export default function Index() {
  const [users, setUsers] = useState<User[] | null>();
  const [userError, setUserError] = useState<string | null>(null);

  const { position } = useLocation();

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
      {userError && (
        <Text style={{ color: "red", marginTop: 10 }}>
          User Error: {userError}
        </Text>
      )}

      {position ? (
        <View style={{ marginTop: 15 }}>
          <Text>Latitude: {position.coords.latitude}</Text>
          <Text>Longitude: {position.coords.longitude}</Text>
          <Text>Accuracy: {position.coords.accuracy} meters</Text>
        </View>
      ) : (
        <Text>Loading location...</Text>
      )}


      <QRCode />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: User }) => <Text>{item.name}</Text>}
      />
    </View>
  );
}
