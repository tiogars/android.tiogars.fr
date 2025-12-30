import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  Storefront,
} from '@mui/icons-material';
import type { AndroidApp } from '../types';

interface AppDetailProps {
  apps: AndroidApp[];
  onEdit: (app: AndroidApp) => void;
  onDelete: (id: string) => void;
}

export default function AppDetail({ apps, onEdit, onDelete }: AppDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const app = apps.find((a) => a.id === id);

  if (!app) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            App not found
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  const handleViewInPlayStore = () => {
    window.open(`https://play.google.com/store/apps/details?id=${app.packageName}`, '_blank');
  };

  const handleEdit = () => {
    onEdit(app);
  };

  const handleDelete = () => {
    onDelete(app.id);
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBack />}
        sx={{ mb: 3 }}
      >
        Back to Apps
      </Button>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
          <Avatar
            src={app.icon}
            alt={app.name}
            sx={{ width: 96, height: 96, mr: 3 }}
          >
            {app.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {app.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ wordBreak: 'break-all', mb: 2 }}
            >
              {app.packageName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {app.category.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  component={Link}
                  to={`/?category=${encodeURIComponent(tag)}`}
                  clickable
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Description
        </Typography>
        <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
          {app.description || 'No description available.'}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Storefront />}
            onClick={handleViewInPlayStore}
          >
            View in Play Store
          </Button>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
