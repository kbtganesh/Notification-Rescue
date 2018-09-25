/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, NativeModules, DeviceEventEmitter, AsyncStorage} from 'react-native';
// import {Container, Header, Left, Right, Body, Button, Title, Icon, Content} from 'native-base';

class App extends Component {
  constructor(props) {
    super(props);
   
    this.state = {
      storedList: []
    };

    this.getBatteryLevel = this.getBatteryLevel.bind(this);
    this.callback = this.callback.bind(this);

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
      
          <View style={styles.headerView}><Text style={styles.headerText}>Notification Rescue</Text></View>
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
    position: 'absolute',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 64,
    width: '100%',
    borderBottomWidth: 1,
    backgroundColor: '#fcae6a',
    // borderBottomColor: 'black'
  },
  headerText: {
    fontSize: 18,
  },
  bodyView: {
    backgroundColor: '#ffe6d1',
    marginTop: 64,
    height: 100,
  },
  listView: {
    borderBottomWidth: 1,
  }
});

export default App;
