import Icons from "@expo/vector-icons/Feather";
import { DefaultScreenOptions } from "@style/theme";
import { Tabs } from "expo-router";

const TabLayout = () => {

  return (
    <Tabs screenOptions={DefaultScreenOptions}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Icons size={size} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="attendances"
        options={{
          title: "Attendances",
          tabBarIcon: ({ color, size }) => <Icons size={size} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Icons size={size} name="info" color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
