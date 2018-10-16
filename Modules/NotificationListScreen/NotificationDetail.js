import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions, TouchableOpacity, NativeModules, Image, AsyncStorage } from 'react-native';
import moment from 'moment';
import { Icon } from 'native-base';
import { COLOR } from '../../Constants/Design';

const HEADER_HEIGHT = 64;

class NotificationDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { 

     }
  }
  render() { 
    const { navigation } = this.props;
    let headerTitle = navigation.getParam('name');
    let notificationObject = navigation.getParam('notificationObject');
    console.log('notificationObject: ', notificationObject);

    return ( <View style={styles.container}>
        <View style={styles.headerView}>
          <TouchableOpacity title="OPEN"
            onPress={() =>
              this.props.navigation.goBack()
            }>
            <Text style={{ color: 'white' }}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>{headerTitle}</Text>
          <TouchableOpacity style={styles.infoClose} title="OPEN"
            onPress={() => {
              this.hideInfo();
            }}>
            <Icon type="EvilIcons" name="close-o" style={{ fontSize: 24, color: COLOR.PRIMARY }} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'}} style={styles.bodyView}>
          {!!notificationObject.title && <Row title='Title' value={notificationObject.title}/>}
          {!!notificationObject.ticker && <Row title='Ticker' value={notificationObject.ticker}/>}
          {!!notificationObject.subText && <Row title='Sub Text' value={notificationObject.subText}/>}
          {!!notificationObject.text && <Row title='Text' value={notificationObject.text}/>}
          {!!notificationObject.bigText && <Row title='Big Text' value={notificationObject.bigText}/>}
          {!!notificationObject.summeryText && <Row title='Summery Text' value={notificationObject.summeryText}/>}
          {!!notificationObject.createdAt && <Row title='Date' value={moment(notificationObject.createdAt).format('LLLL')}/>}
          {notificationObject.textLines.length > 0 && <Row title='Text Lines' value={notificationObject.textLines}/>}
        </ScrollView>
      </View> );
  }
}

const Row = (props) => {

  let valueUI = typeof props.value === 'string' ? <Text selectable style={styles.rowValue}>{props.value}</Text> : <View style={styles.rowValue}>{props.value.map(item => <Text selectable>{item}</Text>)}</View>;
  return(
    <View style={styles.rowView}>
      <Text selectable style={styles.rowTitle}>{props.title} : </Text>
      {valueUI}
    </View>
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
    // paddingLeft: 10,
    fontSize: 18,
    color: 'white',
  },
  bodyView: {
    display: 'flex',
    backgroundColor: COLOR.SECONDARY,
    marginTop: 64,
  },
  rowView: {
    display: 'flex',
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.SECONDARY_DARK,
    width: '100%',
  },
  rowTitle: {
    flex: 3,
    fontWeight: 'bold',
  },
  rowValue: {
    flex: 9,
  },
});
 
export default NotificationDetail;