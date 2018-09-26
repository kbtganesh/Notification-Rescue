/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {DatePickerAndroid, StyleSheet, Text, View, FlatList, TouchableOpacity, NativeModules, DeviceEventEmitter, AsyncStorage} from 'react-native';
import { Icon } from 'native-base';
import { COLOR } from './Constants/Design';
// import {Container, Header, Left, Right, Body, Button, Title, Icon, Content} from 'native-base';

class App extends Component {
  constructor(props) {
    super(props);
   
    this.state = {
      storedList: [],
      selectedDate: '',
    };

    this.getBatteryLevel = this.getBatteryLevel.bind(this);
    this.datePicker = this.datePicker.bind(this);
    this.callback = this.callback.bind(this);

   }

   async datePicker() {
      try {
        const dateObject = await DatePickerAndroid.open({
          // Use `new Date()` for current date.
          // May 25 2020. Month 0 is January.
          date: new Date(2020, 4, 25)
        });
        if (dateObject.action !== DatePickerAndroid.dismissedAction) {
          console.log('dateObject: ', dateObject);
          // Selected year, month (0-11), day
        }
      } catch ({code, message}) {
        console.warn('Cannot open date picker', message);
      }
   }

   async componentDidMount() {
    this.getBatteryLevel(this.callback);
    let storedList = await AsyncStorage.getItem('log');
    if(storedList) { storedList = JSON.parse(storedList) } else { storedList = [] }
    this.setState({ storedList });
    DeviceEventEmitter.addListener('onNotificationPosted', this.callback);
   }

   async callback(params) {
     console.log('params: ORIGINAL ', params);
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
      var timeStamp = params['timeStamp'];
      var timeText = new Date(parseInt(timeStamp)).toLocaleString();
      var notificationData = {appName, packageName, subText, title, text, bigText, timeStamp, timeText};
      let storedList = await AsyncStorage.getItem('log');
      if(storedList) { storedList = JSON.parse(storedList) } else { storedList = [] }
      storedList.push(notificationData);
      await AsyncStorage.setItem('log', JSON.stringify(storedList));
      this.setState({ storedList });
    }
    // let status = params['status'];
    // let obj = {status, time: new Date().toLocaleString()};
  }
   
   getBatteryLevel = (callback) => {
      NativeModules.BatteryStatus.registerNotificationEvent(callback);
   }
  render() {
    return (
      <View style={styles.container}>
      
          <View style={styles.headerView}>
            <TouchableOpacity style={styles.boxBottomText} title="OPEN"
              onPress={() =>
                this.props.navigation.goBack()
              }>
              <Text style={{color: 'white'}}>Back</Text>
        </TouchableOpacity>
            <Text style={styles.headerText}>All Notifications</Text>
            <TouchableOpacity style={styles.boxBottomText} title="OPEN"
              onPress={() =>
                this.datePicker()
              }>
              <Icon type="FontAwesome" name="calendar" style={{fontSize: 24, color: 'white'}}/>
            </TouchableOpacity>
          </View>
          {/* <Text style={styles.instructions}>headset Level</Text> */}
          <FlatList
            style={styles.bodyView}
            data={this.state.storedList.reverse()}
            keyExtractor={(item, index) => (index+'')}
            renderItem={({item}, i) => (
              <View style={styles.listView}>
                <Text>{item.appName}</Text>
                <Text>{item.timeText}</Text>
                <Text>{item.title}</Text>
                <Text>{item.text}</Text>
              </View>
            )}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  headerView: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    // textAlign: 'center',
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'center',
    height: 64,
    width: '100%',
    backgroundColor: COLOR.PRIMARY,
  },
  headerText: {
    paddingLeft: 10,
    fontSize: 18,
    color: 'white',
  },
  bodyView: {
    backgroundColor: '#ffffb3',
    marginTop: 64,
    height: 100,
  },
  listView: {
    margin: 10,
    marginBottom: 0,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
  }
});

export default App;
