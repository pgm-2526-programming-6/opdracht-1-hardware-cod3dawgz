import useUser from "@functional/auth/useUser";
import { AttendanceWithCampus } from "@core/modules/attendances/types.attendances";
import { getAttendancesByUserId } from "@core/modules/attendances/api.attendances";
import ErrorMessage from "@design/Alert/ErrorMessage";
import ListItem from "@design/List/ListItem";
import LoadingIndicator from "@design/Loading/LoadingIndicator";
import DefaultView from "@design/View/DefaultView";
import EmptyView from "@design/View/EmptyView";
import { useQuery } from "@tanstack/react-query";
import { FlatList } from "react-native";

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
        icon="calendar"
      />
    );
  }

  return (
    <DefaultView padding={false}>
        <FlatList
            data={attendances}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }: { item: AttendanceWithCampus }) => (
                <ListItem
                    title={item.date}
                    description={`campus: ${item.campus?.name ?? "Unknown"}`}
                />

        )}/>
    </DefaultView>
    );
};