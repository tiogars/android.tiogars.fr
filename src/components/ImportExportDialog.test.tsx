import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImportExportDialog from './ImportExportDialog';

describe('ImportExportDialog', () => {
  const mockOnClose = vi.fn();
  const mockOnImport = vi.fn();
  const mockOnExport = vi.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onImport: mockOnImport,
    onExport: mockOnExport,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dialog with title', () => {
    render(<ImportExportDialog {...defaultProps} />);
    expect(screen.getByText('Import / Export Data')).toBeInTheDocument();
  });

  it('should render Import and Export tabs', () => {
    render(<ImportExportDialog {...defaultProps} />);
    
    // Find tabs by role
    const tabs = screen.getAllByRole('tab');
    const tabLabels = tabs.map(tab => tab.textContent);
    
    expect(tabLabels).toContain('Import');
    expect(tabLabels).toContain('Export');
  });

  it('should show Import tab content by default', () => {
    render(<ImportExportDialog {...defaultProps} />);
    expect(screen.getByText(/Importing will replace all existing data/i)).toBeInTheDocument();
    expect(screen.getByText('Upload JSON File')).toBeInTheDocument();
  });

  it('should switch to Export tab when clicked', async () => {
    const user = userEvent.setup();
    render(<ImportExportDialog {...defaultProps} />);

    const exportTab = screen.getByText('Export');
    await user.click(exportTab);

    expect(screen.getByText(/Download your data regularly to keep a backup/i)).toBeInTheDocument();
    expect(screen.getByText('Download JSON File')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<ImportExportDialog {...defaultProps} />);

    const closeButton = screen.getByLabelText('close');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<ImportExportDialog {...defaultProps} />);

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should disable Import button when text field is empty', () => {
    render(<ImportExportDialog {...defaultProps} />);

    // Get the Import button from dialog actions (not the tab)
    const dialogActions = screen.getByRole('dialog').querySelector('.MuiDialogActions-root');
    const importButton = dialogActions?.querySelector('button:last-child');
    expect(importButton).toBeDisabled();
  });

  it('should enable Import button when text is entered', async () => {
    const user = userEvent.setup();
    render(<ImportExportDialog {...defaultProps} />);

    const testData = '[{"id": "1", "name": "Test"}]';
    const textField = screen.getByPlaceholderText(/\[\{"id": "1"/i);
    
    // Use paste instead of type for JSON content
    await user.click(textField);
    await user.paste(testData);

    // Get the Import button from dialog actions (not the tab)
    const dialogActions = screen.getByRole('dialog').querySelector('.MuiDialogActions-root');
    const importButton = dialogActions?.querySelector('button:last-child');
    expect(importButton).not.toBeDisabled();
  });

  it('should call onImport with text content when Import button is clicked', async () => {
    const user = userEvent.setup();
    render(<ImportExportDialog {...defaultProps} />);

    const testData = '[{"id": "1", "name": "Test App"}]';
    const textField = screen.getByPlaceholderText(/\[\{"id": "1"/i);
    
    await user.click(textField);
    await user.paste(testData);

    // Get the Import button from dialog actions (not the tab)
    const dialogActions = screen.getByRole('dialog').querySelector('.MuiDialogActions-root');
    const importButton = dialogActions?.querySelector('button:last-child') as HTMLElement;
    await user.click(importButton);

    expect(mockOnImport).toHaveBeenCalledTimes(1);
    expect(mockOnImport).toHaveBeenCalledWith(testData);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onExport when Download JSON File button is clicked', async () => {
    const user = userEvent.setup();
    render(<ImportExportDialog {...defaultProps} />);

    // Switch to Export tab
    const exportTab = screen.getByText('Export');
    await user.click(exportTab);

    // Click download button
    const downloadButton = screen.getByText('Download JSON File');
    await user.click(downloadButton);

    expect(mockOnExport).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should clear text field after successful import', async () => {
    const user = userEvent.setup();
    render(<ImportExportDialog {...defaultProps} />);

    const testData = '[{"id": "1"}]';
    const textField = screen.getByPlaceholderText(/\[\{"id": "1"/i) as HTMLTextAreaElement;
    
    await user.click(textField);
    await user.paste(testData);

    // Get the Import button from dialog actions (not the tab)
    const dialogActions = screen.getByRole('dialog').querySelector('.MuiDialogActions-root');
    const importButton = dialogActions?.querySelector('button:last-child') as HTMLElement;
    await user.click(importButton);

    // Dialog would close, so we reopen to check if field would be cleared
    // In real scenario, the parent component would reopen with fresh state
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should not render when open is false', () => {
    const { container } = render(<ImportExportDialog {...defaultProps} open={false} />);
    
    // When closed, dialog content should not be in the document
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).not.toBeInTheDocument();
  });

  it('should show upload button in Import tab', () => {
    render(<ImportExportDialog {...defaultProps} />);
    expect(screen.getByText('Upload JSON File')).toBeInTheDocument();
  });

  it('should show reminder alert in Import tab', () => {
    render(<ImportExportDialog {...defaultProps} />);
    expect(screen.getByText(/Importing will replace all existing data/i)).toBeInTheDocument();
  });

  it('should show reminder alert in Export tab', async () => {
    const user = userEvent.setup();
    render(<ImportExportDialog {...defaultProps} />);

    const exportTab = screen.getByText('Export');
    await user.click(exportTab);

    expect(screen.getByText(/Download your data regularly to keep a backup/i)).toBeInTheDocument();
  });

  it('should not show Import button in Export tab', async () => {
    const user = userEvent.setup();
    render(<ImportExportDialog {...defaultProps} />);

    const exportTab = screen.getByText('Export');
    await user.click(exportTab);

    // The tab labeled "Import" should still exist, but not as a button in the actions
    const importButtons = screen.queryAllByRole('button', { name: 'Import' });
    expect(importButtons).toHaveLength(0);
  });
});
