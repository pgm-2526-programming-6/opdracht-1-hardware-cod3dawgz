# Welcome to your Eduscan

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## About

### Overview
This application is used to register student attendance using QR codes. Teachers scan a student’s QR code to mark attendance, while students can view their current status and attendance history.

---

### Features

#### Teacher
- Can scan a student’s QR code
- A successful scan marks the student as **present** for that day
- Scanning a student who is already marked as present results in an error
- The campus location is stored based on the teacher’s location
- Can view a real-time list of present students
- Can manually mark a student as **absent** if the student leaves early

#### Student
- Can display their personal QR code
- Can view their current attendance status (present/absent)
- Can view a history of days on which they were present


## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npm run start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo


## Contributers
- [Maurice Halsberghe](https://github.com/mauriceHalsberghe)
- [Wout Vanderbauwhede](https://github.com/pgm-woutvande22)
- [Berre Ongena](https://github.com/Berre-O)
- [Mauro Ongena](https://github.com/mauroongena)


