import { duration } from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { API_KEY } from '@env';


const TransitScreen = () => {
  // Coordinates for both campuses
  const [campus, setCampus] = useState('SGW'); // State to track the selected campus right now
  const [showDirections, setShowDirections] = useState(false);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);
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

  // Current campus location
  const location = campusLocations[campus];
  const destinationLocation = campus === 'SGW' ? campusLocations.Loyola : campusLocations.SGW;
  const directionsText = campus === 'SGW' ? '   Directions to LOY' : '   Directions to SGW';

  const handleDirections = (result) => {
    setEta(result.duration);
    setDistance(result.distance);
  };

  const handleCampusToggle = () => {
    setShowDirections(false);
    setEta(null);
    setDistance(null);
    setCampus(campus === 'SGW' ? 'Loyola' : 'SGW');
  };

  useEffect(() => {
    return () => {
      setShowDirections(false);
      setEta(null);
      setDistance(null);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* TOGGLE BUTTON FOR CAMPUSES */}
      <View style={styles.toggleButtonContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={handleCampusToggle} // Switch between campus locations
        >
          <Text style={styles.toggleButtonText}>
            <Text style={campus === 'SGW' ? styles.highlightedText : styles.normalText}>SGW</Text>
            {' | '}
            <Text style={campus === 'Loyola' ? styles.highlightedText : styles.normalText}>LOY</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map view */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude, 
          longitude: location.longitude, 
          latitudeDelta: 0.005, 
          longitudeDelta: 0.005,
        }}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker coordinate={location} title={location.title} description={location.description} />
        <Marker coordinate={destinationLocation} title={destinationLocation.title} description={destinationLocation.description} />
        {/* Marker for Concordia University */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={location.title}
          description={location.description}
        />
        {showDirections && (
          <>
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
            {mode === 'WALKING' && (           <MapViewDirections
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
      </MapView>
      <TouchableOpacity
         style={styles.directionsButton}
         onPress={() => setShowDirections(true)}
      >
        <Text style={styles.directionsButtonText}numberOfLines={1}>{directionsText}</Text>
      </TouchableOpacity>

  {/* <View style={styles.modeContainer}>
    <TouchableOpacity onPress={() => setMode('DRIVING')} style={styles.modeButton}><Text style={styles.modeText}>Driving</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => setMode('WALKING')} style={styles.modeButton}><Text style={styles.modeText}>Walking</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => setMode('TRANSIT')} style={styles.modeButton}><Text style={styles.modeText}>Transit</Text></TouchableOpacity>
  </View> */}
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

      {eta !== null && distance !== null && (
        <View style={[styles.routeInfoContainer, { flexDirection: 'row'}]}>
          <Text style={styles.routeInfoText}>Distance: {Math.round(distance)} km</Text>
          <Text style={styles.routeInfoText}>      ETA: {Math.round(eta)} mins</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  map: {
    width: '100%',
    height: '100%', // Make it full screen
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  toggleButtonContainer: {
    position: 'absolute',
    top: 20, 
    left: 20,
    zIndex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#800000', // Concordia's color
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: 'auto', // Set width to auto for a smaller button
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  highlightedText: {
    color: 'white', // Highlight the active campus in yellow (or any color you prefer)
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  normalText: {
    color: 'grey',

  },
  directionsButton: {
    position: 'absolute',
    bottom: 20, // Places it above the bottom edge
    backgroundColor: '#800000',
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    marginBottom: 60,
    maxWidth: '80%',
    minWidth: 200, // Ensures enough space for the text
    alignSelf: 'center', // Centers the button
  },
  directionsButtonText: {
     color: 'white',
     fontSize: 16,
     fontWeight: 'bold',
     flexShrink: 1, 
     textAlign: 'center',
  },
  routeInfoContainer: {
    position: 'absolute', 
    bottom: 20, 
    width: '90%',
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#800000',
    padding: 10,
    borderRadius: 10,
  },
  routeInfoText: {
    fontSize: 16,
    fontWeight: 'medium',
    color: 'white',
  },
  buttonImage: {
    width: 20,
    height: 20,
  },
  modeContainer: {
    position: 'absolute',
    bottom: 80, // Places it right above the directions button
    left: '50%',
    transform: [{ translateX: -110 }], // Centers the container
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 220, // Adjust the width of the container
    marginBottom: 60
  },
  modeButton: { 
    marginHorizontal: 15,
    backgroundColor: '#800000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeText: { 
    fontSize: 16,
    fontWeight: 'medium',
    color: 'white',
  },
});

export default TransitScreen;