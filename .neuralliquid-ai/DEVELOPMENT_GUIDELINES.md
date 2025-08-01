# Development Guidelines

## Code Style

### TypeScript/JavaScript

- Use TypeScript with strict mode enabled
- Follow Airbnb JavaScript Style Guide
- Use PascalCase for components, camelCase for functions/variables
- Always define prop types/interfaces
- Prefer functional components with hooks

### Naming Conventions

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities: `camelCase.ts`
- Constants: `UPPER_SNAKE_CASE`
- Test files: `ComponentName.test.tsx`

## Architecture

### Component Structure

```tsx
// 1. Imports (external first, then internal)
import React from 'react';
import styled from 'styled-components';
import { useGame } from '../../hooks/useGame';

// 2. Type definitions
type Props = {
  id: string;
  name: string;
  onClick: () => void;
};

// 3. Styled components (if any)
const StyledCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
`;

// 4. Main component
export const Card: React.FC<Props> = ({ id, name, onClick }) => {
  // 5. Hooks
  const { gameState } = useGame();
  
  // 6. Handlers
  const handleClick = () => {
    onClick();
  };
  
  // 7. Render
  return (
    <StyledCard 
      data-testid={`card-${id}`}
      onClick={handleClick}
    >
      {name}
    </StyledCard>
  );
};
```

## Testing

### Test Structure

```typescript
describe('Card Component', () => {
  const mockOnClick = jest.fn();
  const defaultProps = {
    id: '1',
    name: 'Test Card',
    onClick: mockOnClick,
  };
  
  it('renders card with name', () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    render(<Card {...defaultProps} />);
    fireEvent.click(screen.getByTestId('card-1'));
    expect(mockOnClick).toHaveBeenCalled();
  });
});
```

### Testing Guidelines

- Test behavior, not implementation
- Use React Testing Library for component tests
- Mock external dependencies
- Aim for 80%+ test coverage
- Test edge cases and error states

## Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `bugfix/issue-number` - Bug fixes
- `hotfix/issue-number` - Critical production fixes
- `refactor/component-name` - Code refactoring

### Commit Messages

Format: `type(scope): description`

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests
- `chore`: Updating build tasks, package manager configs, etc.

Example:

``` text
feat(card): add hover animation to card component
fix(battle): resolve combat calculation error
```

## Performance

### Optimization Techniques

1. **Code Splitting**:

   - Use React.lazy() for route-based splitting
   - Load heavy components dynamically

2. **Memoization**:

   - Use React.memo for expensive components
   - useCallback for function references
   - useMemo for expensive calculations

3. **Asset Optimization**:

   - Compress images
   - Use modern formats (WebP, AVIF)
   - Implement lazy loading

## Security

### Best Practices

1. **Input Validation**:

   - Validate all user inputs
   - Sanitize HTML/markdown content

2. **Authentication**:

   - Use JWT with httpOnly cookies
   - Implement CSRF protection
   - Rate limiting on auth endpoints

3. **Data Protection**:

   - Encrypt sensitive data
   - Follow least privilege principle
   - Regular security audits

## Documentation

### Component Documentation

```tsx
/**
 * Card component that displays game card information
 * 
 * @component
 * @param {string} id - Unique identifier for the card
 * @param {string} name - Display name of the card
 * @param {() => void} onClick - Callback when card is clicked
 * @example
 * return (
 *   <Card 
 *     id="1" 
 *     name="Hero Card" 
 *     onClick={() => handleCardClick(1)} 
 *   />
 * )
 */
```

### API Documentation

- Use OpenAPI/Swagger for REST APIs
- Document request/response schemas
- Include example requests/responses
- Document error codes and messages

## CI/CD

### Pipeline Stages

1. **Linting**: Check code style and formatting
2. **Testing**: Run unit and integration tests
3. **Build**: Create production build
4. **Deploy**: Deploy to staging/production
5. **Notify**: Send deployment notifications

### Environment Variables

- `NEXT_PUBLIC_API_URL`: API base URL
- `NODE_ENV`: Environment (development, production, test)
- `SENTRY_DSN`: Error tracking
- `GA_TRACKING_ID`: Analytics

## Accessibility

### ARIA Guidelines

- Use semantic HTML elements
- Add proper ARIA attributes
- Ensure keyboard navigation
- Test with screen readers

### Color Contrast

- Minimum 4.5:1 for normal text
- 3:1 for large text
- Test with color contrast checkers

## Error Handling

### Client-Side

- Use error boundaries
- Show user-friendly messages
- Log errors to error tracking service
- Provide recovery options

### Server-Side

- Structured error responses
- Proper HTTP status codes
- Log detailed errors server-side
- Implement circuit breakers for external services
