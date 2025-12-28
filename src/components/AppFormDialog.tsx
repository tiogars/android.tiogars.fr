import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  IconButton,
  Avatar,
  Typography,
} from '@mui/material';
import { Close, CloudUpload } from '@mui/icons-material';
import type { AndroidApp } from '../types';

interface AppFormDialogProps {
  open: boolean;
  app: AndroidApp | null;
  onClose: () => void;
  onSave: (app: AndroidApp) => void;
}

export default function AppFormDialog({ open, app, onClose, onSave }: AppFormDialogProps) {
  const [formData, setFormData] = useState<Omit<AndroidApp, 'id'>>({
    name: '',
    packageName: '',
    category: [],
    description: '',
    icon: '',
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (app) {
      setFormData({ // eslint-disable-line react-hooks/set-state-in-effect
        name: app.name,
        packageName: app.packageName,
        category: app.category,
        description: app.description,
        icon: app.icon || '',
      });
    } else {
      setFormData({ // eslint-disable-line react-hooks/set-state-in-effect
        name: '',
        packageName: '',
        category: [],
        description: '',
        icon: '',
      });
    }
    setTagInput('');
  }, [app, open]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, icon: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.category.includes(trimmedTag)) {
      setFormData({
        ...formData,
        category: [...formData.category, trimmedTag],
      });
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setFormData({
      ...formData,
      category: formData.category.filter((tag) => tag !== tagToDelete),
    });
  };

  const handleSubmit = () => {
    if (formData.name && formData.packageName) {
      const appData: AndroidApp = {
        id: app?.id || crypto.randomUUID(),
        ...formData,
      };
      onSave(appData);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {app ? 'Edit App' : 'Add New App'}
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={formData.icon}
              alt={formData.name}
              sx={{ width: 80, height: 80 }}
            >
              {formData.name.charAt(0).toUpperCase()}
            </Avatar>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
            >
              Upload Icon
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
          </Box>

          <TextField
            label="App Name"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <TextField
            label="Package Name"
            fullWidth
            required
            placeholder="com.example.app"
            value={formData.packageName}
            onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
            helperText="e.g., com.example.myapp"
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Categories
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                size="small"
                placeholder="Add category tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                fullWidth
              />
              <Button onClick={handleAddTag} variant="outlined">
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {formData.category.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  size="small"
                />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name || !formData.packageName}
        >
          {app ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
