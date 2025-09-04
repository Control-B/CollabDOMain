# Contributing to CollabAzureMobile

Thank you for your interest in contributing to CollabAzureMobile! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a new branch for your feature or bug fix
4. Make your changes
5. Test your changes thoroughly
6. Submit a pull request

## Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

## Code Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid using `any` unless absolutely necessary

### React Native/Expo
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error boundaries

### Styling
- Use StyleSheet for component styling
- Follow the existing design system
- Ensure responsive design for different screen sizes

### Git Workflow

1. **Branch naming**:
   - Feature: `feature/description-of-feature`
   - Bug fix: `fix/description-of-bug`
   - Hotfix: `hotfix/description-of-hotfix`

2. **Commit messages**:
   - Use clear, descriptive commit messages
   - Start with a verb (Add, Fix, Update, etc.)
   - Reference issues when applicable

3. **Pull requests**:
   - Provide a clear description of changes
   - Include screenshots for UI changes
   - Ensure all tests pass
   - Request review from maintainers

## Testing

- Write unit tests for utility functions
- Test UI components when possible
- Test on both iOS and Android platforms
- Verify functionality on physical devices

## Code Review Process

All pull requests must be reviewed before merging:

1. Code quality and style
2. Functionality and testing
3. Performance implications
4. Security considerations
5. Documentation updates

## Reporting Issues

When reporting issues:

1. Use the issue template
2. Provide clear reproduction steps
3. Include environment details
4. Add screenshots or videos if applicable

## Questions?

If you have questions about contributing:

- Open an issue for discussion
- Contact the maintainers
- Check existing documentation

Thank you for contributing to CollabAzureMobile!
