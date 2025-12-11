// // --- TYPE DEFINITIONS ---

// export interface Campus {
//   id: string;
//   name: string;
//   address: string;
// }

// export interface Class {
//   id: string;
//   name: string;
// }

// export interface Profile {
//   id: string;
//   user_id: string; // The unique ID used for QR code payload ('1' or '2')
//   email: string;
//   name: string;
//   is_teacher: boolean;
//   class_id: string | null;
// }

// export interface Attendance {
//   id: string;
//   student_id: string; // points to Profile.id
//   teacher_id: string; // points to Profile.id
//   date: string; // YYYY-MM-DD
//   campus_id: string;
// }

// export interface QrPayload {
//   studentId: string;
//   timestamp: number;
// }

// // --- MOCK DATA ---

// const MOCK_CAMPUS_ID = 'campus-1';
// const MOCK_CLASS_ID = 'class-101';

// // Simplified IDs as requested: student user_id '1', teacher user_id '2'
// export const MOCK_STUDENT_USER_ID = '1';
// export const MOCK_TEACHER_USER_ID = '2';

// export const MOCK_CLASS: Class = {
//   id: MOCK_CLASS_ID,
//   name: "Advanced React Native Development",
// };

// export const MOCK_PROFILES: Profile[] = [
//   {
//     id: 'profile-t2',
//     user_id: MOCK_TEACHER_USER_ID,
//     email: "professor.a@school.edu",
//     name: "Dr. Alice Smith (Teacher)",
//     is_teacher: true,
//     class_id: null,
//   },
//   {
//     id: 'profile-s1',
//     user_id: MOCK_STUDENT_USER_ID,
//     email: "student.b@school.edu",
//     name: "Bob Johnson (Student)",
//     is_teacher: false,
//     class_id: MOCK_CLASS_ID,
//   },
// ];

// const getProfileIdByUserId = (userId: string) => 
//     MOCK_PROFILES.find(p => p.user_id === userId)?.id || 'unknown';

// const STUDENT_PROFILE_ID = getProfileIdByUserId(MOCK_STUDENT_USER_ID);
// const TEACHER_PROFILE_ID = getProfileIdByUserId(MOCK_TEACHER_USER_ID);

// // MOCK_ATTENDANCES is exported so we can simulate adding records later
// export const MOCK_ATTENDANCES: Attendance[] = [
//   {
//     id: 'att-1',
//     student_id: STUDENT_PROFILE_ID,
//     teacher_id: TEACHER_PROFILE_ID,
//     date: '2025-11-25',
//     campus_id: MOCK_CAMPUS_ID,
//   },
// ];

// /**
//  * Generates the JSON payload for the QR code.
//  */
// export const generateQrPayload = (studentUserId: string): string => {
//     const payload: QrPayload = {
//       studentId: studentUserId,
//       timestamp: Date.now(),
//     };
//     return JSON.stringify(payload);
// };

// /**
//  * MOCK SCAN LOGIC: Simulates the attendance check and 'database' write.
//  * NOTE: MOCK_ATTENDANCES is mutated in this mock setup for demonstration.
//  */
// export const mockScan = (qrValue: string, teacherUserId: string): string => {
//     try {
//         const payload: QrPayload = JSON.parse(qrValue);
//         const studentProfile = MOCK_PROFILES.find(p => p.user_id === payload.studentId);
//         const teacherProfile = MOCK_PROFILES.find(p => p.user_id === teacherUserId && p.is_teacher);

//         if (!studentProfile || !teacherProfile) {
//             return "Scan Failed: Invalid User ID.";
//         }
        
//         const studentProfileId = studentProfile.id;
//         const today = new Date().toISOString().split('T')[0];

//         // Check for double attendance on the current date
//         const alreadyAttended = MOCK_ATTENDANCES.some(
//             a => a.student_id === studentProfileId && a.date === today
//         );
        
//         if (alreadyAttended) {
//             return `Attendance Already Recorded for ${studentProfile.name} today.`;
//         }

//         // MOCK SUCCESS: Record attendance 
//         const newAttendance: Attendance = {
//             id: `att-${MOCK_ATTENDANCES.length + 1}`,
//             student_id: studentProfile.id,
//             teacher_id: teacherProfile.id,
//             date: today,
//             campus_id: MOCK_CLASS.id, 
//         };

//         // Mutate the mock array to simulate saving to the database
//         MOCK_ATTENDANCES.push(newAttendance);

//         return `SUCCESS: Attendance recorded for ${studentProfile.name}!`;

//     } catch (e) {
//         return "Scan Failed: Invalid QR code format.";
//     }
// };