# GitHub Copilot Instructions for Android Apps Manager

## Project Overview

This is a React TypeScript web application for managing Android app collections in the browser. It's a single-page application (SPA) built with modern web technologies, providing a Material-UI interface for organizing, categorizing, and managing Android app information.

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **UI Library**: Material-UI (MUI) v7
- **Styling**: Emotion (CSS-in-JS via MUI)
- **Storage**: IndexedDB (via `idb` library) with LocalStorage fallback
- **Linting**: ESLint 9 with TypeScript ESLint plugin
- **Package Manager**: pnpm 10

## Development Setup

### Prerequisites
- Node.js 18 or higher
- pnpm 10.26.2+ (specified in package.json)

### Installation
```bash
pnpm install --frozen-lockfile
```

### Development Commands
- `pnpm run dev` - Start development server (usually http://localhost:5173)
- `pnpm run build` - Build for production (TypeScript compilation + Vite build)
- `pnpm run lint` - Run ESLint on the codebase
- `pnpm run preview` - Preview production build locally

## Code Style and Conventions

### TypeScript
- **Strict mode** is enabled - all TypeScript strict checks are enforced
- Use explicit type annotations for function parameters and return types when not obvious
- Prefer `interface` for object types (see `types.ts`)
- Use `type` for union types and type aliases
- Import types with `import type` syntax when importing only types

### React Patterns
- Use functional components with hooks (no class components)
- Follow React Hooks rules (enforced by `eslint-plugin-react-hooks`)
- Use `useState` for local state, `useEffect` for side effects, `useMemo` for computed values
- Component files use PascalCase (e.g., `AppList.tsx`, `AppFormDialog.tsx`)

### File Organization
```
src/
├── types.ts              # TypeScript type definitions
├── storageService.ts     # IndexedDB/LocalStorage abstraction
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
├── components/          # React components
│   ├── AppList.tsx
│   ├── AppFormDialog.tsx
│   ├── FilterPanel.tsx
│   ├── ImportExportDialog.tsx
│   └── Footer.tsx
└── assets/              # Static assets
```

### Naming Conventions
- **Components**: PascalCase (e.g., `AppList`, `AppFormDialog`)
- **Functions**: camelCase (e.g., `getApps`, `saveApps`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DB_NAME`, `STORAGE_KEY`)
- **Interfaces/Types**: PascalCase (e.g., `AndroidApp`, `ThemeMode`)

### Import Order
1. React and React-related imports
2. External libraries (MUI, idb, etc.)
3. Internal types (from `./types`)
4. Internal services (from `./storageService`)
5. Internal components (from `./components`)

### Storage Layer
- Primary storage: IndexedDB (via `storageService.ts`)
- Fallback: LocalStorage (for error cases)
- Migration logic exists for legacy data
- Always use `storageService` for data persistence, never access storage directly

### Error Handling
- Use try-catch blocks for async operations
- Provide fallback behavior for storage failures
- Display user-friendly error messages via Snackbar component
- Catch blocks may be empty when fallback behavior is sufficient (see `storageService.ts`)

## Component Guidelines

### Material-UI Usage
- Import components from `@mui/material`
- Import icons from `@mui/icons-material`
- Use MUI's theming system (dark/light mode support)
- Follow MUI's component API and prop conventions
- Prefer MUI components over custom styled components

### State Management
- Local component state with `useState` (no global state management library)
- App state is managed in `App.tsx` and passed down via props
- Data persistence handled by `storageService`

### Forms and Dialogs
- Use MUI Dialog components for modals
- Use controlled form inputs
- Validate input data before saving
- Provide clear feedback for user actions (success/error snackbars)

## Data Model

### AndroidApp Interface
```typescript
{
  id: string;              // Unique identifier
  name: string;            // App name (required)
  packageName: string;     // Package name (required, e.g., "com.example.app")
  category: string[];      // Array of category tags
  description: string;     // App description
  icon?: string;          // Optional base64 encoded image or URL
}
```

## Build and Deployment

### Build Process
1. TypeScript compilation (`tsc -b`)
2. Vite build (optimized production bundle)
3. Output directory: `dist/`

### Deployment
- Deployed to GitHub Pages automatically via GitHub Actions
- Workflow: `.github/workflows/deploy.yml`
- Triggers on push to `main` branch or manual workflow dispatch
- Base path is `/` (configured in `vite.config.ts`)

### Dependencies
- Production dependencies are UI/functionality related
- Development dependencies include build tools and linting
- Dependabot is configured for automatic dependency updates (weekly on Mondays)

## Testing

Currently, there is no formal testing infrastructure in this project. When adding tests:
- Use a testing framework compatible with Vite (e.g., Vitest)
- Follow React Testing Library patterns for component tests
- Test user interactions and data flow, not implementation details

## Important Notes for Copilot

1. **Package Manager**: Always use `pnpm`, never `npm` or `yarn`
2. **TypeScript**: Respect strict mode - do not use `any` types or `@ts-ignore` unless absolutely necessary
3. **Storage**: Always go through `storageService`, never access IndexedDB or LocalStorage directly
4. **Icons**: Use Material Icons from `@mui/icons-material`
5. **Styling**: Use MUI's styling system (sx prop, styled components, or theme)
6. **Browser Support**: Target modern browsers that support IndexedDB and ES2020
7. **No Backend**: This is a client-side only application - all data is stored in the browser
8. **Data Privacy**: All user data stays in the browser, no external API calls

## Common Tasks

### Adding a New Component
1. Create file in `src/components/` with PascalCase name
2. Import React and necessary MUI components
3. Define props interface
4. Export default functional component
5. Import and use in parent component

### Adding a New Field to AndroidApp
1. Update `AndroidApp` interface in `src/types.ts`
2. Update storage migration logic in `storageService.ts` if needed
3. Update form dialog (`AppFormDialog.tsx`) to include new field
4. Update display components to show new field

### Modifying Storage Logic
1. Be careful with migration logic - existing user data must be preserved
2. Test both IndexedDB and LocalStorage fallback paths
3. Consider versioning if changing database schema
4. Ensure backward compatibility when possible
