import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterPanel from './FilterPanel';

describe('FilterPanel', () => {
  const mockOnTagsChange = vi.fn();

  const defaultProps = {
    allTags: ['utility', 'game', 'productivity'],
    selectedTags: [],
    onTagsChange: mockOnTagsChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all tags as chips', () => {
    render(<FilterPanel {...defaultProps} />);

    expect(screen.getByText('utility')).toBeInTheDocument();
    expect(screen.getByText('game')).toBeInTheDocument();
    expect(screen.getByText('productivity')).toBeInTheDocument();
  });

  it('should render filter title', () => {
    render(<FilterPanel {...defaultProps} />);
    expect(screen.getByText('Filter by Category')).toBeInTheDocument();
  });

  it('should not render when allTags is empty', () => {
    const { container } = render(
      <FilterPanel {...defaultProps} allTags={[]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should call onTagsChange with added tag when unselected tag is clicked', async () => {
    const user = userEvent.setup();
    render(<FilterPanel {...defaultProps} />);

    const utilityChip = screen.getByText('utility');
    await user.click(utilityChip);

    expect(mockOnTagsChange).toHaveBeenCalledWith(['utility']);
  });

  it('should call onTagsChange with removed tag when selected tag is clicked', async () => {
    const user = userEvent.setup();
    render(
      <FilterPanel
        {...defaultProps}
        selectedTags={['utility', 'game']}
      />
    );

    const utilityChip = screen.getByText('utility');
    await user.click(utilityChip);

    expect(mockOnTagsChange).toHaveBeenCalledWith(['game']);
  });

  it('should show selected tags with primary color', () => {
    render(
      <FilterPanel
        {...defaultProps}
        selectedTags={['utility']}
      />
    );

    const utilityChip = screen.getByText('utility').closest('.MuiChip-root');
    expect(utilityChip).toHaveClass('MuiChip-colorPrimary');
    expect(utilityChip).toHaveClass('MuiChip-filled');
  });

  it('should show unselected tags with default color', () => {
    render(
      <FilterPanel
        {...defaultProps}
        selectedTags={['utility']}
      />
    );

    const gameChip = screen.getByText('game').closest('.MuiChip-root');
    expect(gameChip).toHaveClass('MuiChip-colorDefault');
    expect(gameChip).toHaveClass('MuiChip-outlined');
  });

  it('should show Clear Filters button when tags are selected', () => {
    render(
      <FilterPanel
        {...defaultProps}
        selectedTags={['utility']}
      />
    );

    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
  });

  it('should not show Clear Filters button when no tags are selected', () => {
    render(<FilterPanel {...defaultProps} />);

    expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument();
  });

  it('should call onTagsChange with empty array when Clear Filters is clicked', async () => {
    const user = userEvent.setup();
    render(
      <FilterPanel
        {...defaultProps}
        selectedTags={['utility', 'game']}
      />
    );

    const clearButton = screen.getByText('Clear Filters');
    await user.click(clearButton);

    expect(mockOnTagsChange).toHaveBeenCalledWith([]);
  });

  it('should handle multiple tag selections', async () => {
    const user = userEvent.setup();
    render(<FilterPanel {...defaultProps} />);

    const utilityChip = screen.getByText('utility');
    await user.click(utilityChip);

    // First click should add utility
    expect(mockOnTagsChange).toHaveBeenCalledWith(['utility']);
  });

  it('should render tags in the order they are provided', () => {
    const orderedTags = ['zebra', 'alpha', 'beta'];
    render(
      <FilterPanel
        {...defaultProps}
        allTags={orderedTags}
      />
    );

    const chips = screen.getAllByRole('button');
    const labels = chips.slice(0, 3).map((chip) => chip.textContent);
    
    expect(labels).toEqual(['zebra', 'alpha', 'beta']);
  });

  it('should handle single tag', () => {
    render(
      <FilterPanel
        {...defaultProps}
        allTags={['single']}
      />
    );

    expect(screen.getByText('single')).toBeInTheDocument();
  });

  it('should allow selecting all tags', async () => {
    const user = userEvent.setup();
    const allTags = ['tag1', 'tag2', 'tag3'];
    render(
      <FilterPanel
        {...defaultProps}
        allTags={allTags}
      />
    );

    for (const tag of allTags) {
      const chip = screen.getByText(tag);
      await user.click(chip);
    }

    // Last call should have all tags except the one just added
    // (since we're testing individual clicks without updating state)
    expect(mockOnTagsChange).toHaveBeenCalledTimes(3);
  });
});
