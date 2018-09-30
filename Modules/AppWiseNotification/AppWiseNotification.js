import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, FlatList, TouchableOpacity, Animated, DeviceEventEmitter, AsyncStorage } from 'react-native';
import _ from 'underscore';

import { Icon } from 'native-base';
import { COLOR } from '../../Constants/Design';
import NotificationService from '../../Database/NotificationService';


const HEADER_HEIGHT = 64;

class AppWiseNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationsList: [],
    }
    this.onPressApplication = this.onPressApplication.bind(this);
  }
  componentDidMount() {
    let notificationsList = NotificationService.getAll();
    let applicationsList = _.uniq(notificationsList, (obj) => obj.packageName);
    this.setState({ applicationsList });
    console.log('applicationsList: ', applicationsList);
  }

  onPressApplication(packageName, appName) {
    const { navigate } = this.props.navigation;
    navigate('ALL', { name: appName, packageName })
  }
  render() {
    const { navigation } = this.props;
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
            <Icon type="FontAwesome" name="calendar" style={{ fontSize: 24, color: 'white' }} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{justifyContent: 'flex-start'}} style={styles.bodyView}>
          {this.state.applicationsList.map((item, i) => <AppBox key={`app-box-${i}`} onPress={this.onPressApplication} appName={item.appName} packageName={item.packageName}/>)}
        </ScrollView>
      </View>
    )
  }
}

const AppBox = (props) => {
  return (
    <TouchableOpacity style={styles.appBox} onPress={()=>props.onPress(props.packageName, props.appName)}>
      <Text>{props.appName}</Text>
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

export default AppWiseNotification;