/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {DatePickerAndroid, StyleSheet, Text, View, FlatList, TouchableOpacity, Animated, DeviceEventEmitter, AsyncStorage} from 'react-native';

import { Icon } from 'native-base';
import { COLOR } from '../../Constants/Design';
import NotificationListRow from './NotificationListRow';
import NotificationService from '../../Database/NotificationService';

// import {Container, Header, Left, Right, Body, Button, Title, Icon, Content} from 'native-base';
const HEADER_HEIGHT = 64;
const INFO_HEIGHT = 32;
class NotificationList extends Component {
  constructor(props) {
    super(props);
   
    this.state = {
      storedList: [],
      selectedDate: '',
      notificationsList: [],
      selectedDate: '',
      infoMargin: new Animated.Value(0),
      flatListMargin: new Animated.Value(HEADER_HEIGHT),
    };

    // this.getBatteryLevel = this.getBatteryLevel.bind(this);
    this.datePicker = this.datePicker.bind(this);
    this.callback = this.callback.bind(this);

   }

   componentDidMount() {
    let notificationsList = NotificationService.getAll();
    this.setState({ notificationsList: notificationsList || [] });
    NotificationService.registerListener((realm, change)=>{
      let data = NotificationService.getAll();
      
      this.setState({ notificationsList: data });
    });
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
          this.setState({ selectedDate: new Date(dateObject.year, dateObject.month, dateObject.day) });
          Animated.timing(                  // Animate over time
            this.state.infoMargin,            // The animated value to drive
            {
              toValue: HEADER_HEIGHT,                   // Animate to opacity: 1 (opaque)
              duration: 100,              // Make it take a while
            }
          ).start();
          Animated.timing(                  // Animate over time
            this.state.flatListMargin,            // The animated value to drive
            {
              toValue: 0,                   // Animate to opacity: 1 (opaque)
              duration: 100,              // Make it take a while
            }
          ).start();
          // Selected year, month (0-11), day
        }
      } catch ({code, message}) {
        console.warn('Cannot open date picker', message);
      }
   }

   callback(params) {
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
      var notificationData = {appName, packageName, subText, title, text, bigText, timeStamp, summeryText, timeText};
      AsyncStorage.getItem('log').then(storedList => {
        if(storedList) { console.log('storedList: ', storedList); storedList = JSON.parse(storedList) } else { storedList = [] }
        storedList.push(notificationData);
        AsyncStorage.setItem('log', JSON.stringify(storedList));
        this.setState({ storedList });
      });
    }
    // let status = params['status'];
    // let obj = {status, time: new Date().toLocaleString()};
  }

  componentWillReceiveProps(nS, nP) {

  }
   
  render() {
    const { notificationsList, selectedDate, infoMargin, flatListMargin } = this.state;
    console.log('notificationsList.length: ', notificationsList.length);
    const infoViewUI = selectedDate ? (<Animated.View style={{...styles.infoView, marginTop: infoMargin}}>
              <Text style={{textAlign: 'center'}}>{selectedDate.toLocaleDateString()}</Text>
            </Animated.View>) : null;
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
              onPress={() => {
                // NotificationService.deleteAll();
                this.datePicker();
              }}>
              <Icon type="FontAwesome" name="calendar" style={{fontSize: 24, color: 'white'}}/>
            </TouchableOpacity>
          </View>
          {infoViewUI}
          <Animated.FlatList
            style={{...styles.bodyView, marginTop: flatListMargin}}
            data={notificationsList}
            keyExtractor={(item, index) => (index+'')}
            renderItem={({item}, i) => {
              return (<NotificationListRow item={item}/>)
              }}
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
    zIndex: 100,
    // textAlign: 'center',
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'center',
    height: HEADER_HEIGHT,
    width: '100%',
    backgroundColor: COLOR.PRIMARY,
  },
  headerText: {
    paddingLeft: 10,
    fontSize: 18,
    color: 'white',
  },
  infoView: {
    height: INFO_HEIGHT,
    backgroundColor: COLOR.SECONDARY,
  },
  bodyView: {
    backgroundColor: '#ffffb3',
    // marginTop: 64,
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

export default NotificationList;
