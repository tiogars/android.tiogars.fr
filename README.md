# Android Apps Manager

A React TypeScript web application for managing your Android apps collection in your browser.

## Features

- ✨ **Modern UI**: Built with Material-UI components for a polished experience
- 📱 **App Management**: Add, edit, and delete Android app entries
- 🏷️ **Category Tags**: Organize apps with multiple category tags
- 🔍 **Smart Filtering**: Filter apps by categories
- 🎨 **Theme Toggle**: Switch between light and dark themes
- 💾 **Local Storage**: All data persists in your browser
- 📦 **Import/Export**: Backup and restore your data with JSON files
- 🔗 **Play Store Links**: Quick access to apps on Google Play Store
- 🖼️ **Icon Upload**: Upload custom app icons
- 📱 **Responsive Design**: Works great on desktop, tablet, and mobile

## Getting Started

### Prerequisites

- Node.js 18+
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

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **Local Storage API** - Data persistence

## License

See [LICENSE](LICENSE) file for details.
