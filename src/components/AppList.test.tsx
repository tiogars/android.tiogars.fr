import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import AppList from './AppList';
import type { AndroidApp } from '../types';

// Helper to render with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AppList', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  const mockApps: AndroidApp[] = [
    {
      id: '1',
      name: 'Test App 1',
      packageName: 'com.test.app1',
      category: ['utility', 'productivity'],
      description: 'First test app description',
      icon: 'data:image/png;base64,test1',
    },
    {
      id: '2',
      name: 'Test App 2',
      packageName: 'com.test.app2',
      category: ['game'],
      description: 'Second test app description',
    },
  ];

  const defaultProps = {
    apps: mockApps,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all apps', () => {
    renderWithRouter(<AppList {...defaultProps} />);

    expect(screen.getByText('Test App 1')).toBeInTheDocument();
    expect(screen.getByText('Test App 2')).toBeInTheDocument();
  });

  it('should render app package names', () => {
    renderWithRouter(<AppList {...defaultProps} />);

    expect(screen.getByText('com.test.app1')).toBeInTheDocument();
    expect(screen.getByText('com.test.app2')).toBeInTheDocument();
  });

  it('should render app descriptions', () => {
    renderWithRouter(<AppList {...defaultProps} />);

    expect(screen.getByText('First test app description')).toBeInTheDocument();
    expect(screen.getByText('Second test app description')).toBeInTheDocument();
  });

  it('should render category chips for each app', () => {
    renderWithRouter(<AppList {...defaultProps} />);

    expect(screen.getByText('utility')).toBeInTheDocument();
    expect(screen.getByText('productivity')).toBeInTheDocument();
    expect(screen.getByText('game')).toBeInTheDocument();
  });

  it('should render View button for each app', () => {
    renderWithRouter(<AppList {...defaultProps} />);

    const viewButtons = screen.getAllByRole('link', { name: /View/i });
    expect(viewButtons).toHaveLength(2);
  });

  it('should render Store button for each app', () => {
    renderWithRouter(<AppList {...defaultProps} />);

    const storeButtons = screen.getAllByRole('button', { name: /Store/i });
    expect(storeButtons).toHaveLength(2);
  });

  it('should render Edit button for each app', () => {
    renderWithRouter(<AppList {...defaultProps} />);

    const editButtons = screen.getAllByLabelText('edit');
    expect(editButtons).toHaveLength(2);
  });

  it('should render Delete button for each app', () => {
    renderWithRouter(<AppList {...defaultProps} />);

    const deleteButtons = screen.getAllByLabelText('delete');
    expect(deleteButtons).toHaveLength(2);
  });

  it('should call onEdit when Edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AppList {...defaultProps} />);

    const editButtons = screen.getAllByLabelText('edit');
    await user.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockApps[0]);
  });

  it('should call onDelete when Delete button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AppList {...defaultProps} />);

    const deleteButtons = screen.getAllByLabelText('delete');
    await user.click(deleteButtons[1]);

    expect(mockOnDelete).toHaveBeenCalledWith('2');
  });

  it('should open Play Store in new tab when Store button is clicked', async () => {
    const user = userEvent.setup();
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    
    renderWithRouter(<AppList {...defaultProps} />);

    const storeButtons = screen.getAllByRole('button', { name: /Store/i });
    await user.click(storeButtons[0]);

    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://play.google.com/store/apps/details?id=com.test.app1',
      '_blank'
    );

    windowOpenSpy.mockRestore();
  });

  it('should render avatar with app icon', () => {
    renderWithRouter(<AppList {...defaultProps} />);

    const avatars = screen.getAllByRole('img');
    expect(avatars[0]).toHaveAttribute('src', 'data:image/png;base64,test1');
  });

  it('should render avatar with first letter when no icon', () => {
    renderWithRouter(<AppList {...defaultProps} />);

    // Second app has no icon, so it should show the first letter
    expect(screen.getByText('T', { selector: '.MuiAvatar-root' })).toBeInTheDocument();
  });

  it('should render correct View link href', () => {
    renderWithRouter(<AppList {...defaultProps} />);

    const viewLinks = screen.getAllByRole('link', { name: /View/i });
    expect(viewLinks[0]).toHaveAttribute('href', '/app/1');
    expect(viewLinks[1]).toHaveAttribute('href', '/app/2');
  });

  it('should render empty grid when apps array is empty', () => {
    const { container } = renderWithRouter(
      <AppList apps={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    const grid = container.querySelector('[class*="MuiBox-root"]');
    expect(grid).toBeInTheDocument();
    expect(grid?.children).toHaveLength(0);
  });

  it('should render single app correctly', () => {
    const singleApp: AndroidApp[] = [mockApps[0]];
    
    renderWithRouter(
      <AppList apps={singleApp} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByText('Test App 1')).toBeInTheDocument();
    expect(screen.queryByText('Test App 2')).not.toBeInTheDocument();
  });

  it('should render app without categories', () => {
    const appWithoutCategories: AndroidApp[] = [
      {
        id: '3',
        name: 'No Category App',
        packageName: 'com.test.nocat',
        category: [],
        description: 'App without categories',
      },
    ];

    renderWithRouter(
      <AppList apps={appWithoutCategories} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByText('No Category App')).toBeInTheDocument();
    // Should not render any category chips
    const chips = screen.queryByRole('button', { name: /utility|game|productivity/i });
    expect(chips).not.toBeInTheDocument();
  });

  it('should render app with long description', () => {
    const longDescription = 'This is a very long description that should still be rendered correctly in the card component without breaking the layout or causing issues.';
    const appWithLongDesc: AndroidApp[] = [
      {
        id: '4',
        name: 'Long Desc App',
        packageName: 'com.test.longdesc',
        category: ['test'],
        description: longDescription,
      },
    ];

    renderWithRouter(
      <AppList apps={appWithLongDesc} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByText(longDescription)).toBeInTheDocument();
  });

  it('should render app with multiple categories', () => {
    const appWithManyCategories: AndroidApp[] = [
      {
        id: '5',
        name: 'Multi Category App',
        packageName: 'com.test.multi',
        category: ['cat1', 'cat2', 'cat3', 'cat4', 'cat5'],
        description: 'App with many categories',
      },
    ];

    renderWithRouter(
      <AppList apps={appWithManyCategories} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(screen.getByText('cat1')).toBeInTheDocument();
    expect(screen.getByText('cat2')).toBeInTheDocument();
    expect(screen.getByText('cat3')).toBeInTheDocument();
    expect(screen.getByText('cat4')).toBeInTheDocument();
    expect(screen.getByText('cat5')).toBeInTheDocument();
  });
});
