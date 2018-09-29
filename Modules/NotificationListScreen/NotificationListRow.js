import React, { Component } from 'react';
import {StyleSheet, Text, View, Animated} from 'react-native';

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
      <Text>{item.appName}</Text>
      <Text>{item.createdAt.toLocaleTimeString()}</Text>
      <Text>{item.title}</Text>
      <Text>{item.text}</Text>
    </View> );
  }
}

const styles = StyleSheet.create({
  listView: {
    margin: 10,
    marginBottom: 0,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
  }
});
 
export default NotificationListRow;