import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, FlatList, TouchableOpacity, Animated, DeviceEventEmitter, AsyncStorage } from 'react-native';
import _ from 'underscore';
import moment from 'moment';

import { Icon } from 'native-base';
import { COLOR } from '../../Constants/Design';
import NotificationService from '../../Database/NotificationService';


const HEADER_HEIGHT = 64;

class WhatsappScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatList: [],
    }
    this.onPressApplication = this.onPressApplication.bind(this);
  }
  componentDidMount() {
    // let notificationsList = NotificationService.fchatListilterByAppAndDate('com.whatsapp');
    let chatList = this.props.navigation.getParam('chatList')
    console.log('CHAT chatList: ', chatList);
    this.setState({ chatList });
  }

  onPressApplication(packageName, appName) {
    // const { navigate } = this.props.navigation;
    // navigate('ALL', { name: appName, packageName })
  }
  render() {
    const { navigation } = this.props;
    const { chatList } = this.state;
    let headerTitle = navigation.getParam('name');
    return (
      <View style={styles.container}>
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
              // this.datePicker();
            }}>
            <Icon type="FontAwesome" name="refresh" style={{ fontSize: 24, color: 'white' }} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ display: 'flex', justifyContent: 'flex-end' }} style={styles.bodyView}>
          {chatList.reverse().map((item, i) => <AppBox key={`whatsapp-chat-box-${i}`} onPress={this.onPressApplication} text={item.text} personName = {item.personName} createdAt={item.createdAt} />)}
        </ScrollView>
      </View>
    )
  }
}

const AppBox = (props) => {
  console.log('props: ', props);
  let sameDay = moment(props.createdAt).isSame(new Date(), 'days');
  let time = sameDay ? moment(props.createdAt).format('LT') : moment(props.createdAt).format('lll');
  return (
    <TouchableOpacity style={styles.appBox} onPress={() => props.onPress(props.packageName, props.appName)}>
    <View style={styles.chatBubble}>
      {props.personName && <Text style={styles.personName}>{props.personName}</Text>}
      <Text style={styles.textMessage}>{props.text}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
    </TouchableOpacity>
  )
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
    backgroundColor: COLOR.WHATSAPP,
  },
  headerText: {
    paddingLeft: 10,
    fontSize: 18,
    color: 'white',
  },
  bodyView: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLOR.WHATSAPP_CHAT_SCRN,
    marginTop: 64,
    padding: 10,
    // paddingBottom: 240,
    height: '100%',
  },
  appBox: {
    marginBottom: 10,
    // backgroundColor: 'white',
  },
  chatBubble: {
    display: 'flex',
    width: '70%',
    padding: 10,
    paddingLeft: 20,
    paddingBottom: 20,
    borderRadius: 25,
    position: 'relative',
    elevation: 1,
    // borderWidth: 1,
    // borderColor: COLOR.LOVELY_GRAY,
    backgroundColor: 'white',
  },
  personName: {
    marginBottom: 10,
    fontWeight: 'bold',
    // backgroundColor: 'blue',
  },
  textMessage: {
    
  },
  time: {
    fontSize: 12,
    position: 'absolute',
    right: 20,
    bottom: 5,
  }
});

export default WhatsappScreen;
















// var chatObject = {};
// kbt.map(item => {
// 	var chatTitle = item.title;
// 	if(chatTitle.includes('messages):')){
// 		chatTitle = chatTitle.slice(0,chatTitle.lastIndexOf('(')).trim();
// 	}
// 	if(chatObject && chatObject[chatTitle]){
// 		chatObject[chatTitle].push(item);
// 	}else{
// 		chatObject[chatTitle] = [item];
// 	}
// })