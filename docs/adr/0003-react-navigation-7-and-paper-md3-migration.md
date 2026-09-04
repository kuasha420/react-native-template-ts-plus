# 3. React Navigation 7 and React Native Paper MD3 Migration

Date: 2026-08-31
Status: Accepted

## Context
The legacy template targeted React Navigation 6 and React Native Paper v4 (Material Design 2). Specifically:
- `@react-navigation/material-bottom-tabs` was deprecated in Navigation 6 and removed in Navigation 7.
- React Native Paper v5 transitioned to Material Design 3 (`MD3Theme`), requiring `adaptNavigationTheme` for synchronized dark/light theme tokens across React Navigation and Paper.
- Legacy `@aladdinstudios/react-native-immersive-bars` is deprecated and unsupported under React Native's New Architecture (Android 15+ edge-to-edge system standards).
- Legacy `react-native-keyboard-aware-scroll-view` depends on unmaintained legacy packages (`react-native-iphone-x-helper`).

## Decision
1. **React Navigation 7 Upgrade**:
   - Upgrade navigation ecosystem packages to React Navigation 7 (`@react-navigation/native@^7`, `@react-navigation/native-stack@^7`, `@react-navigation/drawer@^7`, `@react-navigation/bottom-tabs@^7`, `@react-navigation/material-top-tabs@^7`).
   - Replace deprecated `@react-navigation/material-bottom-tabs` with `@react-navigation/bottom-tabs` using Paper's Material 3 `BottomNavigation.Bar` component.
2. **React Native Paper v5 (Material 3)**:
   - Use `MD3LightTheme` and `MD3DarkTheme`.
   - Use `adaptNavigationTheme` to ensure cohesive styling across React Navigation containers and Paper surfaces.
3. **MobX-State-Tree 7**:
   - Modernize root store and persistent storage provider with `mobx-state-tree@^7.4.0` and `mst-persistent-store@^3.1.1` backed by `@react-native-async-storage/async-storage`.
4. **Modern Edge-to-Edge and Keyboard Handling**:
   - Use `StatusBar` translucent configuration and `react-native-safe-area-context` insets.
   - Implement `KeyboardAvoidingContainer` using `KeyboardAvoidingView` + `SafeAreaView` from core/maintained libraries.

## Consequences
- App shell runs natively on React 19 and React Native 0.87.1 New Architecture without legacy workarounds.
- Navigation and theming are fully synchronized and type-safe.
- Unmaintained dependencies are eliminated.
