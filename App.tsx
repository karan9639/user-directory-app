import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserListScreen from './UserListScreen';
import UserDetailsScreen from './UserDetailsScreen';

export type RootStackParamList = {
  UserList: undefined;
  UserDetails: { userId: number };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserList">
        <Stack.Screen name="UserList" component={UserListScreen} />
        <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
