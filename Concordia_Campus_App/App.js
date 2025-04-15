import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MapScreen from './maps/MapScreen';
import Calendar from './calendar/calendar';
import { PaperProvider } from 'react-native-paper';
import FullShuttleSchedule from './shuttle_bus/full_schedule'
import IndoorMapDirections from './maps/IndoorMapScreen.js';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <PaperProvider> 
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Map">
        <Drawer.Screen name="Map" component={MapScreen}/>
        <Drawer.Screen name="Calendar" component={Calendar} />
        <Drawer.Screen name="Shuttle Bus Schedule" component={FullShuttleSchedule} />
        <Drawer.Screen name="Indoor Directions Map" component={IndoorMapDirections}/>
      </Drawer.Navigator>
    </NavigationContainer>
    
    </PaperProvider>
  );
}
