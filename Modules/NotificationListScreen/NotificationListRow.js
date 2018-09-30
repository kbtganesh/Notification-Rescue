import React, { Component } from 'react';
import {StyleSheet, Text, View, Animated} from 'react-native';
import { COLOR } from '../../Constants/Design';
import moment from 'moment';

class NotificationListRow extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      // fadeAnim: new Animated.Value(0),
     }
  }
  componentDidMount() {
    console.log("&&&&&&&&&&&&&&&&&& NEW ITEM ADDED : ", this.props.item.text);
    // Animated.timing(                  // Animate over time
    //   this.state.fadeAnim,            // The animated value to drive
    //   {
    //     toValue: 1,                   // Animate to opacity: 1 (opaque)
    //     duration: 1000,              // Make it take a while
    //   }
    // ).start();
  }
  render() { 
    const { item } = this.props;
    const { fadeAnim } = this.state;
    console.log('("&&&&&&&&&&&&&&&&&& fadeAnim: ', item.text);
    return ( <View style={{...styles.listView}}>
      <Text style={styles.appName}>{item.appName}</Text>
      <View style={styles.titleLine}>
        <Text style={styles.textTitle}>{item.title}</Text>
        <Text style={styles.textDate}>{moment(item.createdAt).format('LT')}</Text>
      </View>
      <Text style={styles.textContent}>{item.text}</Text>
    </View> );
  }
}

const styles = StyleSheet.create({
  listView: {
    position: 'relative',
    margin: 15,
    marginTop: 20,
    marginBottom: 0,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLOR.SECONDARY_LIGHT,
  },
  appName: {
    position: 'absolute',
    color: COLOR.SECONDARY_LIGHT,
    top: -10,
    left: 5,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: '#263238',
  },
  titleLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingBottom: 5,
  },
  textDate: {
    color: 'lightgray',
    // fontStyle: 'italic',
    fontSize: 12,
  },
  textTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  textContent: {
    color: 'white',
    // fontWeight: bold,
  },
});
 
export default NotificationListRow;