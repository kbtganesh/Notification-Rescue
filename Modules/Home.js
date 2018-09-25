import React, {Component} from 'react';
import {Platform, StyleSheet, Text, Image, View, ScrollView} from 'react-native';
import {PRIMARY_COLOR, PRIMARY_TEXT_COLOR} from '../Constants/Design';
const BOX_TITLE = {'All': 'All Notifications', 'App': 'App wise Notifications', 'Whatsapp': 'Whatsapp Messages', 'Other': 'Other'}
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
            <Box type='All'/>
            <Box type='App'/>
            <Box type='Whatsapp'/>
            <Box type='Other'/>
          </ScrollView>
          </View>
          
      </View>
    );
  }
}

const Box = (props) => {
  return(
    <View style={{...styles.box, marginBottom:props.type === 'Other'?50:30}}>
    <View style={styles.boxTop}><Text>{BOX_TITLE[props.type]}</Text></View>
    <View style={styles.boxBottom}>

    </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',

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
    backgroundColor: PRIMARY_COLOR,
  },
  headerText: {
    fontSize: 18,
    color: PRIMARY_TEXT_COLOR,
  },
  bodyView: {
    flex: 10,
    flexDirection: 'column',
    backgroundColor: '#e3f2fd',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  box: {
    width: '100%',
    height: 200,
    marginBottom: 30,
    borderRadius: 20,
    backgroundColor: 'white'
  },
  boxTop: {
    backgroundColor: 'lightblue',
    height: '40%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    
  }
});

export default Home;