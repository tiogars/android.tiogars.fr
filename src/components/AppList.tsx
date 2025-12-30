import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Chip,
  Box,
  Avatar,
} from '@mui/material';
import { Edit, Delete, Storefront, Visibility } from '@mui/icons-material';
import type { AndroidApp } from '../types';

interface AppListProps {
  apps: AndroidApp[];
  onEdit: (app: AndroidApp) => void;
  onDelete: (id: string) => void;
}

export default function AppList({ apps, onEdit, onDelete }: AppListProps) {
  const handleViewInPlayStore = (packageName: string) => {
    window.open(`https://play.google.com/store/apps/details?id=${packageName}`, '_blank');
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: 3,
      }}
    >
      {apps.map((app) => (
        <Card
          key={app.id}
          sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={app.icon}
                  alt={app.name}
                  sx={{ width: 56, height: 56, mr: 2 }}
                >
                  {app.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {app.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ wordBreak: 'break-all' }}
                  >
                    {app.packageName}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                {app.category.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>

              <Typography variant="body2" color="text.secondary">
                {app.description}
              </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  component={Link}
                  to={`/app/${app.id}`}
                  startIcon={<Visibility />}
                >
                  View
                </Button>
                <Button
                  size="small"
                  startIcon={<Storefront />}
                  onClick={() => handleViewInPlayStore(app.packageName)}
                >
                  Store
                </Button>
              </Box>
              <Box>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEdit(app)}
                  aria-label="edit"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(app.id)}
                  aria-label="delete"
                >
                  <Delete />
                </IconButton>
              </Box>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
}
