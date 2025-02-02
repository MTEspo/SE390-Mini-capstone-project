import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

const GOOGLE_MAPS_API_KEY = 'keyForMaps'; // Hardcoded API Key
import MapScreen from './maps/MapScreen';
import Calendar from './calendar/calendar';
import FullShuttleSchedule from './shuttle_bus/full_schedule'
const Drawer = createDrawerNavigator();



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
