import {
  createStackNavigator,
} from 'react-navigation';
import Home from './Modules/Home';

const Navigation = createStackNavigator({
  Home: { screen: Home },
}, {
  initialRouteName: 'Home',
  mode: 'modal',
  headerMode: 'none',
  androidStatusBarColor: "#34495e"
 });

export default Navigation;