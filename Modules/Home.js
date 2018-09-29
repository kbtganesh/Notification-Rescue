import React, { Component } from 'react';
import { NativeModules, StyleSheet, Text, Image, View, ScrollView, Button, TouchableOpacity, AsyncStorage, DeviceEventEmitter } from 'react-native';
import { Icon } from 'native-base';
import NotificationService from '../Database/NotificationService';
import { COLOR } from '../Constants/Design';


const BOX_TITLE = { 'ALL': 'All Notifications', 'APP': 'App wise Notifications', 'WHATSAPP': 'Whatsapp Messages', 'OTHER': 'Other' }
const BOX_DESC = {
  'ALL': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  'APP': 'Nulla lectus mauris, volutpat at congue eget, finibus eu',
  'WHATSAPP': 'Sed faucibus porttitor ipsum pellentesque et congue erat',
  'OTHER': 'Cras quis felis vel metus lobortis porta a ut ligula'
}
class Home extends Component {
  static navigationOptions = {
    title: 'Navigation Rescue',
  };
  constructor(props) {
    super(props);

    this.state = {
      storedList: [],
      notificationsList: null,
    };
    this.callback = this.callback.bind(this);
    this.onNotificationPosted = this.onNotificationPosted.bind(this);

  }

  componentDidMount() {
    NativeModules.BatteryStatus.isNotificationEnabled(this.callback);
    AsyncStorage.getItem('RegisterNotification').then(value => {
      if (!value) {
        NativeModules.BatteryStatus.registerNotificationListener();
        AsyncStorage.setItem('RegisterNotification', true);
        ;
      }
    });
    DeviceEventEmitter.addListener('onNotificationPosted', this.onNotificationPosted);


    
    // try {
    //   const dateObject = await DatePickerAndroid.open({
    //     // Use `new Date()` for current date.
    //     // May 25 2020. Month 0 is January.
    //     date: new Date(2020, 4, 25)
    //   });
    //   if (dateObject.action !== DatePickerAndroid.dismissedAction) {
    //     console.log('dateObject: ', dateObject);
    //     // Selected year, month (0-11), day
    //   }
    // } catch ({code, message}) {
    //   console.warn('Cannot open date picker', message);
    // }
  }

  onNotificationPosted(params) {
    params = params['rawNotificationData']
    if(params) {
      params = JSON.parse(params);
      var appName = params['appName']
      var packageName = params['packageName']
      var subText = params['android.subText'];
      var title = params['android.title'];
      var text = params['android.text'];
      var bigText = params['android.bigText'];
      var summeryText = params['android.summaryText'];
      var createdAt = new Date(parseInt(params['timeStamp']));
      var notificationObject = {appName, packageName, subText, title, text, bigText, summeryText, createdAt};
      NotificationService.save(notificationObject);
      
    }
  }

  callback(isNotificationEnabled) {
    if (!isNotificationEnabled)
      NativeModules.BatteryStatus.requestForNotificationAccess();
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <View style={styles.headerTop}>
            <Icon type="FontAwesome" name="bell" style={{ fontSize: 24, color: 'white' }} />
            <Text style={styles.headerText}>Notification Rescue</Text>
          </View>
        </View>
        <View style={styles.bodyView}>
          <ScrollView contentContainerStyle={{ display: 'flex', justifyContent: 'space-around' }} style={{ width: '100%', padding: 30 }}>
            <Box type='ALL' navigate={navigate} />
            <Box type='APP' />
            <Box type='WHATSAPP' />
            <Box type='OTHER' />
          </ScrollView>
        </View>

      </View>
    );
  }
}

class Box extends Component {
  constructor(props) {
    super(props);

  }

  componentWillReceiveProps(nS, nP) {
  }

  render() {
    let props = this.props;
    let BottomColor = props.type + '_DARK';
    const { navigate } = props;
    return (
      <View style={{ ...styles.box, marginBottom: props.type === 'OTHER' ? 50 : 30 }}>
        <View style={{ ...styles.boxTop, backgroundColor: COLOR[props.type] }}>
          <Text style={styles.boxTopTitle}>{BOX_TITLE[props.type]}</Text>
          <Text style={styles.boxTopDesc}>{BOX_DESC[props.type]}</Text>
        </View>
        <View style={{ ...styles.boxBottom, backgroundColor: COLOR[BottomColor] }}>
          <TouchableOpacity style={styles.boxBottomText} title="OPEN"
            onPress={() =>
              navigate('ALL', { name: 'All Notifications' })
            }>
            <Text style={styles.boxBottomText}>OPEN</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLOR.SECONDARY,


    // justifyContent: 'center',
    // alignItems: 'center',
  },
  headerView: {
    flex: 4,

    width: '100%',
    backgroundColor: COLOR.PRIMARY,
  },
  headerTop: {
    display: 'flex',
    height: '70%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    backgroundColor: COLOR.PRIMARY,
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 100,
  },

  headerText: {
    fontSize: 18,
    color: COLOR.PRIMARY_TEXT,
  },
  bodyView: {
    flex: 10,
    flexDirection: 'column',
    backgroundColor: COLOR.SECONDARY,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  box: {
    width: '100%',
    height: 150,
    marginBottom: 30,
    borderRadius: 20,
    backgroundColor: 'white'
  },
  boxTop: {
    justifyContent: 'space-around',
    padding: 15,
    height: '65%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  boxTopTitle: {
    fontSize: 20,
    fontFamily: 'sans-serif-light',
    color: 'white',
  },
  boxTopDesc: {
    fontSize: 14,
    fontFamily: 'sans-serif-light',
    color: '#c5cae9',
  },

  boxBottom: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '35%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  boxBottomText: {
    fontSize: 16,
    fontFamily: 'sans-serif-medium',
    color: 'white',
  }
});

export default Home;