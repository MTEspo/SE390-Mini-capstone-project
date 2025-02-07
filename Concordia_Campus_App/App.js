import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MapScreen from './maps/MapScreen';

import { StatusBar } from 'expo-status-bar';


import Calendar from './calendar/calendar';
import FullShuttleSchedule from './shuttle_bus/full_schedule'
const Drawer = createDrawerNavigator();


export function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

// Add more navigation menus
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Map">
        <Drawer.Screen name="Map" component={MapScreen} />
        <Drawer.Screen name="Calendar" component={Calendar}/>
        <Drawer.Screen name="Shuttle Bus Schedule" component={FullShuttleSchedule}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
