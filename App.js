import React from 'react';
import  LinearGradient  from 'react-native-linear-gradient';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { Font } from 'expo'
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      position: null,
      addressInfo: null
    }
  }
  componentWillMount(){
    const _this = this
    console.log(1)
    async function request() {
      try{
        await _this.getPosition().then(position => {
          _this.setState({
            position: position.coords
          })
        })
        const lat = _this.state.position.latitude
        const lon = _this.state.position.longitude
        const positionUrl = `https://h5.ele.me/restapi/bgs/poi/reverse_geo_coding?latitude=${lat}&longitude=${lon}`
        let [response] = await Promise.all([_this.requestAjax(positionUrl, 'get')])
        return {
          response
        }
      }
      catch(err){
        console.log(err)
      }
    }
    request().then(data => {
        const { response } = data
        this.setState({
          addressInfo: response
        })
    })
  }
  requestAjax (url, method) {
    return fetch(url, { method }).then(data => data.json())
  }
  getPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(function (position) {
        resolve(position)
      })
    })
  }
  render() {
    let addressInfo = this.state.addressInfo
    if(addressInfo) {
      return (
        <ScrollView>
          <LinearGradient colors={['90deg', '#0af', '#0085ff']} style={styles.header}>
            <Text>
              {addressInfo.name}
            </Text>
          </LinearGradient>  
        </ScrollView>
      );
    }
    return (
      <View></View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#0af',
    height: 50,
    paddingTop: 10
  }
});
