import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { Close, CloudUpload, CloudDownload } from '@mui/icons-material';

interface ImportExportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (jsonString: string) => void;
  onExport: () => void;
}

export default function ImportExportDialog({
  open,
  onClose,
  onImport,
  onExport,
}: ImportExportDialogProps) {
  const [tabValue, setTabValue] = useState(0);
  const [importText, setImportText] = useState('');

  const handleImport = () => {
    if (importText.trim()) {
      onImport(importText);
      setImportText('');
      onClose();
    }
  };

  const handleExport = () => {
    onExport();
    onClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportText(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Import / Export Data
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
          <Tab label="Import" />
          <Tab label="Export" />
        </Tabs>

        {tabValue === 0 && (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Reminder:</strong> Importing will replace all existing data. Make sure to
                export your current data first if you want to keep it.
              </Typography>
            </Alert>

            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{ mb: 2 }}
            >
              Upload JSON File
              <input type="file" hidden accept=".json" onChange={handleFileUpload} />
            </Button>

            <Typography variant="body2" sx={{ mb: 1 }}>
              Or paste JSON data:
            </Typography>

            <TextField
              multiline
              rows={10}
              fullWidth
              placeholder='[{"id": "1", "name": "App Name", ...}]'
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Reminder:</strong> Download your data regularly to keep a backup. The
                exported file contains all your app data in JSON format.
              </Typography>
            </Alert>

            <Typography variant="body2" sx={{ mb: 2 }}>
              Click the button below to download your data as a JSON file.
            </Typography>

            <Button
              variant="contained"
              startIcon={<CloudDownload />}
              onClick={handleExport}
              fullWidth
            >
              Download JSON File
            </Button>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {tabValue === 0 && (
          <Button onClick={handleImport} variant="contained" disabled={!importText.trim()}>
            Import
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
