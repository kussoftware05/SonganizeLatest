import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Setlist from './../screens/Setlist/Setlist';
import AddSetlistScreen from '../screens/AddSetlist/AddSetlistScreen';
import SongList from '../screens/SongList/SongList';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import ProfileSettings from '../screens/ProfileScreen/ProfileSettings';
import ChangePassword from '../screens/ProfileScreen/ChangePassword';

export const SetlistNavigation = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Setlist"
        component={Setlist}
        options={{Animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="AddSetlistScreen"
        component={AddSetlistScreen}
        options={{Animation: 'slide_from_bottom', headerShown: true, title: 'Add a New SetList'}}
      />
      <Stack.Screen
        name="SongList"
        component={SongList}
        options={{Animation: 'slide_from_bottom', headerShown: true, title: 'Song Lists'}}
      />
    </Stack.Navigator>
  );
};
export const ProfileNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ Animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="ProfileSettings"
        component={ProfileSettings}
        options={{ Animation: 'slide_from_bottom', headerShown: true, title: 'Profile Settings' }}
      />
        <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ Animation: 'slide_from_bottom', headerShown: true, title: 'Change Password' }}
      />
    </Stack.Navigator>
  )
}
