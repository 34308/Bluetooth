import {Dimensions, View} from 'react-native';
import {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import {Button} from '@rneui/base';
import {useNavigation} from '@react-navigation/native';
import {addToData, getData, removeData, replaceData} from './StorageHelper';
import {showMessage} from 'react-native-flash-message';
import * as React from 'react';

export default function EditDevice(props) {
  const navigation = useNavigation();

  const [text, onChangeText] = useState('Useless Text');
  const [name, onChangeName] = useState(null);
  const [place, onChangePlace] = useState(null);
  const [command, onChangeCommand] = useState(null);
  const [color, setColor] = useState(null);
  const [device, setDevice] = useState([]);
  async function deleteDevice() {
    await removeData(props.route.params.deviceIndex, 'key1');
    navigation.goBack();
  }
  async function Accept() {
    if (name !== null && place !== null && command !== null && color !== null) {
      await replaceData(
        '{ "name":' +
          '"' +
          name +
          '"' +
          ', "place":' +
          '"' +
          place +
          '"' +
          ',"command":' +
          '"' +
          command +
          '"' +
          ',"color":' +
          '"' +
          color.color +
          '"' +
          ' }',
        'key1',
        props.route.params.deviceIndex,
      );
      navigation.navigate('Tab');
    } else if (
      name == null ||
      place == null ||
      command == null ||
      color == null
    ) {
      console.log('check1b');
      showMessage({
        message: 'You need to supplement all information',
        type: 'info',
      });
    }
  }
  useEffect(() => {
    setColor(props.route.params.deviceColor);
    onChangeCommand(props.route.params.deviceCommand);
    onChangeName(props.route.params.deviceName);
    onChangePlace(props.route.params.devicePlace);
  }, [
    props.route.params.deviceColor,
    props.route.params.deviceCommand,
    props.route.params.deviceName,
    props.route.params.devicePlace,
  ]);
  function onColorChange(color) {
    setColor({color});
  }
  return (
    <SafeAreaView style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      <View>
        <TextInput
          style={styles.input}
          onChangeText={onChangeName}
          value={props.route.params.deviceName}
          placeholder="Name"
          keyboardType="text"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangePlace}
          value={props.route.params.devicePlace}
          placeholder="Place"
          keyboardType="text"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeCommand}
          value={props.route.params.deviceCommand}
          placeholder="Command"
          keyboardType="default"
        />
        <View>
          <ColorPicker
            color={props.route.params.deviceColor.toString()}
            initialColor={props.route.params.deviceColor.toString()}
            onColorChangeComplete={color => onColorChange(color)}
            onColorChange={color => onColorChange(color)}
            style={{
              marginBottom: 300,
              width: Dimensions.get('window').width,
            }}
            thumbStyle={{height: 30, width: 30, borderRadius: 30}}
          />
        </View>
      </View>
      <Button title="Accept" onPress={Accept} />
      <Button title="Delete this Device" onPress={deleteDevice} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
