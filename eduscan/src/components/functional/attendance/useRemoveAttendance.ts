import { Alert } from "react-native";
import { removeAttendanceById } from "@core/modules/attendances/api.attendances";
import { useQueryClient } from "@tanstack/react-query";

export default function useRemoveAttendance(userId?: string) {

  const queryClient = useQueryClient();

  const confirmAndRemove = (attendanceId: number) => {
    Alert.alert(
      "Remove Attendance",
      "Do you want to remove this attendance?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeAttendanceById(attendanceId);

              queryClient.invalidateQueries({ queryKey: ["attendances"] });
            } catch (err) {
              console.error("Failed to remove attendance:", err);
            }
          },
        },
      ]
    );
  };

  return confirmAndRemove;
}
