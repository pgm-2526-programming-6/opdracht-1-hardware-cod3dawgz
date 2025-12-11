import useUser from "@functional/auth/useUser";
import { AttendanceWithCampus } from "@core/modules/attendances/types.attendances";
import { getAttendancesByUserId } from "@core/modules/attendances/api.attendances";
import ErrorMessage from "@design/Alert/ErrorMessage";
import LoadingIndicator from "@design/Loading/LoadingIndicator";
import DefaultView from "@design/View/DefaultView";
import EmptyView from "@design/View/EmptyView";
import AttendanceCalendar from "@functional/calendar/AttendanceCalendar";
import { useQuery } from "@tanstack/react-query";
import { ScrollView } from "react-native";

export default function AttendancesPage() {

  const user = useUser();
  const userId = user?.id;

  const {
      data: attendances,
      error, 
      isLoading,
    } = useQuery<AttendanceWithCampus[]>({
      queryKey: ["attendances", userId], 
      queryFn: () => getAttendancesByUserId(userId),
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

  if (attendances.length === 0) {
    return (
      <EmptyView
        title="No Attendances"
        description="You have no attendances yet."
        icon="calendar-today"
      />
    );
  }

  // Extract dates from attendances
  const attendanceDates = attendances.map(attendance => attendance.date);

  return (
    <DefaultView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AttendanceCalendar attendanceDates={attendanceDates} />
      </ScrollView>
    </DefaultView>
  );
};