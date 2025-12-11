import { View, Text, StyleSheet } from "react-native";
import { Colors, Spacing, FontSizes, Fonts } from "@style/theme";

type AttendanceCalendarProps = {
  attendanceDates: string[]; // Array of dates in 'YYYY-MM-DD' format
  currentMonth?: Date;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const AttendanceCalendar = ({ attendanceDates, currentMonth = new Date() }: AttendanceCalendarProps) => {
  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Convert attendance dates to Set for quick lookup
  const attendanceSet = new Set(
    attendanceDates.map(date => {
      const d = new Date(date);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const hasAttendance = (day: number) => {
    const dateKey = `${year}-${month}-${day}`;
    return attendanceSet.has(dateKey);
  };

  const isPastWeekday = (day: number) => {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    // Check if it's a weekday (Mon-Fri) and in the past
    return dayOfWeek !== 0 && dayOfWeek !== 6 && date < today && !isToday(day);
  };

  const isAbsent = (day: number) => {
    return isPastWeekday(day) && !hasAttendance(day);
  };

  // Build calendar grid (weekdays only: Mon-Fri)
  const renderCalendarDays = () => {
    const days = [];
    
    // Adjust firstDay: 0=Sun, 1=Mon, ..., 6=Sat
    // For Mon-Fri grid: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4
    // Map Sunday (0) -> skip, Monday (1) -> 0, ..., Friday (5) -> 4, Saturday (6) -> skip
    const adjustedFirstDay = firstDay === 0 || firstDay === 6 ? -1 : firstDay - 1;
    
    let dayCounter = 1;
    let currentDayOfWeek = firstDay; // Track actual day of week

    // Calculate total rows needed
    let totalWeekdays = 0;
    let tempDay = 1;
    let tempDayOfWeek = firstDay;
    while (tempDay <= daysInMonth) {
      if (tempDayOfWeek !== 0 && tempDayOfWeek !== 6) {
        totalWeekdays++;
      }
      tempDay++;
      tempDayOfWeek = (tempDayOfWeek + 1) % 7;
    }
    
    const rows = Math.ceil((adjustedFirstDay >= 0 ? adjustedFirstDay : 0) + totalWeekdays / 5);

    for (let row = 0; row < rows; row++) {
      const week = [];
      for (let col = 0; col < 5; col++) {
        const index = row * 5 + col;
        
        // Check if we should show a day or empty cell
        if ((row === 0 && adjustedFirstDay >= 0 && col < adjustedFirstDay) || dayCounter > daysInMonth) {
          // Empty cell
          week.push(<View key={`empty-${index}`} style={styles.dayCell} />);
        } else if (dayCounter <= daysInMonth) {
          // Skip weekends
          while (dayCounter <= daysInMonth && (currentDayOfWeek === 0 || currentDayOfWeek === 6)) {
            dayCounter++;
            currentDayOfWeek = (currentDayOfWeek + 1) % 7;
          }
          
          if (dayCounter <= daysInMonth) {
            const day = dayCounter;
            const isTodayDay = isToday(day);
            const hasAttendanceDay = hasAttendance(day);
            const isAbsentDay = isAbsent(day);

            week.push(
              <View key={day} style={styles.dayCell}>
                <View
                  style={[
                    styles.dayContent,
                    isTodayDay && styles.todayContent,
                    !isTodayDay && hasAttendanceDay && styles.presentContent,
                    !isTodayDay && isAbsentDay && styles.absentContent,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isTodayDay && styles.todayText,
                      !isTodayDay && hasAttendanceDay && styles.presentText,
                      !isTodayDay && isAbsentDay && styles.absentText,
                    ]}
                  >
                    {day}
                  </Text>
                  {!isTodayDay && hasAttendanceDay && <View style={styles.presentDot} />}
                  {!isTodayDay && isAbsentDay && <View style={styles.absentDot} />}
                </View>
              </View>
            );
            dayCounter++;
            currentDayOfWeek = (currentDayOfWeek + 1) % 7;
          }
        }
      }
      
      if (week.length > 0) {
        days.push(
          <View key={`row-${row}`} style={styles.weekRow}>
            {week}
          </View>
        );
      }
    }

    return days;
  };

  return (
    <View style={styles.container}>
      {/* Month/Year Header */}
      <Text style={styles.monthText}>
        {MONTHS[month]} {year}
      </Text>

      {/* Calendar Card */}
      <View style={styles.calendarCard}>
        {/* Day Headers */}
        <View style={styles.weekRow}>
          {DAYS.map((day) => (
            <View key={day} style={styles.dayHeaderCell}>
              <Text style={styles.dayHeaderText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Days */}
        {renderCalendarDays()}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSquare, styles.todayLegendSquare]} />
          <Text style={styles.legendText}>Today</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSquare, styles.presentLegendSquare]} />
          <Text style={styles.legendText}>Present</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSquare, styles.absentLegendSquare]} />
          <Text style={styles.legendText}>Absent</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  monthText: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  calendarCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.xl,
    width: "100%",
    maxWidth: 420,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Spacing.xs,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  dayHeaderText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.gray["600"],
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  dayContent: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    position: "relative",
  },
  todayContent: {
    backgroundColor: Colors.primary["600"],
  },
  presentContent: {
    backgroundColor: "#d1fae5",
    borderWidth: 1.5,
    borderColor: "#6ee7b7",
  },
  absentContent: {
    backgroundColor: "#fee2e2",
    borderWidth: 1.5,
    borderColor: "#fca5a5",
    borderRadius: 12,
  },
  dayText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    color: Colors.gray["700"],
  },
  todayText: {
    color: Colors.white,
    fontFamily: Fonts.bold,
  },
  presentText: {
    color: "#065f46",
    fontFamily: Fonts.semiBold,
  },
  absentText: {
    color: "#991b1b",
    fontFamily: Fonts.semiBold,
  },
  presentDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#10b981",
    position: "absolute",
    bottom: 6,
  },
  absentDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ef4444",
    position: "absolute",
    bottom: 6,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xl,
    gap: Spacing.xl,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  legendSquare: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  todayLegendSquare: {
    backgroundColor: Colors.primary["600"],
  },
  presentLegendSquare: {
    backgroundColor: "#d1fae5",
    borderWidth: 2,
    borderColor: "#6ee7b7",
  },
  absentLegendSquare: {
    backgroundColor: "#fee2e2",
    borderWidth: 2,
    borderColor: "#fca5a5",
  },
  legendText: {
    fontSize: FontSizes.default,
    fontFamily: Fonts.regular,
    color: Colors.gray["700"],
  },
});

export default AttendanceCalendar;
