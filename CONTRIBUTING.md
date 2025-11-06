# Team Guidelines

Quick guide for our team on how we work together.

## Branches

We use three main branches:

### `main` - Production
- What's live and stable
- Only merge from `staging` when ready
- Auto-deploys to production

### `staging` - Pre-Production
- Final testing before going live
- Merge from `development` when features are ready
- Auto-deploys to staging environment

### `development` - Active Work
- Where we integrate new features
- Merge feature branches here
- May be unstable, that's okay

### Feature Branches
- Create from `development`: `feat/feature-name`, `fix/bug-name`
- Merge back to `development` when done
- Delete after merging

## Workflow

```
feature branch → development → staging → main
```

**Typical flow:**
1. Create feature branch from `development`
2. Work on your feature
3. Merge to `development` (create MR/PR)
4. When ready, merge `development` → `staging` for testing
5. After QA passes, merge `staging` → `main` for production

## Commit Messages

We use conventional commits. Keep it simple:

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting, no logic changes
- `refactor:` - Code cleanup
- `test:` - Tests
- `chore:` - Maintenance stuff
- `build:` - Build system changes
- `ci:` - CI/CD changes

**Format:**
```
type(scope): what you did

Optional: why you did it
```

**Examples:**
```
feat(timer): add custom duration support
fix(backend): resolve database connection issue
docs: update README with Docker setup
chore: update dependencies
```

**Scopes (optional but helpful):**
- `frontend`, `backend`, `database`, `docker`, `ci`, `auth`, `timer`, `ui`

That's it! Keep commits focused, use clear messages, and follow the branch flow.
