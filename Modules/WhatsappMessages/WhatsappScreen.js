import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, FlatList, TouchableOpacity, Animated, DeviceEventEmitter, AsyncStorage } from 'react-native';
import { Container, Header, Content, Tab, Tabs } from 'native-base';
import { AdMobBanner } from 'react-native-admob'
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
      singleChat: {},
      groupChat: {},
    }
    this.onPressChatTitle = this.onPressChatTitle.bind(this);
    this.loadWhatsappData = this.loadWhatsappData.bind(this);
  }
  componentDidMount() {
    this.loadWhatsappData();
  }

  loadWhatsappData() {
    let notificationsList = NotificationService.filterByAppAndDate('com.whatsapp');

    let singleChat = {};
    let groupChat = {};
    notificationsList.forEach(item => {
      let chatTitle, personName;
      if(item.title.includes('@')){
        [personName, chatTitle] = item.title.split("@");
        chatTitle = chatTitle.trim();
        personName = personName ? personName.trim() : '';
        if (chatTitle.includes('messages)')) {
          chatTitle = chatTitle.slice(0, chatTitle.lastIndexOf('(')).trim();
        }
      }else{
        [chatTitle, personName] = item.title.split(":");
        chatTitle = chatTitle.trim();
        personName = personName ? personName.trim() : '';
        if (chatTitle.includes('messages)')) {
          chatTitle = chatTitle.slice(0, chatTitle.lastIndexOf('(')).trim();
        }
      }
      if (personName.match(".*[a-zA-Z0-9]+.*")) {
        item.personName = personName;
        item.isGroup = true;
      }
      if (!item.isGroup) {
        if (singleChat && singleChat[chatTitle]) {
          singleChat[chatTitle].push(item);
        } else {
          singleChat[chatTitle] = [item];
        }
      } else {
        if (groupChat && groupChat[chatTitle]) {
          groupChat[chatTitle].push(item);
        } else {
          groupChat[chatTitle] = [item];
        }
      }
    })


    this.setState({ singleChat, groupChat });
    console.log('applicationsList: Group', Object.keys(groupChat));
    console.log('applicationsList: Single', Object.keys(singleChat));
  }

  onPressChatTitle(chatTitle, type) {
    const { singleChat, groupChat } = this.state;
    const { navigate } = this.props.navigation;
    navigate('WHATSAPP_CHAT', { name: chatTitle, chatList: type === 'single' ? singleChat[chatTitle] : groupChat[chatTitle] })
  }
  render() {
    const { navigation } = this.props;
    const { singleChat, groupChat } = this.state;
    let groupChatList = Object.keys(groupChat) || [];
    let singleChatList = Object.keys(singleChat) || [];
    singleChatList = singleChatList.filter(item => !groupChatList.includes(item));
    singleChatList.insert(singleChatList.length >= 4 ? randomIntFromInterval(2,singleChatList.length) : singleChatList.length, 'kbtganesh-advertisement')
    groupChatList.insert(singleChatList.length >= 4 ? randomIntFromInterval(2,singleChatList.length) : singleChatList.length, 'kbtganesh-advertisement')
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
              this.loadWhatsappData();
            }}>
            <Icon type="FontAwesome" name="refresh" style={{ fontSize: 24, color: 'white' }} />
          </TouchableOpacity>
        </View>
        <Container style={{ marginTop: HEADER_HEIGHT }}>
          <Tabs>
            <Tab heading="Groups" tabStyle={styles.tabStyle} textStyle={styles.tabTextStyle} activeTabStyle={styles.activeTabStyle}>
              <ScrollView contentContainerStyle={{ justifyContent: 'flex-start' }} style={styles.bodyView}>
                {groupChatList.map((item, i) => <AppBox key={`whatsapp-name-box-${i}`}
                  onPress={() => { this.onPressChatTitle(item, 'group') }} chatTitle={item} packageName={item.packageName} />)}
              </ScrollView>
            </Tab>
            <Tab heading="Contacts" tabStyle={styles.tabStyle} textStyle={styles.tabTextStyle} activeTabStyle={styles.activeTabStyle}>
              <ScrollView contentContainerStyle={{ justifyContent: 'flex-start' }} style={styles.bodyView}>
                {singleChatList.map((item, i) => <AppBox key={`whatsapp-name-box-${i}`}
                  onPress={() => { this.onPressChatTitle(item, 'single') }} chatTitle={item} packageName={item.packageName} />)}
              </ScrollView>
            </Tab>
          </Tabs>
        </Container>
      </View>
    )
  }
}

const AppBox = (props) => {
  console.log('props: ', props);
  const { chatTitle } = props;
  if(chatTitle === 'kbtganesh-advertisement'){
    return (
      <AdMobBanner
        adSize="fullBanner"
        adUnitID="ca-app-pub-4058004042775880/7760195164"
        onAdFailedToLoad={error => console.warn(error)}
      />
    )
  }else{
    let chatTitleWithoutEmojies = chatTitle.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, '');
    let firstLetter = (chatTitleWithoutEmojies.match(/[a-zA-Z0-9]/) || []).pop() || chatTitleWithoutEmojies[0];
      return (
        <TouchableOpacity style={styles.appBox} onPress={props.onPress}>
          <View style={styles.letterIcon}>
            <Text style={styles.letterIconText}>{firstLetter}</Text>
          </View>
          <Text style={styles.chatTitle}>{chatTitle}</Text>
        </TouchableOpacity>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: COLOR.WHATSAPP_CHAT_SCRN,
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
    // marginTop: 64,
    // paddingBottom: 240,
    height: '100%',
  },
  appBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    // borderBottomWidth: 1,
    // backgroundColor: COLOR.LIGHT_GRAY,
  },
  letterIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4b636e',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  letterIconText: {
    fontSize: 18,
    color: COLOR.PRIMARY_TEXT
  },
  chatTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabStyle: {
    backgroundColor: COLOR.WHATSAPP_DARK
  },
  tabTextStyle: {
    color: 'white',
  },
  activeTabStyle: {
    backgroundColor: COLOR.WHATSAPP_DARK
  }
});

function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

Array.prototype.insert = function ( index, item ) {
  this.splice( index, 0, item );
};

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