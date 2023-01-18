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
  function changeDevice(command) {
    console.log('change1');
    AsyncStorage.getItem('device').then(device => {
      device = JSON.parse(device);
      if (device) {
        this.manager
          .writeCharacteristicWithResponseForDevice(
            device.id,
            device.serviceUUID,
            device.characteristicUUID,
            btoa(command),
          )
          .then(respone => {
            console.log('response', respone);
          })
          .catch(error => {
            console.log('error', error);
          });
      }
    });
  }
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
            onLongPress={() => changeDevice(u.command)}
            onPress={() =>
              gotoEdit(u.name, u.color.toString(), u.place, u.command, i)
            }>
            <Card
              containerStyle={{
                borderRadius: 8,
                width: Dimensions.get('window').width / 2 - 30,
                backgroundColor: u.color,
              }}>
              <Card.FeaturedTitle
                style={{
                  textShadowColor: 'black',
                  textShadowRadius: 4,
                  fontSize: 30,
                }}>
                {u.name}{' '}
              </Card.FeaturedTitle>
              <Card.FeaturedSubtitle
                style={{
                  textShadowColor: 'black',
                  textShadowRadius: 4,
                  textAlign: 'center',
                  fontSize: 25,
                }}>
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
          <Text
            style={{
              textShadowColor: 'black',
              textShadowRadius: 4,
              textAlign: 'center',
              fontSize: 50,
            }}>
            {'+'}
          </Text>
        </TouchableOpacity>
      </Card>
    </View>
  );
}
