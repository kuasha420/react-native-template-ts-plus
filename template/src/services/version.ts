export const currentVersion = '5.1.0';

const getLatestVersion = async () => {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/kuasha420/react-native-template-ts-plus/master/package.json'
    );
    const { version } = await res.json();
    return version;
  } catch (error) {
    console.log(error);
    return currentVersion;
  }
};

export default getLatestVersion;
