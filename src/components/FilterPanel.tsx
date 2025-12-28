import { Box, Chip, Typography, Paper } from '@mui/material';
import { FilterList } from '@mui/icons-material';

interface FilterPanelProps {
  allTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function FilterPanel({ allTags, selectedTags, onTagsChange }: FilterPanelProps) {
  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  if (allTags.length === 0) {
    return null;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <FilterList sx={{ mr: 1 }} />
        <Typography variant="subtitle1">Filter by Category</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {allTags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onClick={() => handleTagClick(tag)}
            color={selectedTags.includes(tag) ? 'primary' : 'default'}
            variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
          />
        ))}
      </Box>
      {selectedTags.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Chip
            label="Clear Filters"
            size="small"
            onDelete={() => onTagsChange([])}
            onClick={() => onTagsChange([])}
          />
        </Box>
      )}
    </Paper>
  );
}
