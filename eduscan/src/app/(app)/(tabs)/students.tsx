import useUser from "@functional/auth/useUser";
import { AttendanceWithStudent } from "@core/modules/attendances/types.attendances";
import { getAttendancesByTeacherId } from "@core/modules/attendances/api.attendances";
import ErrorMessage from "@design/Alert/ErrorMessage";
import ListItem from "@design/List/ListItem";
import LoadingIndicator from "@design/Loading/LoadingIndicator";
import DefaultView from "@design/View/DefaultView";
import EmptyView from "@design/View/EmptyView";
import { useQuery } from "@tanstack/react-query";
import { FlatList, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors, Spacing, FontSizes, Fonts } from "@style/theme";
import ThemedText from "@design/Typography/ThemedText";

import { getProfiles } from "@core/modules/profiles/api.profiles";
import { Profile } from "@core/modules/profiles/types.profiles";
import { useState } from "react";

type FilterStatus = "all" | "present" | "absent";

export default function AttendancesPage() {
  const user = useUser();
  const userId = user?.id;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

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

  const filteredStudents = studentAttendanceStatus.filter((item) => {
    const fullName = `${item.student.first_name} ${item.student.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "present" && item.status === "success") ||
      (filterStatus === "absent" && item.status === "error");

    return matchesSearch && matchesStatus;
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
      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={Colors.gray["400"]} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name..."
            placeholderTextColor={Colors.gray["400"]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialIcons name="close" size={20} color={Colors.gray["400"]} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === "all" && styles.filterButtonActive]}
            onPress={() => setFilterStatus("all")}
          >
            <ThemedText style={[styles.filterButtonText, filterStatus === "all" && styles.filterButtonTextActive]}>
              All ({studentAttendanceStatus.length})
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === "present" && styles.filterButtonActive]}
            onPress={() => setFilterStatus("present")}
          >
            <ThemedText style={[styles.filterButtonText, filterStatus === "present" && styles.filterButtonTextActive]}>
              Present ({studentAttendanceStatus.filter(s => s.status === "success").length})
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filterStatus === "absent" && styles.filterButtonActive]}
            onPress={() => setFilterStatus("absent")}
          >
            <ThemedText style={[styles.filterButtonText, filterStatus === "absent" && styles.filterButtonTextActive]}>
              Absent ({studentAttendanceStatus.filter(s => s.status === "error").length})
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.student.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No students match your filters</ThemedText>
          </View>
        }
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

const styles = StyleSheet.create({
  filterContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray["200"],
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray["100"],
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.default,
    fontFamily: Fonts.regular,
    color: Colors.text,
  },
  filterButtons: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    backgroundColor: Colors.gray["100"],
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: Colors.primary["600"],
  },
  filterButtonText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.semiBold,
    color: Colors.gray["600"],
  },
  filterButtonTextActive: {
    color: Colors.white,
  },
  emptyContainer: {
    padding: Spacing["3xl"],
    alignItems: "center",
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.gray["500"],
    textAlign: "center",
  },
});
