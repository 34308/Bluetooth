import {Dimensions, View} from 'react-native';
import {useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import {Button} from '@rneui/base';
import {useNavigation} from '@react-navigation/native';
import {addToData} from './StorageHelper';
import {showMessage} from 'react-native-flash-message';
import * as React from 'react';
import SplashScreen from 'react-native-splash-screen';

export default function NewDevice() {
  const navigation = useNavigation();

  const [text, onChangeText] = useState('Useless Text');
  const [name, onChangeName] = useState(null);
  const [place, onChangePlace] = useState(null);
  const [command, onChangeCommand] = useState(null);
  const [color, setColor] = useState(null);
  async function Accept() {
    if (name !== null && place !== null && command !== null && color !== null) {
      await addToData(
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
  function onColorChange(color) {
    setColor({color});
  }
  return (
    <SafeAreaView style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      <TextInput
        style={styles.input}
        onChangeText={onChangeName}
        value={name}
        placeholder="Name"
        keyboardType="text"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangePlace}
        value={place}
        placeholder="Place"
        keyboardType="text"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeCommand}
        value={command}
        placeholder="Command"
        keyboardType="default"
      />
      <View>
        <ColorPicker
          initialColor="#ee0000"
          onColorChangeComplete={color => onColorChange(color)}
          onColorChange={color => onColorChange(color)}
          style={{marginBottom: 300, width: Dimensions.get('window').width}}
          thumbStyle={{height: 30, width: 30, borderRadius: 30}}
        />
      </View>
      <Button title="Accept" onPress={Accept} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  input: {
    backgroundColor: 'black',
    color: 'white',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
