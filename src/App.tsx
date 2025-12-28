import { useState, useEffect, useMemo } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Fab,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Add as AddIcon,
  Shop as ShopIcon,
  ImportExport as ImportExportIcon,
} from '@mui/icons-material';
import type { AndroidApp, ThemeMode } from './types';
import { storageService } from './storageService';
import AppList from './components/AppList';
import AppFormDialog from './components/AppFormDialog';
import FilterPanel from './components/FilterPanel';
import ImportExportDialog from './components/ImportExportDialog';
import Footer from './components/Footer';

function App() {
  const [apps, setApps] = useState<AndroidApp[]>([]);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingApp, setEditingApp] = useState<AndroidApp | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Load apps from local storage on mount
  useEffect(() => {
    const savedApps = storageService.getApps();
    setApps(savedApps); // eslint-disable-line react-hooks/set-state-in-effect

    // Load theme preference
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedTheme) {
      setThemeMode(savedTheme); // eslint-disable-line react-hooks/set-state-in-effect
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

  const handleSaveApp = (app: AndroidApp) => {
    let updatedApps: AndroidApp[];
    if (editingApp) {
      updatedApps = apps.map((a) => (a.id === app.id ? app : a));
      setSnackbar({ open: true, message: 'App updated successfully', severity: 'success' });
    } else {
      updatedApps = [...apps, app];
      setSnackbar({ open: true, message: 'App added successfully', severity: 'success' });
    }
    setApps(updatedApps);
    storageService.saveApps(updatedApps);
    setIsFormOpen(false);
    setEditingApp(null);
  };

  const handleDeleteApp = (id: string) => {
    const updatedApps = apps.filter((a) => a.id !== id);
    setApps(updatedApps);
    storageService.saveApps(updatedApps);
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

  const handleImport = (jsonString: string) => {
    try {
      const importedApps = storageService.importData(jsonString);
      setApps(importedApps);
      setSnackbar({ open: true, message: 'Data imported successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: (error as Error).message, severity: 'error' });
    }
  };

  const handleExport = () => {
    const jsonString = storageService.exportData();
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

  // Get all unique tags from apps
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    apps.forEach((app) => {
      app.category.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [apps]);

  // Filter apps by selected tags
  const filteredApps = useMemo(() => {
    if (selectedTags.length === 0) {
      return apps;
    }
    return apps.filter((app) =>
      selectedTags.some((tag) => app.category.includes(tag))
    );
  }, [apps, selectedTags]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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

      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ mb: 3 }}>
          <FilterPanel
            allTags={allTags}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          />
        </Box>

        <AppList
          apps={filteredApps}
          onEdit={handleEditApp}
          onDelete={handleDeleteApp}
        />

        {filteredApps.length === 0 && apps.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No apps match the selected filters
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Android Apps Manager
            </Typography>
            <IconButton color="inherit" onClick={() => setIsImportExportOpen(true)}>
              <Typography variant="button" sx={{ mr: 1 }}>
                Import/Export
              </Typography>
            </IconButton>
            <IconButton color="inherit" onClick={toggleTheme}>
              {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 8, flexGrow: 1 }}>
          <Box sx={{ mb: 3 }}>
            <FilterPanel
              allTags={allTags}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />
          </Box>

          <AppList
            apps={filteredApps}
            onEdit={handleEditApp}
            onDelete={handleDeleteApp}
          />

          {filteredApps.length === 0 && apps.length > 0 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No apps match the selected filters
              </Typography>
            </Box>
          )}

          {apps.length === 0 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No apps yet. Click the + button to add your first app!
              </Typography>
            </Box>
          )}
        </Container>

        <Footer />
      </Box>

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleAddNew}
      >
        <AddIcon />
      </Fab>

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
