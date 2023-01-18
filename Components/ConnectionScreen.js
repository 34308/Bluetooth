import {Text, View} from 'react-native';
import * as React from 'react';
import {BleManager} from 'react-native-ble-plx';
import AsyncStorage from '@react-native-community/async-storage';
import {Component} from 'react';
import {Button} from '@rneui/base';
import {encode as btoa} from 'base-64';
import {storeData} from './StorageHelper';

// const device = {
//   id: 'A8:1B:6A:75:96:65',
//   serviceUUID: 'FFE0',
//   characteristicUUID: 'FFE1',
// };
export default class ConnectionScreen extends Component {
  constructor(props) {
    super(props);
    this.manager = new BleManager();
    this.setState({
      device: [],
    });
  }

  checkBluetoothState() {
    console.log('check1');
    const subs = this.manager.onStateChange(state => {
      this.scanAndConnect();
      subs.remove();
    }, true);
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button onPress={() => this.checkBluetoothState()}>Start Search</Button>
        <Button onPress={() => this.checkBluetoothState()}>
          Find MLT-BTO5
        </Button>
        <Button onPress={() => this.checkBluetoothState()}>
          Connect to MLT-BTO5
        </Button>
      </View>
    );
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
      id: '',
      service: '',
      characteristicUUID: '',
    };
    device.id = this.state.device.id;
    device.service = this.state.device.id;
    device.characteristicUUID = this.state.device.characteristicUUID;
    storeData('device', JSON.stringify(device)).then(
      this.props.navigation.navigate('Device'),
    );
  }
}
