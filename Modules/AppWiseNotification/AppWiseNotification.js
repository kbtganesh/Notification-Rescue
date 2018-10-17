import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions, TouchableOpacity, NativeModules, Image, AsyncStorage } from 'react-native';
import _ from 'underscore';

import { Icon, Header } from 'native-base';
import { COLOR } from '../../Constants/Design';
import Loader from '../../Components/Loader'
import NotificationService from '../../Database/NotificationService';


const HEADER_HEIGHT = 64;

class AppWiseNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationsList: [],
      appIcons: {},
      loading: false,
    }
    this.onPressApplication = this.onPressApplication.bind(this);
    this.iconCallback = this.iconCallback.bind(this);
  }
  componentDidMount() {
    let notificationsList = NotificationService.getAll();
    let applicationsList = _.uniq(notificationsList, (obj) => obj.packageName);
    applicationsList = _.sortBy(applicationsList, 'appName');
    let packageNameList = applicationsList.map(item => item.packageName);
    NativeModules.BatteryStatus.getIcon(JSON.stringify(packageNameList), this.iconCallback);
    this.setState({ applicationsList, loading: true });
    // console.log('applicationsList: ', applicationsList);
  }

  iconCallback(params) {
    console.log('params: ', params);
    if(params && params['icons']){
      let appIcons = JSON.parse(params['icons']);
      this.setState({ appIcons, loading: false });
    }else{
      this.setState({ loading: false });
    }
  }

  onPressApplication(packageName, appName) {
    const { navigate } = this.props.navigation;
    navigate('ALL', { name: appName, packageName })
  }
  render() {
    const { navigation } = this.props;
    const { appIcons, loading } = this.state;
    console.log('loading: ', loading);
    let headerTitle = navigation.getParam('name');
    return (
      <View style={styles.container}>
        <Header androidStatusBarColor={COLOR.PRIMARY} style={{display:'none'}}/>
        <Loader loading={loading} />
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
            {/* <Icon type="FontAwesome" name="calendar" style={{ fontSize: 24, color: 'white' }} /> */}
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }} style={styles.bodyView}>
          {this.state.applicationsList.map((item, i) => <AppBox key={`app-box-${i}`} onPress={this.onPressApplication} appName={item.appName} packageName={item.packageName} appIcon={appIcons[item.packageName]} />)}
        </ScrollView>
      </View>
    )
  }
}

const AppBox = (props) => {
  let { height, width } = Dimensions.get('window');
  const { appIcon } = props;
  if (appIcon) {

    console.log('appIcon: ', props.packageName);
    console.log('appIcon: ', appIcon);
  }
  return (
    <TouchableOpacity style={{ ...styles.appBox, width: width / 4, height: width / 4 }} onPress={() => props.onPress(props.packageName, props.appName)}>
      <Image style={{ ...styles.appIcon }} resizeMode={'contain'} source={{ uri: `data:image/png;base64,${appIcon}` || '' }}>
      </Image>
      <View style={{ ...styles.nameView }}><Text style={styles.appName}>{props.appName}</Text></View>
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
    elevation: 10,
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
    backgroundColor: COLOR.SECONDARY,
    marginTop: 64,
  },
  appBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 12,
    marginTop: 20,
    backgroundColor: '#37474f',
    // borderColor: 'white',
    // borderWidth: 2,
    borderRadius: 10,
    elevation: 5,
  },
  appIcon: {
    flex: 4,
    width: '40%',
    height: '40%',
    // backgroundColor: 'orange', 
  },
  nameView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: '#eeeeee',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    width: '100%'
  },

  appName: {
    color: '#37474f',
    fontSize: 13,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center'
  },

});

export default AppWiseNotification;