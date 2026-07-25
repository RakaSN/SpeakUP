# 19. Versioning Policy

SpeakUp adheres to [Semantic Versioning (SemVer)](https://semver.org/spec/v2.0.0.html) to guarantee predictable release lifecycles.

## Version Numbering
Format: `MAJOR.MINOR.PATCH`

1. **MAJOR (`v1.x.x`, `v2.x.x`)**: Incompatible API or architectural changes, massive UI rewrites.
2. **MINOR (`vx.1.x`, `vx.2.x`)**: Adding new features in a backwards-compatible manner (e.g., adding PDF export).
3. **PATCH (`vx.x.1`, `vx.x.2`)**: Backwards-compatible bug fixes, security patches, UI alignment fixes.

## Pre-release Labels
- **Release Candidate (`-RC1`, `-RC2`)**: A version that is feature-complete but requires final field validation (Pilot testing, QA sign-off) before becoming a stable Production release.

## Lifecycle Example
1. `v1.0.0-RC1` (Current Phase: Pilot Testing)
2. `v1.0.0-RC2` (Bug fixes applied after Pilot)
3. `v1.0.0` (Production Release!)
4. `v1.0.1` (Hotfix for minor bugs found in Production)
5. `v1.1.0` (Sprint 3: New Feature Addition)
