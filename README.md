﻿# ⚡ EV Charger Mobile App L2

A cross-platform React Native mobile application built for an EV infrastructure company. This app allows users to locate nearby EV charging stations with detailed info, view them on an interactive map, and capture screenshots saved directly to device storage in `.webp` format.

---

## 📱 Features

- 🗺️ Interactive Google Map showing dynamic charger locations
- 📍 User’s current location is indicated by a custom **pink marker**
- 🔌 Cards display charger details including:
  - Name, address, and distance
  - Connector types and speeds
- 🔍 Clean UI with Search bar, Hamburger menu, and filter icon
- 📸 Floating Action Button (FAB) captures map screenshot
- ☁️ Smooth upload progress modal for screenshot
- 💾 Screenshot saved locally in **WEBP** format
- 🔄 Platform support: **Android & iOS**

---

## 🧠 Tech Stack

- **React Native + Expo**
- **TypeScript**
- **Google Maps API**
- `react-native-maps`
- `expo-location`
- `expo-media-library`
- `react-native-view-shot`
- `FlatList` for scrollable charger card UI

---

## 🗂️ Folder Structure

```
EvChargerApp/
├── assets/
│   ├── icons/                 # Charger icons
│   └── data/chargers.json     # Dynamic charger data
├── components/
│   └── SearchBar.tsx
├── screens/
│   └── HomeScreen.tsx
├── utils/
│   └── connectorIcons.ts
├── App.tsx
└── ...
```

---

## 🔧 Getting Started

### Prerequisites

- Node.js ≥ 16
- Expo CLI installed globally (`npm install -g expo-cli`)
- Android Studio Emulator or Expo Go on mobile

### Install & Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/EvChargerApp.git
cd EvChargerApp
npm install
npx expo start
```

---

## 📦 Building the APK

To generate a standalone APK for Android:

```bash
npx eas build -p android --profile preview
```

> Ensure that `eas.json` is configured and Expo account is linked.

---

## 📸 Screenshots

<div align="center">
  <img src="./screenshots/map.png" width="250"/>
  <img src="./screenshots/capture.png" width="250"/>
  <img src="./screenshots/modal.png" width="250"/>
</div>

---

## ✅ Project Checklist

| Feature                                             | Status  |
|-----------------------------------------------------|---------|
| Load dynamic charger data from JSON                 | ✅ Done |
| Pink marker for current user location               | ✅ Done |
| Interactive map with charger station markers        | ✅ Done |
| Display charger details: name, address, connectors  | ✅ Done |
| Search bar UI with hamburger and filter             | ✅ Done |
| Screenshot capture (map section only)               | ✅ Done |
| Save image in `.webp` format                        | ✅ Done |
| Upload simulation with progress bar                 | ✅ Done |
| Compatible with Android & iOS                       | ✅ Done |
| Google Drive folder integration ready               | ✅ Done |
| APK built and tested                                | ✅ Done |
| GitHub repo with commits, README, and screenshots   | ✅ Done |

---

## 📁 Charger Data Format

```json
{
  "chargers": [
    {
      "name": "expressway charging - mariam enterprise",
      "id": "a001",
      "address": "connaught place, delhi",
      "distance": "2102",
      "distance_metrics": "metres",
      "latitude": "22.4532122",
      "longitude": "77.4545322",
      "connector_types": ["lvl1dc-2", "lvl2dc-1", "normalac-1"]
    }
  ]
}
```

> `connector_types` has format `type-count` (e.g., `"lvl2dc-1"` means 1 Level 2 DC connector).

---

## 🔗 Acknowledgements

- 📍 Google Maps: [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- 🖼️ Icons: [Flaticon](https://www.flaticon.com/)
- 📷 Screenshot: [`react-native-view-shot`](https://github.com/gre/react-native-view-shot)
- 📦 File handling: `expo-media-library`, `expo-file-system`

---

## 🤝 Final Notes

- Clean, component-based architecture.
- Built with mobile-first UX and visual clarity.
- Ready for evaluation and production enhancement.

---

> This project is submitted as part of an assignment. All data used is for demonstration purposes only.

