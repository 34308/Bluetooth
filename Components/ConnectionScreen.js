import {Text, View} from 'react-native';
import * as React from 'react';
import {BleManager} from 'react-native-ble-plx';
import AsyncStorage from '@react-native-community/async-storage';
import {Component} from 'react';
import {Button} from '@rneui/base';
import {encode as btoa} from 'base-64';
import {storeData} from './StorageHelper';
import {CardTitle} from '@rneui/base/dist/Card/Card.Title';
import {Card} from '@rneui/themed';
import {CardFeaturedTitle} from '@rneui/base/dist/Card/Card.FeaturedTitle';
import {CardFeaturedSubtitle} from '@rneui/base/dist/Card/Card.FeaturedSubtitle';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);
// const device = {
//   id: 'A8:1B:6A:75:96:65',
//   serviceUUID: 'FFE0',
//   characteristicUUID: 'FFE1',
// };
export default class ConnectionScreen extends Component {
  constructor(props) {
    super(props);
    this.manager = new BleManager();
    this.state = {
      device: [],
      devices: [
        {
          id: 'A8:1B:6A:75:96:65',
          serviceUUID: 'FFE0',
          characteristicUUID: 'FFE1',
        },
      ],
    };
  }

  checkBluetoothState() {
    console.log('check1');
    const subs = this.manager.onStateChange(state => {
      this.scanAndConnect();
      subs.remove();
    }, true);
  }

  changeDevice(command) {
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
  scanAndConnect() {
    console.log('check2');
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('error', error);
        return;
      }
      console.log('DEVICE', device);
      //zakomentowac poźniej

      if (device.name === 'MLT-BTO5') {
        this.manager.stopDeviceScan();
      }
      if (device.name === 'HD 450BT') {
        this.manager.stopDeviceScan();
      }
      return device
        .connect()
        .then(device => {
          return device.discoverAllServicesAndCharacteristics();
        })
        .then(characteristics => {
          this.setState({device: characteristics});
          this.saveDevice();
        })
        .catch(error => {
          console.log('error', error);
        });
    });
  }

  saveDevice() {
    const device = {
      id: 'A8:1B:6A:75:96:65',
      serviceUUID: 'FFE0',
      characteristicUUID: 'FFE1',
    };
    // device.id = this.state.device.id;
    // device.service = this.state.device.id;
    // device.characteristicUUID = this.state.device.characteristicUUID;
    storeData('device', JSON.stringify(device)).then(
      this.props.navigation.navigate('Device'),
    );
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {this.state.devices.map((u, i) => {
          return (
            <Card key={i}>
              <CardFeaturedTitle
                style={{
                  textShadowColor: 'black',
                  textShadowRadius: 4,
                  fontSize: 12,
                }}>
                {u.id}
              </CardFeaturedTitle>
              <CardFeaturedSubtitle
                style={{
                  textShadowColor: 'black',
                  textShadowRadius: 4,
                  fontSize: 12,
                }}>
                {u.serviceUUID}
              </CardFeaturedSubtitle>
              <CardFeaturedSubtitle
                style={{
                  textShadowColor: 'black',
                  textShadowRadius: 4,
                  fontSize: 12,
                }}>
                {u.characteristicUUID}
              </CardFeaturedSubtitle>
            </Card>
          );
        })}
        <Button onPress={() => this.checkBluetoothState()}>Start Search</Button>
        <Button onPress={() => this.changeDevice('green')}>GREEN</Button>
        <Button onPress={() => this.changeDevice('blue')}>BLUE</Button>
        <Button onPress={() => this.changeDevice('red')}>RED</Button>
        <Button onPress={() => this.changeDevice('off')}>OFF</Button>
      </View>
    );
  }
}
