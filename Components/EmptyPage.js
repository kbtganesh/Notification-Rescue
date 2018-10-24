import React, { Component } from 'react';
import { COLOR } from '../Constants/Design';
import { StyleSheet, View, Text } from 'react-native';

class EmptyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    const style = this.props.style || {}
    const textStyle = this.props.textStyle || {}
    return (
      <View style={{...styles.emptyPageContainer, ...style}}>
        <Text style={{...styles.informationText, ...textStyle}}>We haven't received any notifications yet.</Text>
        <Text style={{...styles.subText}}>Please contact us if you find any problem in receiving notifications.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  emptyPageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  informationText: {
    fontSize: 18,
    color: COLOR.PRIMARY_TEXT
  },
  subText: {
    fontSize: 12,
    color: COLOR.LIGHT_GRAY,
  }
});

export default EmptyPage;