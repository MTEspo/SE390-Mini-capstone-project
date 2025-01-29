<<<<<<< HEAD
# SE390-Mini-capstone-project
=======
# SE390-Mini-capstone-project


# Concordia Campus App - iOS Setup and E2E Testing Guide

## Description
The **Concordia Campus App** provides students with access to campus resources, including event schedules, announcements, and class information. This guide will help you set up the iOS environment for running the app and executing End-to-End (E2E) tests.

## Prerequisites
Before setting up the app, ensure you have the following software installed:

- **Xcode**: Required for building and running the app on iOS devices/simulators.
- **Homebrew**: A macOS package manager.

### Installation Instructions

#### 1. Install Xcode
   - Download Xcode from the Mac App Store or the [official website](https://developer.apple.com/xcode/).
   - Open Xcode, and agree to the license when prompted.
   - Ensure that the iOS components are installed:
     - Go to **Xcode > Preferences > Components** and install the required iOS simulator. (Get ios underneath the macbook one that should be built in)

#### 2. Install Command Line Tools
   - Open Terminal and run the following command:
     ```bash
     xcode-select --install
     ```
### 3. Install brew commands
- Maestro download
    ```bash
    brew tap mobile-dev-inc/tap
    brew install maestro
    ```
### 4. Make expo account
- Will need to be invited to the project
- Once invited can run the following
```bash
  npx expo login
```

### 5. Run the simulator
- Use the following command to start simulator
```bash
npx expo run ios
```

### 6. When simulator running, cd maestro in new terminal
- Run the following command to run your test file
  ```bash
    maestro test testFile.yml

### Possible issue with System events error with simulator
- System settings in mac privacy automation for vscode toggled on
>>>>>>> origin/pipeline-e2e-maestroVersion
