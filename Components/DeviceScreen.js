import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Card} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {getData} from './StorageHelper';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
import {encode as btoa} from 'base-64';

export default function DeviceScreen() {
  function gotoEdit(name, color, place, command, i) {
    navigation.navigate('Edit Device', {
      deviceName: name,
      deviceColor: color,
      devicePlace: place,
      deviceCommand: command,
      deviceIndex: i,
    });
  }
  const navigation = useNavigation();
  const [devices, setDevices] = useState([]);
  SplashScreen.hide();
  useEffect(() => {
    async function loadData() {
      getData('key1').then(result => {
        if (result) {
          setDevices(result);
        } else {
          setDevices([]);
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
          <TouchableOpacity
            key={i}
            onPress={() =>
              gotoEdit(u.name, u.color.toString(), u.place, u.command, i)
            }>
            <Card
              containerStyle={{
                borderRadius: 8,
                width: Dimensions.get('window').width / 2 - 30,
                backgroundColor: u.color,
              }}>
              <Card.FeaturedTitle style={{fontSize: 30}}>
                {u.name}{' '}
              </Card.FeaturedTitle>
              <Card.FeaturedSubtitle
                style={{textAlign: 'center', fontSize: 25}}>
                {u.place}
              </Card.FeaturedSubtitle>
            </Card>
          </TouchableOpacity>
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
