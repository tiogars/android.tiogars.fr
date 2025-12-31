# Android Apps Manager

A React TypeScript web application for managing your Android apps collection in your browser.

## Features

- ✨ **Modern UI**: Built with Material-UI components for a polished experience
- 📱 **App Management**: Add, edit, and delete Android app entries
- 🏷️ **Category Tags**: Organize apps with multiple category tags
- 🔍 **Smart Filtering**: Filter apps by categories
- 🎨 **Theme Toggle**: Switch between light and dark themes
- 💾 **Local Storage**: All data persists in your browser using IndexedDB
- 📦 **Import/Export**: Backup and restore your data with JSON files
- 🔗 **Play Store Links**: Quick access to apps on Google Play Store
- 🖼️ **Icon Upload**: Upload custom app icons
- 📱 **Responsive Design**: Works great on desktop, tablet, and mobile
- 🚀 **Progressive Web App (PWA)**: Install on your device for offline access
- 🔗 **Share Target**: Share apps directly from the Play Store to this app

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (Install with: `npm install -g pnpm` or see [pnpm.io](https://pnpm.io/installation))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tiogars/android-apps.git
cd android-apps
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
pnpm run build
```

The built files will be in the `dist` directory.

## Usage

### Adding an App

1. Click the floating **+** button in the bottom-right corner
2. Fill in the app details:
   - **App Name** (required)
   - **Package Name** (required) - e.g., `com.example.app`
   - **Description** (optional)
   - **Categories** - Add one or more tags
   - **Icon** - Upload a custom icon (optional)
3. Click **Add** to save

### Filtering Apps

- Click on any category tag in the filter panel to show only apps with that category
- Click the **Clear Filters** button to show all apps

### Importing/Exporting Data

1. Click **Import/Export** in the top navigation
2. **Export**: Download your current data as a JSON file
3. **Import**: Upload a previously exported JSON file or paste JSON data
   - ⚠️ **Warning**: Importing will replace all existing data

### Viewing in Play Store

Click the **Play Store** button on any app card to open it in the Google Play Store.

## Progressive Web App (PWA)

This application is a fully-featured Progressive Web App that can be installed on your device.

### Installing the PWA

#### On Desktop (Chrome, Edge, Brave)
1. Visit the website
2. Look for the install icon (➕ or ⬇️) in the address bar
3. Click "Install" to add it to your desktop

#### On Mobile (Android)
1. Visit the website in Chrome
2. Tap the three-dot menu
3. Select "Add to Home screen" or "Install app"
4. The app will appear on your home screen like a native app

### Share Target Feature

The PWA supports receiving shared content from other apps, particularly from the Google Play Store:

1. **Install the PWA** on your Android device (see instructions above)
2. Open an app in the **Google Play Store**
3. Tap the **Share** button
4. Select **Android Apps Manager** from the share menu
5. The app will open with a pre-filled form containing:
   - App name
   - Package name (extracted from the Play Store URL)
   - Description

This makes it easy to quickly add apps to your collection directly from the Play Store!

### Offline Support

Once installed, the PWA includes:
- **Offline functionality**: Access your app collection without an internet connection
- **Service Worker caching**: Fast loading and reliable performance powered by Workbox
- **Installable**: Works like a native app on your device
- **Automatic Asset Precaching**: All app assets are cached during installation for instant offline access

### Automatic Updates

The PWA automatically checks for updates and notifies you when a new version is available:

1. **Update Detection**: The app checks for updates:
   - Immediately when you open or reload the app
   - Every hour while the app is open
2. **User Notification**: When an update is available, you'll see a blue notification bar at the bottom of the screen with an "UPDATE" button
3. **User Control**: Click the "UPDATE" button to apply the update and reload the app
4. **Seamless Experience**: Updates are applied instantly without losing your data

**How it works:**
- Each deployment generates a unique service worker version with content hashes
- Workbox precaches all build assets (JS, CSS, HTML, images) during service worker installation
- When a new deployment occurs, the old cache is automatically cleaned up
- Your data in IndexedDB is never affected by updates

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **vite-plugin-pwa** - PWA automation with Workbox
- **Material-UI (MUI)** - Component library
- **IndexedDB** - Primary data persistence
- **Workbox** - Service worker and caching strategies
- **Web App Manifest** - PWA configuration

## License

See [LICENSE](LICENSE) file for details.
