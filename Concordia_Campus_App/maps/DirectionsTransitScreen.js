import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import { API_KEY } from '@env';
import styles from './styles/mapScreenStyles'; 


const DirectionsTransitScreen = ({location ,destinationLocation}) => {
  const [mode, setMode] = useState('DRIVING');


  return (
    <View style={styles.container}>
      {showDirections && (
        <>
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
        </>
      )}
      {showDirections && (
        <View style={styles.modeContainer}>
          <TouchableOpacity 
            testID="driving-button"
            onPress={() => setMode('DRIVING')} 
            style={[styles.modeButton, mode === 'DRIVING' && { backgroundColor: 'blue' }]}>
            <Text style={styles.modeText}>Driving</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="walking-button"
            onPress={() => setMode('WALKING')} 
            style={[styles.modeButton, mode === 'WALKING' && { backgroundColor: 'blue' }]}>
            <Text style={styles.modeText}>Walking</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            testID="transit-button"
            onPress={() => setMode('TRANSIT')} 
            style={[styles.modeButton, mode === 'TRANSIT' && { backgroundColor: 'green' }]}>
            <Text style={styles.modeText}>Transit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
export default DirectionsTransitScreen;