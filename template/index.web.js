import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import appInfo from './app.json';
import App from './src';

const MaterialCommunityIcons = require('react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf');

const IconsCSS = `
@font-face {
  font-family: 'MaterialCommunityIcons';
  src: url(${MaterialCommunityIcons}) format('truetype');
}
`;

const importIconsCSS = () => {
  const newStyle = document.createElement('style');
  newStyle.appendChild(document.createTextNode(IconsCSS));
  document.head.appendChild(newStyle);
};

AppRegistry.registerComponent(appInfo.name, () => App);

importIconsCSS();

AppRegistry.runApplication(appInfo.name, {
  rootTag: document.getElementById('root'),
});
