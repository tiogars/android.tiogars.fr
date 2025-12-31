import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  SpeedDial,
  SpeedDialAction,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Add as AddIcon,
  FileUpload as ImportIcon,
  FileDownload as ExportIcon,
  Menu as MenuIcon,
  Shop as ShopIcon,
  ImportExport as ImportExportIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import type { AndroidApp, ThemeMode } from './types';
import { storageService } from './storageService';
import Home from './components/Home';
import AppDetail from './components/AppDetail';
import AppFormDialog from './components/AppFormDialog';
import ImportExportDialog from './components/ImportExportDialog';
import Footer from './components/Footer';

/**
 * Extracts the app name from a shared title.
 * Google Play Store shares typically come in formats like:
 * - "Découvrez 'App Name' sur Google Play" (French with regular quotes)
 * - "Check out 'App Name' on Google Play" (English with smart quotes)
 * - "Download \"App Name\" from Play Store" (with double quotes)
 * 
 * This function extracts the text within quotes (regular or smart).
 * 
 * @param title - The shared title from Google Play Store
 * @returns The extracted app name, or the original title if no quotes found
 * 
 * @example
 * extractAppNameFromTitle("Découvrez 'WhatsApp' sur Google Play")  // Returns: "WhatsApp"
 * extractAppNameFromTitle("TikTok")  // Returns: "TikTok"
 */
function extractAppNameFromTitle(title: string): string {
  // Match text within matching pairs of quotes
  // Handles regular quotes, smart quotes, and Unicode variants
  
  const patterns = [
    /'([^']*)'/,                          // Regular single quotes
    /\u2018([^\u2018\u2019]*)\u2019/,     // Smart single quotes (left \u2018, right \u2019)
    /"([^"]*)"/,                          // Regular double quotes
    /\u201C([^\u201C\u201D]*)\u201D/,     // Smart double quotes (left \u201C, right \u201D)
  ];
  
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // If no quotes found, return the original title
  return title.trim();
}

function App() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<AndroidApp[]>([]);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [editingApp, setEditingApp] = useState<AndroidApp | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Load apps from storage on mount (IndexedDB)
  useEffect(() => {
    (async () => {
      const savedApps = await storageService.getApps();
      setApps(savedApps);  
    })();

    // Load theme preference
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedTheme) {
      setThemeMode(savedTheme); // eslint-disable-line react-hooks/set-state-in-effect
    }

    // Handle share target
    const params = new URLSearchParams(window.location.search);
    const sharedTitle = params.get('title');
    const sharedText = params.get('text');
    const sharedUrl = params.get('url');

    if (sharedTitle || sharedText || sharedUrl) {
      // Extract package name from Play Store URL
      let packageName = '';
      if (sharedUrl) {
        try {
          const url = new URL(sharedUrl);
          // Validate that the hostname is play.google.com (with or without www.)
          if (url.hostname === 'play.google.com' || url.hostname === 'www.play.google.com') {
            packageName = url.searchParams.get('id') || '';
          }
        } catch (error) {
          // Invalid URL, packageName remains empty
          console.warn('Failed to parse shared URL:', error);
        }
      }

      // Create a new app with shared data
      // Extract app name from title (removes "Découvrez '...' sur Google Play" wrapper)
      const appName = extractAppNameFromTitle(sharedTitle || '');
      
      const newApp: AndroidApp = {
        id: crypto.randomUUID(),
        name: appName,
        packageName: packageName || '',
        description: sharedText || '',
        category: [],
        icon: '',
      };

      setEditingApp(newApp);
      setIsFormOpen(true);

      // Clear the URL parameters
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('theme-mode', themeMode);
  }, [themeMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
        },
      }),
    [themeMode]
  );

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSaveApp = async (app: AndroidApp) => {
    let updatedApps: AndroidApp[];
    if (editingApp) {
      updatedApps = apps.map((a) => (a.id === app.id ? app : a));
      setSnackbar({ open: true, message: 'App updated successfully', severity: 'success' });
    } else {
      updatedApps = [...apps, app];
      setSnackbar({ open: true, message: 'App added successfully', severity: 'success' });
    }
    setApps(updatedApps);
    await storageService.saveApps(updatedApps);
    setIsFormOpen(false);
    setEditingApp(null);
  };

  const handleDeleteApp = async (id: string) => {
    const updatedApps = apps.filter((a) => a.id !== id);
    setApps(updatedApps);
    await storageService.saveApps(updatedApps);
    setSnackbar({ open: true, message: 'App deleted successfully', severity: 'success' });
  };

  const handleEditApp = (app: AndroidApp) => {
    setEditingApp(app);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingApp(null);
    setIsFormOpen(true);
  };

  const handleNavigateHome = () => {
    navigate('/');
    setIsSpeedDialOpen(false);
  };

  const handleImport = async (jsonString: string) => {
    try {
      const importedApps = await storageService.importData(jsonString);
      setApps(importedApps);
      setSnackbar({ open: true, message: 'Data imported successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: (error as Error).message, severity: 'error' });
    }
  };

  const handleExport = async () => {
    const jsonString = await storageService.exportData();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `android-apps-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSnackbar({ open: true, message: 'Data exported successfully', severity: 'success' });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <ShopIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Android Apps Manager
            </Typography>
            <IconButton color="inherit" onClick={() => setIsImportExportOpen(true)} aria-label="import/export">
              <ImportExportIcon />
            </IconButton>
            <IconButton color="inherit" onClick={toggleTheme} aria-label="toggle theme">
              {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route
            path="/"
            element={
              <Home
                apps={apps}
                onEdit={handleEditApp}
                onDelete={handleDeleteApp}
              />
            }
          />
          <Route
            path="/app/:id"
            element={
              <AppDetail
                apps={apps}
                onEdit={handleEditApp}
                onDelete={handleDeleteApp}
              />
            }
          />
        </Routes>

        <Footer />
      </Box>

      <SpeedDial
        ariaLabel="Actions menu"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<MenuIcon />}
        open={isSpeedDialOpen}
        onOpen={() => setIsSpeedDialOpen(true)}
        onClose={() => setIsSpeedDialOpen(false)}
      >
        <SpeedDialAction
          icon={<HomeIcon />}
          tooltipTitle="Home"
          onClick={handleNavigateHome}
        />
        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="Add App"
          onClick={() => {
            handleAddNew();
            setIsSpeedDialOpen(false);
          }}
        />
        <SpeedDialAction
          icon={<ImportIcon />}
          tooltipTitle="Import"
          onClick={() => {
            setIsImportExportOpen(true);
            setIsSpeedDialOpen(false);
          }}
        />
        <SpeedDialAction
          icon={<ExportIcon />}
          tooltipTitle="Export"
          onClick={() => {
            handleExport();
            setIsSpeedDialOpen(false);
          }}
        />
      </SpeedDial>

      <AppFormDialog
        open={isFormOpen}
        app={editingApp}
        onClose={() => {
          setIsFormOpen(false);
          setEditingApp(null);
        }}
        onSave={handleSaveApp}
      />

      <ImportExportDialog
        open={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onImport={handleImport}
        onExport={handleExport}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
