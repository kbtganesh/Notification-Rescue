import React, {Component} from 'react';
import {Platform, StyleSheet, Text, Image, View, ScrollView} from 'react-native';
import { COLOR } from '../Constants/Design';
const BOX_TITLE = {'ALL': 'All Notifications', 'APP': 'App wise Notifications', 'WHATSAPP': 'Whatsapp Messages', 'OTHER': 'Other'}
const BOX_DESC = {
    'ALL': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', 
    'APP': 'Nulla lectus mauris, volutpat at congue eget, finibus eu', 
    'WHATSAPP': 'Sed faucibus porttitor ipsum pellentesque et congue erat', 
    'OTHER': 'Cras quis felis vel metus lobortis porta a ut ligula'}
class Home extends Component {
  static navigationOptions = {
    title: 'Navigation Rescue',
  };
  constructor(props) {
    super(props);
   
    this.state = {
      storedList: []
    };

   }

   componentDidMount() {
    
   }

  render() {
    return (
      <View style={styles.container}>      
          <View style={styles.headerView}><Text style={styles.headerText}>Notification Rescue</Text></View>
          <View style={styles.bodyView}>
          <ScrollView contentContainerStyle={{display: 'flex', justifyContent: 'space-around'}} style={{width: '100%', padding: 30}}>
            <Box type='ALL'/>
            <Box type='APP'/>
            <Box type='WHATSAPP'/>
            <Box type='OTHER'/>
          </ScrollView>
          </View>
          
      </View>
    );
  }
}

const Box = (props) => {
  let BottomColor = props.type+'_DARK';
  return(
    <View style={{...styles.box, marginBottom:props.type === 'OTHER'?50:30}}>
    <View style={{...styles.boxTop, backgroundColor: COLOR[props.type]}}>
      <Text style={styles.boxTopTitle}>{BOX_TITLE[props.type]}</Text>
      <Text style={styles.boxTopDesc}>{BOX_DESC[props.type]}</Text>
    </View>
    <View style={{...styles.boxBottom, backgroundColor: COLOR[BottomColor]}}>
      <Text style={styles.boxBottomText}> OPEN </Text>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  headerView: {
    display: 'flex',
    flex: 3,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLOR.PRIMARY,
  },
  headerText: {
    fontSize: 18,
    color: COLOR.PRIMARY_TEXT,
  },
  bodyView: {
    flex: 10,
    flexDirection: 'column',
    backgroundColor: COLOR.PRIMARY_LIGHT,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  box: {
    width: '100%',
    height: 150,
    marginBottom: 30,
    borderRadius: 20,
    backgroundColor: 'white'
  },
  boxTop: {
    justifyContent: 'space-around',
    padding: 15,
    height: '65%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  boxTopTitle: {
    fontSize: 20,
    fontFamily: 'sans-serif-light',
    color: 'white',
  },
  boxTopDesc: {
    fontSize: 14,
    fontFamily: 'sans-serif-light',
    color: '#c5cae9',
  },

  boxBottom: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '35%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  boxBottomText: {
    fontSize: 16,
    fontFamily: 'sans-serif-medium',
    color: 'white',
  }
});

export default Home;