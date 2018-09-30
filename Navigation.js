import {
  createStackNavigator,
} from 'react-navigation';
import Home from './Modules/Home';
import NotificationList from './Modules/NotificationListScreen/NotificationList';
import AppWiseNotification from './Modules/AppWiseNotification/AppWiseNotification';

const Navigation = createStackNavigator({
  Home: { screen: Home },
  ALL: { screen: NotificationList },
  APP: { screen: AppWiseNotification },
}, {
  initialRouteName: 'Home',
  mode: 'modal',
  headerMode: 'none',
  androidStatusBarColor: "#34495e"
 });

export default Navigation;