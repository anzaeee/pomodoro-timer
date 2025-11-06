# Contributing to Pomodoro Timer

Thank you for your interest in contributing to the Pomodoro Timer project! This document outlines the commit message conventions we follow.

## Conventional Commits

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. This makes it easier to understand the history of the project and automate versioning and changelog generation.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

The **type** is required and must be one of the following:

- **feat**: A new feature
  ```
  feat: add custom timer presets
  feat(auth): add JWT token refresh
  ```

- **fix**: A bug fix
  ```
  fix: resolve timer countdown display issue
  fix(backend): correct database connection error
  ```

- **docs**: Documentation only changes
  ```
  docs: update README with Docker setup instructions
  docs(api): add endpoint documentation
  ```

- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
  ```
  style: format code with prettier
  style(frontend): fix indentation in components
  ```

- **refactor**: A code change that neither fixes a bug nor adds a feature
  ```
  refactor: reorganize timer component structure
  refactor(backend): extract logger utility
  ```

- **perf**: A code change that improves performance
  ```
  perf: optimize database queries
  perf(frontend): reduce bundle size
  ```

- **test**: Adding missing tests or correcting existing tests
  ```
  test: add unit tests for auth routes
  test(frontend): add PomodoroTimer component tests
  ```

- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
  ```
  build: update Docker configuration
  build(deps): upgrade React to v18
  ```

- **ci**: Changes to our CI configuration files and scripts (example scopes: GitLab CI, Circle, BrowserStack, SauceLabs)
  ```
  ci: update GitLab CI pipeline
  ci: add automated testing stage
  ```

- **chore**: Other changes that don't modify src or test files
  ```
  chore: update .gitignore
  chore(deps): update dependencies
  ```

- **revert**: Reverts a previous commit
  ```
  revert: revert "feat: add custom timer presets"
  ```

### Scope

The **scope** is optional and indicates the area of the codebase affected:

- `frontend` - Frontend/React changes
- `backend` - Backend/API changes
- `database` - Database schema or migrations
- `docker` - Docker configuration
- `ci` - CI/CD pipeline
- `docs` - Documentation
- `auth` - Authentication related
- `timer` - Timer functionality
- `ui` - UI/UX changes

### Subject

The **subject** is required and contains a succinct description of the change:

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No period (.) at the end
- Maximum 72 characters

### Body

The **body** is optional and should include:

- Motivation for the change
- Contrasts with previous behavior
- Maximum 72 characters per line

### Footer

The **footer** is optional and should contain:

- Breaking changes (start with `BREAKING CHANGE:`)
- Issue references (e.g., `Closes #123`)

## Examples

### Simple Feature
```
feat: add custom timer presets functionality
```

### Feature with Scope
```
feat(timer): add auto-start breaks option
```

### Bug Fix
```
fix: resolve timer countdown not updating correctly
```

### Bug Fix with Scope
```
fix(backend): correct database connection timeout issue
```

### Documentation
```
docs: add Docker setup guide
```

### Breaking Change
```
feat(api)!: change authentication endpoint structure

BREAKING CHANGE: The /api/auth/login endpoint now requires 
email and password in the request body instead of query parameters.
```

### Multiple Changes
```
feat(timer): add custom duration support
fix(ui): resolve timer bubble animation issue
docs: update README with new features
```

## Commit Message Best Practices

1. **Be Descriptive**: Write clear, concise commit messages that explain what and why
2. **Use Imperative Mood**: Write as if completing the sentence "This commit will..."
3. **Reference Issues**: Link to issues when applicable (e.g., `Closes #123`)
4. **Separate Concerns**: Make separate commits for logically separate changes
5. **Keep It Focused**: Each commit should represent one logical change

## GitLab Integration

These commit conventions work well with GitLab CI/CD:

- Automatic versioning based on commit types
- Changelog generation
- Release notes creation
- Issue tracking integration

## Questions?

If you have questions about commit conventions, please:
- Check the [Conventional Commits specification](https://www.conventionalcommits.org/)
- Open an issue for discussion
- Contact the maintainers

---

**Thank you for contributing to Pomodoro Timer!** 🍅

