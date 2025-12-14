import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DefaultScreenOptions } from "@style/theme";
import { Tabs } from "expo-router";
import useUser from "@functional/auth/useUser";

const TabLayout = () => {

  const user = useUser();
  const isTeacher = user.is_teacher;
  
  return (
    <Tabs screenOptions={{ ...DefaultScreenOptions, headerTitle: "" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: isTeacher ? "Scan" : "Code",
          tabBarIcon: ({ color, size }) => <MaterialIcons size={size} name={isTeacher ? "qr-code-scanner" : "qr-code"}  color={color} />,
        }}
      />
      <Tabs.Screen
        name="attendances"
        options={{
          title: "Attendances",
          tabBarIcon: ({ color, size }) => <MaterialIcons size={size} name="calendar-month" color={color} />,
          href: isTeacher ? null : "/attendances",
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          title: "Students",
          tabBarIcon: ({ color, size }) => <MaterialIcons size={size} name="check" color={color} />,
          href: isTeacher ? "/students" : null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <MaterialIcons size={size} name="info" color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
