import React, { Component } from 'react';
import { NativeModules, StyleSheet, Text, Linking, View, ScrollView, Image, Animated, TouchableHighlight, AsyncStorage, DeviceEventEmitter } from 'react-native';
import { AdMobBanner } from 'react-native-admob'
import AwesomeAlert from 'react-native-awesome-alerts';
import DeviceInfo from 'react-native-device-info';

import { Icon, Header } from 'native-base';
import NotificationService from '../Database/NotificationService';
import { COLOR } from '../Constants/Design';

const AboutDev = `Hey Guys,

Thank you for trying out my application and supporting me. 

I'm Ganesh babu, Mobile/Web Application Developer. This is my first application in Android.

I am a solo Developer and I do not own a company. I've tried to do my best in this application. You can help me improve by sending me your suggestions via email. If you like this application, don't forget to give rating in playstore and share it with your friends who you might think wants to Rescue their notifications too. ;)


You can contact me at kbtganesh@gmail.com.
`

const AboutUs = `Icons used in this application are taken from FontAwesome, Entypo, MaterialIcons
Pattern Image used in this application is taken from flaticon
`
const BOX_TITLE = { 'ALL': 'All Notifications', 'APP': 'App wise Notifications', 'WHATSAPP': 'Whatsapp Messages', 'OTHER': 'Support', 'CONTACT': 'Contact' }
const BOX_DESC = {
  'ALL': 'Find all the notifications received in your mobile',
  'APP': 'Get the categorized list of notifications based on application',
  'WHATSAPP': 'Read your whastapp chats including the deleted messages',
  'OTHER': 'Support the developer by checking out the Ads you find in this application',
  'CONTACT': 'Incase if you want to email the developer, feel free to share your comments'
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
      showAlert: false,
      rotateValue: new Animated.Value(0),
      isServiceRunning: false,
    };
    this.callback = this.callback.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.isServiceRunningCallback = this.isServiceRunningCallback.bind(this);
    this.onNotificationPosted = this.onNotificationPosted.bind(this);
    this.sendEmail = this.sendEmail.bind(this);

  }

  componentDidMount() {
    NativeModules.BatteryStatus.isNotificationEnabled(this.callback);
    NativeModules.BatteryStatus.registerNotificationListener();
    DeviceEventEmitter.addListener('onNotificationPosted', this.onNotificationPosted);
    NativeModules.BatteryStatus.isMyServiceRunning(this.isServiceRunningCallback);
    
    
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
          
  isServiceRunningCallback(serviceObj) {
    if('services' in serviceObj) {
      if(serviceObj.services.includes('com.logcharge.NotificationListener')) {
        this.setState({isServiceRunning: true});
      }else{
        this.setState({isServiceRunning: false});
        NativeModules.BatteryStatus.startNotificationService();
      }
    }else{
      this.setState({isServiceRunning: false});
      NativeModules.BatteryStatus.startNotificationService();
    }
  }

  onNotificationPosted(params) {
    params = params['rawNotificationData']
    if(params) {
      params = JSON.parse(params);
      var appName = params['appName']
      var key = params['key']
      var packageName = params['packageName']
      var subText = params['android.subText'];
      var title = params['android.title'];
      var text = params['android.text'];
      var bigText = params['android.bigText'];
      var summeryText = params['android.summaryText'];
      var textLines = params['android.textLines'] || [];
      var ticker = params['ticker'];
      var createdAt = new Date(parseInt(params['timeStamp']));
      var extra = '';
      var notificationObject = {appName, key, packageName, subText, title, text, bigText, summeryText, createdAt, textLines, ticker, extra};
      NotificationService.save(notificationObject);
      
    }
  }

  callback(isNotificationEnabled) {
    if (!isNotificationEnabled){
      this.showAlert();
    }else if(isNotificationEnabled && this.state && this.state.showAlert){
      this.hideAlert();
    }
  }

  hideAlert() {
    this.setState({ showAlert: false, showAboutDev: false, showAboutUs: false });
  }
  
  showAlert() {
    this.setState({ showAlert: true });
  }
  
  showAboutDev() {
    this.setState({ showAboutDev: true });
  }

  sendEmail() {
    this.scrollView.scrollToEnd({animated: true});
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.rotateValue, {
          toValue: 1,
          duration: 50,
          delay: 0
        }),
        Animated.timing(this.state.rotateValue, {
          toValue: -1,
          duration: 50
        }),
        Animated.timing(this.state.rotateValue, {
          toValue: 0,
          duration: 50,
          delay: 0
        })
      ]),
      {
        iterations: 4
      }
    ).start(() => {
      Animated.timing(this.state.rotateValue, {
        toValue: 0,
        duration: 500
      }).start();
    })
  }
  
  render() {
    const { showAlert, showAboutDev, showAboutUs, rotateValue, isServiceRunning } = this.state;
    const spin = rotateValue.interpolate({
      inputRange: [-1, 1],
      outputRange: ['-3deg', '3deg']
    })
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Header androidStatusBarColor={COLOR.PRIMARY} style={{display:'none'}}/>
        <View style={styles.headerView}>
          <Image style={{ ...styles.headerBG }} resizeMode={'cover'} source={require('./Images/pattern.png')}>
          </Image>
          <View style={styles.headerTop}>
          <TouchableHighlight onPress={()=>{
              NativeModules.BatteryStatus.isMyServiceRunning(this.isServiceRunningCallback);
            }}>
            <Icon type="FontAwesome" name="bell" style={{ fontSize: 32, color: 'white' }} />
          </TouchableHighlight>
            <Text style={styles.headerText}>Rescue Notifications</Text>
            <Text>{isServiceRunning?'service active': 'service inactive'}</Text>
          </View>
          <View style={styles.headerBottom}>
            <TouchableHighlight onPress={()=>{
              this.setState({ showAboutDev: true });
            }}>
              <Icon type="FontAwesome" name="user" style={{ fontSize: 20, color: 'white' }} />
            </TouchableHighlight>
            <TouchableHighlight style={{marginLeft: 24}} onPress={()=>{
              this.setState({ showAboutUs: true });
            }}>
              <Icon type="Entypo" name="info-with-circle" style={{ fontSize: 20, color: 'white' }} />
            </TouchableHighlight>
            <TouchableHighlight style={{marginLeft: 24}} onPress={()=>{
              this.sendEmail();
            }}>
              <Icon type="MaterialIcons" name="email" style={{ fontSize: 20, color: 'white' }} />
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.bodyView}>
          <ScrollView ref={ref => this.scrollView = ref} contentContainerStyle={{ display: 'flex', justifyContent: 'space-around' }} style={{ width: '100%', padding: 30 }}>
            <Box type='ALL' navigate={navigate} showAlert={this.showAlert}/>
            <Box type='APP' navigate={navigate} showAlert={this.showAlert}/>
            <Box type='WHATSAPP' navigate={navigate} showAlert={this.showAlert}/>
            <Box type='OTHER' navigate={navigate} showAlert={this.showAlert}/>
            <Box type='CONTACT' navigate={navigate} showAlert={this.showAlert} spin={spin}/>
          </ScrollView>
        </View>

        <AwesomeAlert
            show={showAboutUs}
            showProgress={false}
            title="About Us"
            message={AboutUs}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="Close"
            confirmButtonColor={COLOR.PRIMARY}
            onConfirmPressed={() => {
              this.hideAlert();
            }}
          />
          <AwesomeAlert
            styles={{zIndex: 10000, backgroundColor: 'red'}}
            show={showAboutDev}
            showProgress={false}
            title="About Developer"
            message={AboutDev}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={true}
            showConfirmButton={true}
            confirmText="Close"
            confirmButtonColor={COLOR.PRIMARY}
            onConfirmPressed={() => {
              this.hideAlert();
            }}
          />
        <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title="Notification Request"
            message="Please enable the notification access for 'Rescue Notification' application in following screen."
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showConfirmButton={true}
            confirmText="Go to settings"
            confirmButtonColor={COLOR.PRIMARY}
            onConfirmPressed={() => {
              NativeModules.BatteryStatus.requestForNotificationAccess();
              this.hideAlert();
            }}
          />
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
    const { navigate, spin } = props;
    console.log('AdMobBanner.simulatorId', AdMobBanner.simulatorId);
    let KBTView = View;
    let spinStyle = {};
    if(spin) {
      KBTView = Animated.View;
      spinStyle = { transform: [{rotate: spin}] };
    }
    return (
      <KBTView style={{ ...styles.box, ...spinStyle, marginBottom: props.type === 'CONTACT' ? 50 : 30 }}>
        <View style={{ ...styles.boxTop, backgroundColor: COLOR[props.type] }}>
          <Text style={styles.boxTopTitle}>{BOX_TITLE[props.type]}</Text>
          <Text style={styles.boxTopDesc}>{BOX_DESC[props.type]}</Text>
        </View>
        <TouchableHighlight style={{ ...styles.boxBottom, backgroundColor: COLOR[BottomColor] }} onPress={() => {
          NativeModules.BatteryStatus.isNotificationEnabled((isNotificationEnabled) => {
            if(props.type === 'CONTACT'){
              let kbt = `





*Device Information*
  App Version - ${DeviceInfo.getReadableVersion()}
  Android OS Version - ${DeviceInfo.getSystemVersion()}
  Has Notch - ${DeviceInfo.hasNotch()}
  Manufacturer - ${DeviceInfo.getManufacturer()}
  Model - ${DeviceInfo.getModel()}
  First Install Time - ${new Date(DeviceInfo.getFirstInstallTime()).toLocaleString()}
  Device ID - ${DeviceInfo.getUniqueID()}
  `
              Linking.openURL(`mailto:kbtganesh@gmail.com?subject=RescueNotification-UserComments&body=${kbt}`)
            }else{
              if(isNotificationEnabled)
                navigate(props.type, { name: BOX_TITLE[props.type] })
              else
                props.showAlert();
            }
          });
        }}>
            {props.type !== 'OTHER' ? <Text style={styles.boxBottomText}>{props.type === 'CONTACT' ? 'EMAIL' : 'OPEN'}</Text> : <AdMobBanner
              adSize="fullBanner"
              adUnitID="ca-app-pub-4058004042775880/8130239563"
              // testDevices={[AdMobBanner.simulatorId]}
              onAdFailedToLoad={error => console.warn(error)}
            />}
        </TouchableHighlight>
      </KBTView>
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
    flex: 3,
    // position: 'relative',
    // elevation: 10,
    width: '100%',
    backgroundColor: COLOR.PRIMARY,
  },
  headerBG: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    opacity: 0.05,
  },
  headerTop: {
    display: 'flex',
    height: '80%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: COLOR.PRIMARY,
    // borderBottomRightRadius: 100,
    // borderBottomLeftRadius: 100,
  },
  headerBottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 32,
    marginTop: 20,
    fontFamily: 'sans-serif-light',
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
    elevation: 2,
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