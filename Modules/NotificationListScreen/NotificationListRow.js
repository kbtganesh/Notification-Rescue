import React, { Component } from 'react';
import {StyleSheet, Text, View, Animated, TouchableHighlight} from 'react-native';
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
    return ( <TouchableHighlight style={{...styles.listView}} onPress={this.props.onPress}>
    <React.Fragment>
      <Text style={styles.appName}>{item.appName}</Text>
      <View style={styles.titleLine}>
        <Text style={styles.textTitle}>{item.title}</Text>
        <Text style={styles.textDate}>{moment(item.createdAt).format('LT')}</Text>
      </View>
      <Text style={styles.textContent}>{item.text}</Text>
      </React.Fragment>
    </TouchableHighlight> );
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
    fontWeight: '500',
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
    color: COLOR.PRIMARY_TEXT,
    fontWeight: '500',
    width: '80%',
    lineHeight: 20,
    marginBottom: 8,
    // backgroundColor: 'red',
  },
  textContent: {
    color: 'white',
    marginBottom: 5,
  },
});
 
export default NotificationListRow;