import {
  createStackNavigator,
} from 'react-navigation';
import Home from './Modules/Home';

const Navigation = createStackNavigator({
  Home: { screen: Home },
}, {
  initialRouteName: 'Home',
  mode: 'modal',
  headerMode: 'none'
 });

export default Navigation;