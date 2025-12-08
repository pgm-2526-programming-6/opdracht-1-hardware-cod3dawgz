import { useState, useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { getUsers } from "@core/modules/users/api.users";
import { User } from "@core/modules/users/types.users";
import QRCode from "../app/qrcode/qrcode";

export default function Index() {
  const [users, setUsers] = useState<User[] | null>();
  const [userError, setUserError] = useState<string | null>(null);


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
      <QRCode />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: User }) => <Text>{item.name}</Text>}
      />
    </View>
  );
}
