import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DeviceScreen from './Components/DeviceScreen';
import ConnectionScreen from './Components/ConnectionScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import NewDevice from './Components/NewDevice';
import FlashMessage from 'react-native-flash-message';

import {Icon} from '@rneui/themed';
import EditDevice from './Components/EditDevice';
function DeviceIcon() {
  return <Icon name="devices" size={30} color="#900" />;
}
function ConnectionIcon() {
  return <Icon name="bluetooth" size={30} color="#900" />;
}
const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

export default function App() {
  function TabNavigator() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          options={{
            tabBarIcon: DeviceIcon,
          }}
          name="Device"
          component={DeviceScreen}
        />
        <Tab.Screen
          options={{
            tabBarIcon: ConnectionIcon,
          }}
          name="Connection"
          component={ConnectionScreen}
        />
      </Tab.Navigator>
    );
  }
  function MainStack() {
    return (
      <NavigationContainer>
        <RootStack.Navigator initialRouteName={'Tab'}>
          <RootStack.Group>
            <RootStack.Screen
              options={{headerShown: false}}
              name="Tab"
              component={TabNavigator}
            />
          </RootStack.Group>
          <RootStack.Group screenOptions={{presentation: 'modal'}}>
            <RootStack.Screen name="New Device" component={NewDevice} />
            <RootStack.Screen name="Edit Device" component={EditDevice} />
          </RootStack.Group>
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <>
      <MainStack />
      <FlashMessage position="top" />
    </>
  );
}
