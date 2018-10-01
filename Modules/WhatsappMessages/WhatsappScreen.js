import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, FlatList, TouchableOpacity, Animated, DeviceEventEmitter, AsyncStorage } from 'react-native';
import _ from 'underscore';

import { Icon } from 'native-base';
import { COLOR } from '../../Constants/Design';
import NotificationService from '../../Database/NotificationService';


const HEADER_HEIGHT = 64;

class WhatsappScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationsList: [],
      chatObjects: {},
    }
    this.onPressChatTitle = this.onPressChatTitle.bind(this);
  }
  componentDidMount() {
    let notificationsList = NotificationService.filterByAppAndDate('com.whatsapp');

    let chatObjects = {};
    notificationsList.forEach(item => {
      let [chatTitle, personName] = item.title.split(":");
      chatTitle = chatTitle.trim();
      personName = personName ? personName.trim() : '';
      if (chatTitle.includes('messages)')) {
        chatTitle = chatTitle.slice(0, chatTitle.lastIndexOf('(')).trim();
      }
      if(personName){
        item.personName = personName;
        item.isGroup = true;
      }
      if (chatObjects && chatObjects[chatTitle]) {
        chatObjects[chatTitle].push(item);
      } else {
        chatObjects[chatTitle] = [item];
      }
    })


    this.setState({ chatObjects });
    console.log('applicationsList: ', Object.keys(chatObjects));
  }

  onPressChatTitle(chatTitle) {
    const { chatObjects } = this.state;
    const { navigate } = this.props.navigation;
    navigate('WHATSAPP_CHAT', { name: chatTitle, chatList: chatObjects[chatTitle] })
  }
  render() {
    const { navigation } = this.props;
    const { chatObjects } = this.state;
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
        <ScrollView contentContainerStyle={{ justifyContent: 'flex-start' }} style={styles.bodyView}>
          {Object.keys(chatObjects).map((item, i) => <AppBox key={`whatsapp-name-box-${i}`} onPress={this.onPressChatTitle} chatTitle={item} packageName={item.packageName} />)}
        </ScrollView>
      </View>
    )
  }
}

const AppBox = (props) => {
  console.log('props: ', props);
  return (
    <TouchableOpacity style={styles.appBox} onPress={() => props.onPress(props.chatTitle)}>
      <Text>{props.chatTitle}</Text>
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
    height: 32,
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
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLOR.SECONDARY,
    marginTop: 64,
    // paddingBottom: 240,
    height: '100%',
  },
  appBox: {
    height: 60,
    // marginTop: 20,
    // marginLeft: 20,
    // marginRight: 20,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
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