# Testing Documentation

## Overview

This project uses **Vitest** as the testing framework along with **React Testing Library** for component testing. The test suite ensures code quality and provides functional coverage of key components and utilities.

## Test Infrastructure

### Frameworks and Libraries

- **Vitest 4.0.16**: Fast unit test framework with native ES module support
- **@testing-library/react 16.3.1**: React component testing utilities
- **@testing-library/jest-dom 6.9.1**: Custom Jest matchers for DOM assertions
- **@testing-library/user-event 14.6.1**: User interaction simulation
- **jsdom 27.4.0**: DOM implementation for Node.js
- **@vitest/coverage-v8**: Code coverage reporting

### Configuration

Tests are configured in `vite.config.ts` with:
- **Environment**: jsdom (browser-like environment)
- **Globals**: Enabled for describe, it, expect, etc.
- **Setup file**: `src/test/setup.ts` for test initialization
- **Coverage**: v8 provider with HTML, JSON, LCOV, and text reports

## Running Tests

### Available Commands

```bash
# Run tests in watch mode (default)
pnpm test

# Run tests once
pnpm test -- --run

# Run tests with UI
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage
```

### Coverage Reports

Coverage reports are generated in the `coverage/` directory (git-ignored):
- `coverage/index.html` - Interactive HTML report
- `coverage/lcov.info` - LCOV format for SonarQube
- `coverage/coverage-final.json` - JSON format

## Test Files

### Component Tests

1. **AppFormDialog.test.tsx** (14 tests)
   - Dialog rendering and form state
   - Input validation (required fields)
   - Category tag management (add, remove, duplicates)
   - Form submission and data handling
   - Dialog lifecycle (open, close, reset)

2. **AppList.test.tsx** (19 tests)
   - App card rendering
   - Display of app details (name, package, description, categories)
   - User actions (edit, delete, view, open in Play Store)
   - Edge cases (empty list, single app, no categories, long text)

3. **FilterPanel.test.tsx** (14 tests)
   - Tag rendering and selection
   - Multiple tag selections
   - Clear filters functionality
   - Visual states (selected vs unselected)
   - Edge cases (empty tags, single tag)

4. **ImportExportDialog.test.tsx** (16 tests)
   - Tab switching (Import/Export)
   - Import validation (JSON format, empty data)
   - Export functionality
   - User feedback and dialog state

### Utility Tests

1. **utils.test.ts** (11 tests)
   - `extractAppNameFromTitle()` function
   - Regular and smart quote handling
   - Edge cases (empty strings, whitespace, special characters)
   - Multiple quote patterns

2. **storageService.test.ts** (6 tests)
   - Data export (JSON formatting)
   - Data import (validation, error handling)
   - Empty data handling

## Test Coverage Summary

| File | Statements | Branches | Functions | Lines |
|------|-----------|----------|-----------|-------|
| utils.ts | 100% | 100% | 100% | 100% |
| AppList.tsx | 100% | 100% | 100% | 100% |
| FilterPanel.tsx | 91.66% | 100% | 85.71% | 90.9% |
| AppFormDialog.tsx | 83.78% | 87.5% | 86.66% | 83.78% |
| ImportExportDialog.tsx | 66.66% | 70% | 71.42% | 66.66% |
| storageService.ts | 22.5% | 5.55% | 16.66% | 23.37% |

**Overall**: 80 tests passing, covering critical user-facing components and utilities.

## Testing Best Practices

### Component Testing Approach

1. **User-centric**: Tests simulate real user interactions (clicking, typing)
2. **Accessibility-focused**: Use semantic queries (getByRole, getByLabelText)
3. **Isolation**: Each test is independent with proper setup/cleanup
4. **Mock external dependencies**: LocalStorage, IndexedDB, window APIs

### Test Structure

```typescript
describe('ComponentName', () => {
  // Setup and mocks
  const mockOnAction = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do something when user interacts', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<Component onAction={mockOnAction} />);

    // Act
    await user.click(screen.getByRole('button'));

    // Assert
    expect(mockOnAction).toHaveBeenCalledTimes(1);
  });
});
```

### Common Patterns

1. **Finding elements**: Use `screen.getBy*` queries
2. **User interactions**: Use `userEvent` for realistic simulation
3. **Async operations**: Use `await` and `waitFor` when needed
4. **Mocking callbacks**: Use `vi.fn()` for function props
5. **Multiple elements**: Use `getAllBy*` for lists

## CI/CD Integration

Tests run automatically in the CI/CD pipeline:

```yaml
- name: Run tests with coverage
  run: pnpm test:coverage -- --run
```

Coverage reports are sent to SonarQube for quality gate analysis.

## Future Improvements

Potential areas for expanding test coverage:

1. **Integration tests**: Test full user flows (add → edit → delete)
2. **App.tsx**: Main application logic and routing
3. **Home.tsx**: Filtering and app listing integration
4. **AppDetail.tsx**: Individual app detail view
5. **Footer.tsx**: Static footer component
6. **Root.tsx**: Application root wrapper
7. **StorageService**: Full IndexedDB operations and migration logic

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "Cannot find module"
- **Solution**: Run `pnpm install` to ensure all dependencies are installed

**Issue**: Tests timeout
- **Solution**: Increase timeout in test or check for missing `await`

**Issue**: Coverage reports not generated
- **Solution**: Ensure `@vitest/coverage-v8` is installed

**Issue**: TypeScript errors in test files
- **Solution**: Check `tsconfig.app.json` includes `"vitest/globals"` in types

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [User Event API](https://testing-library.com/docs/user-event/intro)
