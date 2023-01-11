import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Card} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {getData} from './StorageHelper';
import SplashScreen from 'react-native-splash-screen';

export default function DeviceScreen() {
  const navigation = useNavigation();
  const [devices, setDevices] = useState([]);
  SplashScreen.hide();
  useEffect(() => {
    async function loadData() {
      getData('key1').then(result => {
        console.log('result' + JSON.stringify(result));
        if (result) {
          setDevices(result);
        }
      });
    }
    return navigation.addListener('focus', () => {
      loadData();
    });
  });
  return (
    <View
      style={{
        alignContent: 'flex-start',
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'column',
        maxWidth: Dimensions.get('window').width,
      }}>
      {devices.map((u, i) => {
        return (
          <Card
            containerStyle={{
              borderRadius: 8,
              width: Dimensions.get('window').width / 2 - 30,
              backgroundColor: u.color,
            }}
            key={i}>
            <Card.Title style={{fontSize: 30}}>{u.name} </Card.Title>
            <Card.FeaturedSubtitle style={{textAlign: 'center', fontSize: 25}}>
              {u.place}
            </Card.FeaturedSubtitle>
          </Card>
        );
      })}
      <Card
        containerStyle={{
          borderRadius: 8,
          width: Dimensions.get('window').width / 2 - 30,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('New Device');
          }}>
          <Text style={{textAlign: 'center', fontSize: 50}}>{'+'}</Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
}
