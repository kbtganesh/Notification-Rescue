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
    return (
      <View style={{...styles.emptyPageContainer, ...style}}>
        <Text style={styles.informationText}>Oh..! It's Empty</Text>
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
    color: COLOR.PRIMARY_TEXT
  }
});

export default EmptyPage;