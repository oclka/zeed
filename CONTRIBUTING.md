# Contributing to zeed

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to **zeed**.

## 🚀 Development Workflow

### 1. Project Structure

We follow a strict separation between types (`src/types`) and logic (`src/errors`, `src/engine`, etc.).

- Ensure that any new core interface is defined in `src/types`.
- Use the `@/` path alias consistently for all internal imports.

### 2. Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features.
- `fix:` for bug fixes.
- `chore:`, `docs:`, `style:`, `refactor:`, `test:`, etc.
  Your commits will be validated by a git hook.

### 3. Documentation

All public functions, classes, and interfaces **must** have TSDoc comments.

- Run `pnpm lint` to verify your documentation syntax.
- Ensure the `@example` tag is used for public APIs.

### 4. Quality Gate (The "Check-all" Rule)

Before pushing your changes, ensure ALL checks pass by running:

```bash
pnpm check:all
```

This command includes type checking, linting, secret scanning, testing (with coverage), and building.

## 📦 Changesets

If your change impacts the package version (feature or fix), you **must** include a changeset:

1. Run `pnpm changeset`.
2. Select the version bump type.
3. Write a concise summary of the change.
4. Commit the generated markdown file.

## 🛡 Security

If you find a security vulnerability, please do NOT open an issue. See our [Security Policy](SECURITY.md).
