# Phase 0 Handover Prompt

Use the following prompt to continue this work in a new workstation or agent session.

```md
You are continuing the modernization of `react-native-template-ts-plus`.

Repository:
- Canonical remote: `https://github.com/kuasha420/react-native-template-ts-plus.git`
- Use the checked-out local worktree for this repo in the current environment
- Branch: `feat/resurrection`

Primary objective:
- Modernize this old React Native template to the current React Native baseline while preserving the original template's best DX features and preconfigurations.

Phase status:
- Phase 0 is complete.
- Read `UPGRADE_PLAN.md` first.
- The plan has already been updated to use a scaffold-first rebuild strategy.

Critical strategy decision:
- Do not perform an in-place upgrade of the old `template/` app.
- Instead, replace `template/` with a fresh official React Native `0.85.1` community CLI scaffold, then selectively reintroduce this template's JS DX, app shell, and native integrations.
- After the reset, diff against the current `master` branch to port forward only what is still valuable and maintainable.

Verified baseline facts from the previous session:
- Latest stable React Native on npm at the time of planning: `0.85.1`
- React Native `0.76` made New Architecture the default on `2024-10-23`
- React Native `0.82` made New Architecture the only architecture on `2025-10-08`
- React Native `0.85` was released on `2026-04-07`

What is valuable in the existing template and should be preserved if still worth the maintenance cost:
- TypeScript-first `src/` app shell
- MobX-State-Tree root store with persistence
- React Navigation shell with typed params
- Deep linking and universal/app links
- React Native Paper theming with system/user override
- BootSplash startup flow
- Safe-area-aware containers and keyboard-aware container
- `~/` absolute import alias
- Version bump automation and generated project README

Important migration cautions:
- Do not blindly overwrite the whole repo.
- Reset the generated template surface, but preserve and intentionally update root-level template package files such as:
  - `package.json`
  - `template.config.js`
  - release/version automation
  - top-level docs
- Keep the project as a bare/community-CLI React Native template, not Expo.
- Preserve the value of the template, not necessarily every original package.

Known dependency risk areas:
- `react-native-vector-icons` is deprecated in favor of per-icon-family packages
- `@react-navigation/material-bottom-tabs` blocks a clean move to React Navigation 7
- `@aladdinstudios/react-native-immersive-bars` is stale and should be re-evaluated
- `react-native-keyboard-aware-scroll-view` is old and should be justified before keeping
- `react-native-version` is old and should be re-evaluated

Current docs created in Phase 0:
- `UPGRADE_PLAN.md`
- `PHASE0_HANDOVER_PROMPT.md`

Suggested starting workflow for the next session:
1. Read `UPGRADE_PLAN.md`.
2. Check `git status` and confirm the branch is `feat/resurrection`.
3. Review the current `master` branch template structure and root packaging files.
4. Start Phase 1 from the plan: modernize repo toolchain and verification scripts.
5. Then begin Phase 2: replace `template/` with a fresh RN `0.85.1` scaffold.

Helpful baseline generation command used previously:
- `npx --yes @react-native-community/cli@20.1.3 init RN85Baseline --version 0.85.1 --directory /tmp/rn85-template-baseline --skip-install --skip-git-init --install-pods false`

Important note about the previous session:
- A temporary baseline app was generated under `/tmp/rn85-template-baseline` for comparison only. Treat that as ephemeral and regenerate it if needed.

Expected atomic commit boundaries from the plan:
- `chore: modernize repo toolchain and verification scripts`
- `feat: replace template scaffold with react-native 0.85.1 baseline`
- `feat: restore template app shell and javascript dx`
- `feat: restore native integrations on rn 0.85.1 scaffold`
- `feat: restore template integrations on modern react native`
- `docs: refresh generated docs and modern developer experience`

When resuming, optimize for staying as close as possible to the official RN `0.85.1` template and keeping native diffs minimal.
```
