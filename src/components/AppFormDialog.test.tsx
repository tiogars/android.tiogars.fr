import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppFormDialog from './AppFormDialog';
import type { AndroidApp } from '../types';

describe('AppFormDialog', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  const defaultProps = {
    open: true,
    app: null,
    onClose: mockOnClose,
    onSave: mockOnSave,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dialog with "Add New App" title when app is null', () => {
    render(<AppFormDialog {...defaultProps} />);
    expect(screen.getByText('Add New App')).toBeInTheDocument();
  });

  it('should render dialog with "Edit App" title when app is provided', () => {
    const app: AndroidApp = {
      id: '1',
      name: 'Test App',
      packageName: 'com.test.app',
      category: ['utility'],
      description: 'Test description',
    };

    render(<AppFormDialog {...defaultProps} app={app} />);
    expect(screen.getByText('Edit App')).toBeInTheDocument();
  });

  it('should populate form fields with app data when editing', () => {
    const app: AndroidApp = {
      id: '1',
      name: 'Test App',
      packageName: 'com.test.app',
      category: ['utility', 'productivity'],
      description: 'Test description',
      icon: 'data:image/png;base64,test',
    };

    render(<AppFormDialog {...defaultProps} app={app} />);

    expect(screen.getByDisplayValue('Test App')).toBeInTheDocument();
    expect(screen.getByDisplayValue('com.test.app')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
    expect(screen.getByText('utility')).toBeInTheDocument();
    expect(screen.getByText('productivity')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<AppFormDialog {...defaultProps} />);

    const closeButton = screen.getByLabelText('close');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<AppFormDialog {...defaultProps} />);

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should disable submit button when required fields are empty', () => {
    render(<AppFormDialog {...defaultProps} />);

    // Get the submit button from dialog actions (the last button in the actions)
    const dialogActions = screen.getByRole('dialog').querySelector('.MuiDialogActions-root');
    const submitButton = dialogActions?.querySelector('button:last-child');
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when required fields are filled', async () => {
    const user = userEvent.setup();
    render(<AppFormDialog {...defaultProps} />);

    const nameInput = screen.getByLabelText(/App Name/i);
    const packageInput = screen.getByLabelText(/Package Name/i);

    await user.type(nameInput, 'New App');
    await user.type(packageInput, 'com.new.app');

    await waitFor(() => {
      const dialogActions = screen.getByRole('dialog').querySelector('.MuiDialogActions-root');
      const submitButton = dialogActions?.querySelector('button:last-child');
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should call onSave with form data when submitted', async () => {
    const user = userEvent.setup();
    render(<AppFormDialog {...defaultProps} />);

    const nameInput = screen.getByLabelText(/App Name/i);
    const packageInput = screen.getByLabelText(/Package Name/i);
    const descriptionInput = screen.getByLabelText(/Description/i);

    await user.type(nameInput, 'New App');
    await user.type(packageInput, 'com.new.app');
    await user.type(descriptionInput, 'App description');

    const dialogActions = screen.getByRole('dialog').querySelector('.MuiDialogActions-root');
    const submitButton = dialogActions?.querySelector('button:last-child') as HTMLElement;
    await user.click(submitButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New App',
        packageName: 'com.new.app',
        description: 'App description',
        category: [],
      })
    );
  });

  it('should add category tag when Add button is clicked', async () => {
    const user = userEvent.setup();
    render(<AppFormDialog {...defaultProps} />);

    const tagInput = screen.getByPlaceholderText(/Add category tag/i);
    // Find the Add button next to the tag input (not the submit button)
    const addTagButton = screen.getAllByRole('button', { name: /Add/i })[0];

    await user.type(tagInput, 'utility');
    await user.click(addTagButton);

    expect(screen.getByText('utility')).toBeInTheDocument();
  });

  it('should add category tag when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<AppFormDialog {...defaultProps} />);

    const tagInput = screen.getByPlaceholderText(/Add category tag/i);

    await user.type(tagInput, 'game{Enter}');

    expect(screen.getByText('game')).toBeInTheDocument();
  });

  it('should not add duplicate category tags', async () => {
    const user = userEvent.setup();
    render(<AppFormDialog {...defaultProps} />);

    const tagInput = screen.getByPlaceholderText(/Add category tag/i);
    // Find the Add button next to the tag input (not the submit button)
    const addTagButton = screen.getAllByRole('button', { name: /Add/i })[0];

    await user.type(tagInput, 'utility');
    await user.click(addTagButton);

    await user.type(tagInput, 'utility');
    await user.click(addTagButton);

    const tags = screen.getAllByText('utility');
    expect(tags).toHaveLength(1);
  });

  it('should remove category tag when delete icon is clicked', async () => {
    const user = userEvent.setup();
    const app: AndroidApp = {
      id: '1',
      name: 'Test App',
      packageName: 'com.test.app',
      category: ['utility', 'productivity'],
      description: 'Test description',
    };

    render(<AppFormDialog {...defaultProps} app={app} />);

    const utilityChip = screen.getByText('utility').closest('.MuiChip-root');
    const deleteButton = utilityChip?.querySelector('[data-testid="CancelIcon"]');

    if (deleteButton) {
      await user.click(deleteButton);
    }

    await waitFor(() => {
      expect(screen.queryByText('utility')).not.toBeInTheDocument();
    });
    expect(screen.getByText('productivity')).toBeInTheDocument();
  });

  it('should not render when open is false', () => {
    const { container } = render(<AppFormDialog {...defaultProps} open={false} />);
    
    // When closed, dialog content should not be in the document
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).not.toBeInTheDocument();
  });

  it('should reset form when dialog is reopened', async () => {
    const { rerender } = render(<AppFormDialog {...defaultProps} open={false} />);

    // Open dialog and fill form
    rerender(<AppFormDialog {...defaultProps} open={true} />);

    const user = userEvent.setup();
    const nameInput = screen.getByLabelText(/App Name/i);
    await user.type(nameInput, 'Test');

    // Close and reopen dialog
    rerender(<AppFormDialog {...defaultProps} open={false} />);
    rerender(<AppFormDialog {...defaultProps} open={true} />);

    // Form should be empty
    const nameInputAfterReopen = screen.getByLabelText(/App Name/i) as HTMLInputElement;
    expect(nameInputAfterReopen.value).toBe('');
  });
});
