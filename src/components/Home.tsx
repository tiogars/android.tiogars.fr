import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
} from '@mui/material';
import type { AndroidApp } from '../types';
import AppList from './AppList';
import FilterPanel from './FilterPanel';

interface HomeProps {
  apps: AndroidApp[];
  onEdit: (app: AndroidApp) => void;
  onDelete: (id: string) => void;
}

export default function Home({ apps, onEdit, onDelete }: HomeProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get selected categories from URL
  const selectedTags = useMemo(() => {
    const category = searchParams.get('category');
    return category ? [category] : [];
  }, [searchParams]);

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

  const handleTagsChange = (tags: string[]) => {
    if (tags.length === 0) {
      setSearchParams({});
    } else {
      // For URL-based filtering, we support single category selection
      setSearchParams({ category: tags[0] });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8, flexGrow: 1 }}>
      <Box sx={{ mb: 3 }}>
        <FilterPanel
          allTags={allTags}
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
        />
      </Box>

      <AppList
        apps={filteredApps}
        onEdit={onEdit}
        onDelete={onDelete}
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
  );
}
