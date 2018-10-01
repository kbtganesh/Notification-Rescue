import {
  createStackNavigator,
} from 'react-navigation';
import Home from './Modules/Home';
import NotificationList from './Modules/NotificationListScreen/NotificationList';
import AppWiseNotification from './Modules/AppWiseNotification/AppWiseNotification';
import WhatsappScreen from './Modules/WhatsappMessages/WhatsappScreen';
import WhatsappChat from './Modules/WhatsappMessages/WhatsappChat';

const Navigation = createStackNavigator({
  Home: { screen: Home },
  ALL: { screen: NotificationList },
  APP: { screen: AppWiseNotification },
  WHATSAPP: { screen: WhatsappScreen },
  WHATSAPP_CHAT: { screen: WhatsappChat },
}, {
  initialRouteName: 'Home',
  mode: 'modal',
  headerMode: 'none',
  androidStatusBarColor: "#34495e"
 });

export default Navigation;