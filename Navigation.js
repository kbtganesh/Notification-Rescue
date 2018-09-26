import {
  createStackNavigator,
} from 'react-navigation';
import Home from './Modules/Home';
import App from './App';

const Navigation = createStackNavigator({
  Home: { screen: Home },
  ALL: { screen: App },
}, {
  initialRouteName: 'Home',
  mode: 'modal',
  headerMode: 'none',
  androidStatusBarColor: "#34495e"
 });

export default Navigation;