import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Songanize from '../screens/Songanize/Songanize';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import ProfileSettings from '../screens/ProfileScreen/ProfileSettings';
import Setlist from '../screens/Setlist/Setlist';
import GroupScreen from '../screens/GroupScreen/GroupScreen';
import LoginScreen from '../screens/LoginScreens/LoginScreens';
import LoadingScreen from '../screens/Welcome/LoadingScreen';
import WelcomeScreen from '../screens/Welcome/WelcomeScreen';
import SongList from '../screens/SongList/SongList';
import AddSetlistScreen from '../screens/AddSetlist/AddSetlistScreen';

import DrawerNavigationRoutes from '../navigations/DrawerNavigatorRoutes';
import ChangePassword from '../screens/ProfileScreen/ChangePassword';
import Registration from '../screens/Registration/Registration';
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword';
import ResetPasswordScreen from '../screens/ResetPasswordScreen/ResetPasswordScreen';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();
const Appnavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DrawerNavigationRoutes"
          component={DrawerNavigationRoutes}
          // Hiding header for Navigation Drawer
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Songanize"
          component={Songanize}
          options={{headerShown: false}}
        />

        <Stack.Screen
          options={{headerShown: false}}
          name="ProfileScreen"
          component={ProfileScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ProfileSettings"
          component={ProfileSettings}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Setlist"
          component={Setlist}
        />
        <Stack.Screen
          name="GroupScreen"
          component={GroupScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="SongList"
          component={SongList}
        />
        <Stack.Screen
          name="AddSetlistScreen"
          component={AddSetlistScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ChangePassword"
          component={ChangePassword}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="LoadingScreen"
          component={LoadingScreen}
          options={{Animation: 'slide_from_bottom', headerShown: false}}
        />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen
          name="Registration"
          component={Registration}
          options={{Animation: 'slide_from_bottom', headerShown: false}}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{Animation: 'slide_from_bottom', headerShown: false}}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{Animation: 'slide_from_bottom', headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Appnavigator;
