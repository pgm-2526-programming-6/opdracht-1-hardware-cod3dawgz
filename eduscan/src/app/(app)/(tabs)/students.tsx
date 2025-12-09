import useUser from "@functional/auth/useUser";
import { AttendanceWithStudent } from "@core/modules/attendances/types.attendances";
import { getAttendancesByTeacherId } from "@core/modules/attendances/api.attendances";
import ErrorMessage from "@design/Alert/ErrorMessage";
import ListItem from "@design/List/ListItem";
import LoadingIndicator from "@design/Loading/LoadingIndicator";
import DefaultView from "@design/View/DefaultView";
import EmptyView from "@design/View/EmptyView";
import { useQuery } from "@tanstack/react-query";
import { FlatList } from "react-native";
import { Text } from "react-native";

import { getProfiles } from "@core/modules/profiles/api.profiles";
import { Profile } from "@core/modules/profiles/types.profiles";

export default function AttendancesPage() {
  const user = useUser();
  const userId = user?.id;

  const {
    data: attendances,
    error,
    isLoading,
  } = useQuery<AttendanceWithStudent[]>({
    queryKey: ["attendances", userId],
    queryFn: () => getAttendancesByTeacherId(userId),
    enabled: !!userId,
  });

  const { data: profiles } = useQuery<Profile[]>({
    queryKey: ["profiles"],
    queryFn: () => getProfiles(),
    enabled: !!userId,
  });

  if (error) {
    return (
      <DefaultView>
        <ErrorMessage error={error} />
      </DefaultView>
    );
  }

  if (isLoading || !attendances) {
    return (
      <DefaultView>
        <LoadingIndicator />
      </DefaultView>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  const attendancesToday = attendances.filter(
    (item) => item.date?.split("T")[0] === today
  );

  const students = profiles?.filter((profile) => profile.is_teacher === false);

  if (!students) {
    return (
      <EmptyView
        title="No students"
        description="You have no students in your class"
        icon="calendar"
      />
    );
  }

  const studentAttendanceStatus = students.map((student) => {
    const attendance = attendancesToday.find(
      (att) => att.student.id === student.id
    );
    return {
      student: student,
      status: attendance ? "success" : "error",
      campus: attendance ? attendance.campus : null,
    };
  });

  if (studentAttendanceStatus.length === 0) {
    return (
      <EmptyView
        title="No Attendances Today"
        description="You have no attendances for today."
        icon="calendar"
      />
    );
  }

  return (
    <DefaultView padding={false}>
      <Text>Todays Students</Text>
      <FlatList
        data={studentAttendanceStatus}
        keyExtractor={(item) => item.student.id}
        renderItem={({ item }) => (
          <ListItem
          title={(item.student.first_name && item.student.last_name) 
              ? `${item.student.first_name} ${item.student.last_name}` 
              : undefined}
            variant={item.status}
            description={item.campus ? `campus: ${item.campus.name}` : "Absent"}
            onPress={() => {}}
          />
        )}
      />
    </DefaultView>
  );
}
