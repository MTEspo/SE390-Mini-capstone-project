import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity , Image} from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import { API_KEY } from '@env';
import styles from './styles/mapScreenStyles'; 


const TransitScreen = ({showDirections, campus, routeData, origin, destination}) => {
  const [mode, setMode] = useState('DRIVING');

  const campusLocations = {
    SGW: {
      latitude: 45.49532997441208, // Concordia University SGW campus
      longitude: -73.57859533082366,
      title: 'SGW Campus',
      description: 'A well-known university located in Montreal, Canada',
    },
    Loyola: {
      latitude: 45.458161998720556, // Concordia Loyola campus
      longitude: -73.63905090035233,
      title: 'Loyola Campus',
      description: 'Loyola Campus of Concordia University',
    },
  };

  // If there origin location is null set the location to the current campus
  const location =  (origin == null) ? campusLocations[campus]: origin;

  // If there destination location is null set the destinatio to the other campus
  const destinationLocation = (destination == null) ? ((campus === 'SGW') ? campusLocations.Loyola : campusLocations.SGW) : destination;

  const handleDirections = (result) => {
    routeData(result.duration, result.distance);
  };

  return (
    <>
    {showDirections && (
      <View style={styles.container}>
          {/* For driving mode (always blue) */}
          {mode === 'DRIVING' && (
            <MapViewDirections
              origin={location}
              destination={destinationLocation}
              apikey={API_KEY}
              strokeWidth={5}
              strokeColor="blue"  // Driving mode is always blue
              mode={mode}
              onReady={handleDirections}
            />
          )}

          {/* For walking mode (dashed blue line) */}
          {mode === 'WALKING' && (           
            <MapViewDirections
              origin={location}
              destination={destinationLocation}
              apikey={API_KEY}
              strokeWidth={5}
              strokeColor="blue"
              mode={mode}
              onReady={handleDirections}
              lineDashPattern={[2, 10]}  // Small dots (short lines with large gaps)
          />
        )}
          {/* Transit Mode */}
          {mode === 'TRANSIT' && (
            <MapViewDirections
              origin={location}
              destination={destinationLocation}
              apikey={API_KEY}
              strokeWidth={5}
              strokeColor="green"  // Change color for transit mode
              mode="TRANSIT"
              onReady={handleDirections}
            />
          )}

        <View style={styles.modeContainer}>
          <TouchableOpacity 
            testID="driving-button"
            onPress={() => setMode('DRIVING')} 
            style={[styles.modeButton, mode === 'DRIVING' && { backgroundColor: 'blue' }]}>
            <Image 
              source={require('../assets/Car_GPS.png')} 
              style={styles.modeImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            testID="walking-button"
            onPress={() => setMode('WALKING')} 
            style={[styles.modeButton, mode === 'WALKING' && { backgroundColor: 'blue' }]}>
            <Image 
              source={require('../assets/Walk_GPS.png')} 
              style={styles.modeImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity 
            testID="transit-button"
            onPress={() => setMode('TRANSIT')} 
            style={[styles.modeButton, mode === 'TRANSIT' && { backgroundColor: 'green' }]}>
           <Image 
             source={require('../assets/Bus_GPS.png')} 
              style={styles.modeImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
    </View>
    )}
    </>
  );
};
export default TransitScreen;