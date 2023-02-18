# React Native Template TypeScript Plus <!-- omit in toc -->

> React Native TypeScript Template with Superpowers.

- [Features](#features)
- [Usage](#usage)
  - [Usage with older versions of React Native](#usage-with-older-versions-of-react-native)
    - [React Native <=> Template Version](#react-native--template-version)
- [Troubleshooting](#troubleshooting)
  - [IOS](#ios)
    - [fatal error: 'openssl/opensslv.h' file not found](#fatal-error-opensslopensslvh-file-not-found)
      - [Solution 1 - Create Symbolic Links](#solution-1---create-symbolic-links)
      - [Solution 2 - Disable Flipper](#solution-2---disable-flipper)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

## Features

- Elegant usage directly within the [React Native CLI](https://github.com/react-native-community/cli)
- TypeScript Configured for Type safety and great Developer experience.
- Built-in dark mode that follows system preference (Experimental) or in app preference.
- Persistent Global State Management with [Mobx State Tree](https://github.com/mobxjs/mobx-state-tree) and [Async Storage](https://github.com/react-native-async-storage/async-storage) using [MST Persistent Store](https://github.com/kuasha420/mst-persistent-store)
- Splash Screen Configured using [React Native Bootsplash](https://github.com/zoontek/react-native-bootsplash)
- Preconfigured Navigation System using [React Navigation](https://reactnavigation.org/)
- Deep Linking and Universal Linking Enabled
- Absolute Import using `~/` prefix.
- React Native Paper & Vector Icons Installed & Pre-configured.
- Easy version management with [React Native Version](https://github.com/stovmascript/react-native-version)
- Integrated [README](template/README.md) on the generated project!

## Usage

`npx react-native init MyApp --template react-native-template-ts-plus`

Or use custom App Name and/or directory

`npx react-native init MyApp --title 'My App' --directory 'my-app' --template react-native-template-ts-plus`

### Usage with older versions of React Native

`npx react-native init MyApp --template react-native-template-ts-plus@1.0.*`

See the below table to find out which version of the template to use.

#### React Native <=> Template Version

<!-- start version-matrix -->

| React Native | Template |
| ------------ | -------- |
| 0.70.7       | 5.1.\*   |
| 0.70.5       | 5.0.\*   |
| 0.69.5       | 4.1.\*   |
| 0.69.2       | 4.0.\*   |
| 0.68.2       | 3.1.\*   |
| 0.68.1       | 3.0.\*   |
| 0.66.3       | 2.0.\*   |
| 0.64.2       | 1.1.\*   |
| 0.64.1       | 1.0.\*   |

<!-- end version-matrix -->

## Troubleshooting

### IOS

#### fatal error: 'openssl/opensslv.h' file not found

> This should no longer happen on RN 0.68.1 and up (Template Version 3.0.0+).

This seems to happen on APFS Case Sensitive Filesystems when Flipper is enabled.

##### Solution 1 - Create Symbolic Links

Thanks to [felexx90](https://github.com/facebook/react-native/issues/28409#issuecomment-833182353) for providing this solution.

Edit `ios/Podfile` and add the following lines inside `post_install`.

```ruby
post_install do |installer|
    react_native_post_install(installer)
    # Fix OpenSSL-Universal on APFS Case Sensitive Filesystem
    system('cd Pods/Headers/Public; ln -s Protobuf protobuf')
    system('cd Pods/OpenSSL-Universal/Frameworks/OpenSSL.xcframework/ios-arm64_arm64e_armv7_armv7s; ln -sfh OpenSSL.framework openssl.framework')
    system('cd Pods/OpenSSL-Universal/Frameworks/OpenSSL.xcframework/ios-arm64_i386_x86_64-simulator; ln -sfh OpenSSL.framework openssl.framework')
    system('cd Pods/OpenSSL-Universal/Frameworks/OpenSSL.xcframework/ios-arm64_x86_64-maccatalyst; ln -sfh OpenSSL.framework openssl.framework')
    system('cd Pods/OpenSSL-Universal/Frameworks/OpenSSL.xcframework/macos-arm64_arm64e_x86_64; ln -sfh OpenSSL.framework openssl.framework')
  end
```

Now, reinstall pods.

`cd ios && pod install`

##### Solution 2 - Disable Flipper

If you do not need flipper you can just disable it to fix this error.

Edit `ios/Podfile` and comment out `use_flipper!()`.

```ruby
  # use_flipper!()
```

Now, reinstall pods and update repo.

`cd ios && pod install --repo-update`

## Contributing

Contributions are very welcome. Please check out the [contributing document](CONTRIBUTING.md).

## License

This project is [MIT](LICENSE) licensed.

## Credits

This repository and template is soft-forked from [ react-native-template-typescript ](https://github.com/react-native-community/react-native-template-typescript).

All integrated and pre-configured libraries are the hard work of their respective authors and contributors.

The Awesome React Native Community
