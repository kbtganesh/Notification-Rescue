/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { DatePickerAndroid, StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, DeviceEventEmitter, AsyncStorage } from 'react-native';
import moment from 'moment';

import { Icon, Header } from 'native-base';
import { COLOR } from '../../Constants/Design';
import NotificationListRow from './NotificationListRow';
import NotificationService from '../../Database/NotificationService';
import EmptyPage from '../../Components/EmptyPage';

// import {Container, Header, Left, Right, Body, Button, Title, Icon, Content} from 'native-base';
const HEADER_HEIGHT = 64;
const INFO_HEIGHT = 42;
class NotificationList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storedList: [],
      selectedDate: '',
      notificationsList: [],
      selectedDate: '',
      filterByApp: '',
      infoMargin: new Animated.Value(0),
      flatListMargin: new Animated.Value(HEADER_HEIGHT),
    };

    // this.getBatteryLevel = this.getBatteryLevel.bind(this);
    this.datePicker = this.datePicker.bind(this);
    this.showInfo = this.showInfo.bind(this);
    this.hideInfo = this.hideInfo.bind(this);
    this.notificationListenerCallback = this.notificationListenerCallback.bind(this);
    this.onNotificationPress = this.onNotificationPress.bind(this);
    this.getNotifications = this.getNotifications.bind(this);

  }

  getNotifications() {
    const { navigation } = this.props;
    const { selectedDate } = this.state;
    const filterByApp = navigation.getParam('packageName');
    let dataList;
    if(filterByApp || selectedDate){
      if(filterByApp && selectedDate){
        dataList = NotificationService.filterByAppAndDate(filterByApp, selectedDate);
      }else if(filterByApp){
        dataList = NotificationService.filterByAppAndDate(filterByApp);
      }else{
        dataList = NotificationService.getForDate(selectedDate);
      }
    }else{
      dataList = NotificationService.getAll();
    }
    return dataList || [];

  }

  componentDidMount() {
    const { navigation } = this.props;
    const filterByApp = navigation.getParam('packageName');
    let notificationsList;
    if(filterByApp){
      notificationsList = NotificationService.filterByAppAndDate(filterByApp);
    }else{
      notificationsList = NotificationService.getAll();
    }
    this.setState({ notificationsList: notificationsList || [], filterByApp: filterByApp || '' });
    NotificationService.registerListener(this.notificationListenerCallback);
  }
  
  notificationListenerCallback() {
    this.setState({ notificationsList: this.getNotifications() });
  }
  
  componentWillUnmount() {
    NotificationService.removeListener(this.notificationListenerCallback);

  }

  async datePicker() {
    try {
      const dateObject = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: this.state.selectedDate || new Date()
      });
      if (dateObject.action !== DatePickerAndroid.dismissedAction) {
        let date = new Date(dateObject.year, dateObject.month, dateObject.day);
        const { filterByApp } = this.state;
        let notificationsList;
        if(filterByApp) {
          notificationsList = NotificationService.filterByAppAndDate(filterByApp, date);
        }else{
          notificationsList = NotificationService.getForDate(date);
        }
        this.setState({ selectedDate: date, notificationsList});
        this.showInfo();
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  showInfo() {
    Animated.timing(                  // Animate over time
      this.state.infoMargin,            // The animated value to drive
      {
        toValue: HEADER_HEIGHT,                   // Animate to opacity: 1 (opaque)
        duration: 100,              // Make it take a while
      }
    ).start();
  }

  hideInfo() {
    Animated.timing(                  // Animate over time
      this.state.infoMargin,            // The animated value to drive
      {
        toValue: HEADER_HEIGHT - INFO_HEIGHT - 10,                   // Animate to opacity: 1 (opaque)
        duration: 100,              // Make it take a while
      }
    ).start(() => this.setState({ selectedDate: '' }, ()=>{this.setState({ notificationsList: this.getNotifications() })}));
  }

  onNotificationPress(notificationObject) {
    const { navigate } = this.props.navigation;
    navigate('NotificationDetail', { name: notificationObject.appName, notificationObject })
  }

  render() {
    const { notificationsList, selectedDate, infoMargin, flatListMargin } = this.state;
    const { navigation } = this.props;
    let headerTitle = navigation.getParam('name');


    const infoViewUI = selectedDate ? (<Animated.View style={{ ...styles.infoView, marginTop: infoMargin }}>
      <TouchableOpacity style={styles.infoTextLayer} title="OPEN"
        onPress={() => {
          this.datePicker();
        }}>
        <Text style={{ ...styles.infoText, textAlign: 'center' }}>{moment(selectedDate).format('ll')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.infoClose} title="OPEN"
        onPress={() => {
          this.hideInfo();
        }}>
        <Icon type="EvilIcons" name="close-o" style={{ fontSize: 24, color: COLOR.PRIMARY }} />
      </TouchableOpacity>
    </Animated.View>) : null;
    return (
      <View style={styles.container}>
        <Header androidStatusBarColor={COLOR.PRIMARY} style={{display:'none'}}/>
        <View style={styles.headerView}>
          <TouchableOpacity style={styles.boxBottomText} title="OPEN"
            onPress={() =>
              this.props.navigation.goBack()
            }>
            <Text style={{ color: 'white' }}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>{headerTitle}</Text>
          <TouchableOpacity style={styles.boxBottomText} title="OPEN"
            onPress={() => {
              // NotificationService.deleteAll();
              this.datePicker();
            }}>
            <Icon type="FontAwesome" name="calendar" style={{ fontSize: 24, color: 'white' }} />
          </TouchableOpacity>
        </View>
        {infoViewUI}
        {notificationsList.length > 0 
        ? 
        <Animated.FlatList
          style={{ ...styles.bodyView, marginTop: selectedDate ? 0 : HEADER_HEIGHT }}
          data={notificationsList}
          keyExtractor={(item, index) => (index + '')}
          renderItem={({ item }, i) => {
            return (<NotificationListRow item={item} onPress={()=>this.onNotificationPress(item)}/>)
          }}
        />
        :
        <EmptyPage style={styles.bodyView}/>
        }
        
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
    elevation: 10,
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
    display: 'flex',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: INFO_HEIGHT,
    backgroundColor: COLOR.SECONDARY,
  },
  infoTextLayer: {
    // borderWidth: 1,
    // borderColor: COLOR.PRIMARY_LIGHT,
    // paddingLeft: 5,
    // paddingRight: 5,
    // borderRadius: 10,
  },
  infoText: {
    color: COLOR.PRIMARY,
    fontSize: 16,
  },
  infoClose: {
    position: 'absolute',
    right: 15,
  },
  bodyView: {
    backgroundColor: '#263238',
    // marginTop: 64,
    height: 100,
  }
});

export default NotificationList;
