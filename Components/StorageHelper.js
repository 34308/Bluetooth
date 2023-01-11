import AsyncStorage from '@react-native-community/async-storage';
//Device#1
export const getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      console.log('test:' + JSON.parse(value)[0].name);
      return value != null ? JSON.parse(value) : null;
    }
  } catch (e) {
    return null;
  }
};
export const storeData = async (value, key) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};
export const addToData = async (value, key) => {
  try {
    let data = await getData(key);
    if (data == null || data == undefined) {
      data = [];
    }
    data.push(JSON.parse(value));
    const newData = JSON.stringify(data);
    await AsyncStorage.setItem(key, newData);
  } catch (e) {
    // saving error
  }
};
