import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {View, Image} from 'react-native';
import NavigationDrawerHeader from '../components/NavigationDrawerHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomSidebarMenu from '../components/CustomSidebarMenu';
import Setlist from '../screens/Setlist/Setlist';
import Songanize from '../screens/Songanize/Songanize';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import ProfileSettings from '../screens/ProfileScreen/ProfileSettings';
import GroupScreen from '../screens/GroupScreen/GroupScreen';
import Help from '../screens/Help/Help';

import {COLORS} from '../constant/Colors';
import AddSetlistScreen from '../screens/AddSetlist/AddSetlistScreen';
import SongList from '../screens/SongList/SongList';
import ChangePassword from '../screens/ProfileScreen/ChangePassword';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const songanizeStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="Songanize">
      <Stack.Screen
        name="Songanize"
        component={Songanize}
        options={{
          title: '', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerRight: () => (
            <View>
              <Image
                style={{width: 35, height: 35, padding: 10, flex: 1}}
                source={require('../images/songanize_logo.png')}
              />
            </View>
          ),
          headerStyle: {
            backgroundColor: COLORS.headerBackground, //COLORS.black, //Set Header color
          },
          headerTintColor: '#000', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
     
    </Stack.Navigator>
  );
};
const setlistStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="Setlist">
      <Stack.Screen
        name="Setlist"
        component={Setlist}
        options={{
          title: '', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerRight: () => (
            <View>
              <Image
                style={{width: 35, height: 35, padding: 10, flex: 1}}
                source={require('../images/songanize_logo.png')}
              />
            </View>
          ),
          headerStyle: {
            backgroundColor: COLORS.headerBackground, //Set Header color
          },
          headerTintColor: '#000', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
      <Stack.Screen
        name={'AddSetlistScreen'}
        component={AddSetlistScreen}
        options={{
          title: 'SetlistScreen', //Set Header Title
        }}
      />
      <Stack.Screen
        name={'SongList'}
        component={SongList}
        options={{
          title: 'SongList', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};
const profileStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerRight: () => (
            <View>
              <Image
                style={{width: 35, height: 35, padding: 10, flex: 1}}
                source={require('../images/songanize_logo.png')}
              />
            </View>
          ),
          headerStyle: {
            backgroundColor: COLORS.headerBackground, //Set Header color
          },
          headerTintColor: '#000', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
      <Stack.Screen
        name={'ProfileSettings'}
        component={ProfileSettings}
        options={{
          title: 'Settings', //Set Header Title
        }}
      />
      <Stack.Screen
        name={'ChangePassword'}
        component={ChangePassword}
        options={{
          title: 'ChangePassword', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};
const groupStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="Group">
      <Stack.Screen
        name="Group"
        component={GroupScreen}
        options={{
          title: '', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerRight: () => (
            <View>
              <Image
                style={{width: 35, height: 35, padding: 10, flex: 1}}
                source={require('../images/songanize_logo.png')}
              />
            </View>
          ),
          headerStyle: {
            backgroundColor: COLORS.headerBackground,
          },
          headerTintColor: '#000', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};
const helpStack = ({navigation}) => {
  return (
    <Stack.Navigator initialRouteName="Help">
      <Stack.Screen
        name="Help"
        component={Help}
        options={{
          title: '', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerRight: () => (
            <View>
              <Image
                style={{width: 35, height: 35, padding: 10, flex: 1}}
                source={require('../images/songanize_logo.png')}
                // source={{ uri: "https://facebook.github.io/react/img/logo_og.png" }}
              />
            </View>
          ),
          headerStyle: {
            backgroundColor: COLORS.headerBackground, //COLORS.black, //Set Header color
          },
          headerTintColor: '#000', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
      <Stack.Screen
        name={'ProfileSettings'}
        component={ProfileSettings}
        options={{
          title: 'settings', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};
const DrawerNavigatorRoutes = props => {
  return (
    <Drawer.Navigator
      screenOptions={{
        color: COLORS.blue,
        itemStyle: {marginVertical: 5, color: 'white'},
        labelStyle: {
          color: COLORS.white,
        },
        headerShown: false,
        drawerActiveBackgroundColor: COLORS.headerBackground,
        drawerActiveTintColor: 'white',
        drawerInactiveTintColor: COLORS.headerMenuInactive,
      }}
      drawerContent={props => <CustomSidebarMenu {...props} />}>
      <Drawer.Screen
        name="songanizeStack"
        options={{
          drawerLabel: 'Songs',
          drawerIcon: ({focused, size}) => (
            <FontAwesome
              name="info-circle"
              size={size}
              color={focused ? COLORS.white : COLORS.headerMenuInactive}
            />
          ),
        }}
        component={songanizeStack}
      />
      <Drawer.Screen
        name="setlistStack"
        options={{
          drawerLabel: 'Setlist',
          drawerIcon: ({focused, size}) => (
            <FontAwesome
              name="plus-square"
              size={size}
              color={focused ? '#fff' : '#67CDFF'}
            />
          ),
        }}
        component={setlistStack}
      />
      <Drawer.Screen
        name="profileStack"
        options={{
          drawerLabel: 'Profile',
          drawerIcon: ({focused, size}) => (
            <FontAwesome
              name="plus-square"
              size={size}
              color={focused ? '#fff' : '#67CDFF'}
            />
          ),
        }}
        component={profileStack}
      />
      <Drawer.Screen
        name="groupStack"
        options={{
          drawerLabel: 'Groups',
          drawerIcon: ({focused, size}) => (
            <FontAwesome
              name="plus-square"
              size={size}
              color={focused ? '#fff' : '#67CDFF'}
            />
          ),
        }}
        component={groupStack}
      />
      <Drawer.Screen
        name="helpStack"
        options={{
          drawerLabel: 'Help',
          drawerIcon: ({focused, size}) => (
            <FontAwesome
              name="plus-square"
              size={size}
              color={focused ? '#fff' : '#67CDFF'}
            />
          ),
        }}
        component={helpStack}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;
