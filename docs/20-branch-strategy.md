# 20. Branch Strategy

SpeakUp follows a streamlined variation of Git Flow / GitHub Flow to ensure isolation between feature development, release stabilization, and hotfixes.

## Core Branches
- **`main`**: The absolute source of truth for production. Code in this branch MUST always be stable, tested, and deployable.
- **`develop`**: The integration branch for next release features. All feature branches merge here.

## Supportive Branches
- **Feature Branches (`feature/name-of-feature`)**:
  - Branch off from: `develop`
  - Merge into: `develop`
  - Purpose: Developing new features for upcoming sprints.
- **Release Branches (`release/v1.0.0`)**:
  - Branch off from: `develop`
  - Merge into: `main` and `develop`
  - Purpose: Stabilization phase. Only bug fixes, documentation, and release-related tasks are permitted here (No new features).
- **Hotfix Branches (`hotfix/description`)**:
  - Branch off from: `main`
  - Merge into: `main` and `develop`
  - Purpose: Urgent production bug fixes that cannot wait for the next standard release cycle.

## Rule of Engagement
1. **Never commit directly to `main`.**
2. All merges to `main` and `develop` must occur via Pull Requests (PR).
3. PRs require passing automated Quality Gates (Linting, Build, Typecheck).
