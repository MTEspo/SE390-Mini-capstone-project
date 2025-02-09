// maps/MapScreen.js
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
  const directionsText = campus === 'SGW' ? '   Get directions to Loyola' : '   Get directions to SGW';

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
      {/* SEARCH BAR */}
      <View style={styles.searchBarContainer}>
        <TextInput
          placeholder="Search Building or Class..."
          style={styles.searchBar}
          onChangeText={(text) => console.log(`Searching for: ${text}`)} // Handle the searching input
        />
      </View>

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
          latitude: location.latitude, // Center map at Concordia University
          longitude: location.longitude, // Center map at Concordia University
          latitudeDelta: 0.0001, // Zoom level for a closer view
          longitudeDelta: 0.0001, // Zoom level for a closer view
        }}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0001,
          longitudeDelta: 0.0001,
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
      <View style={styles.directionsButton}>
      <Image 
      source={require('../assets/arrow.png')}  
      style={styles.buttonImage} 
    />
    {/* Text for the directions button */}
    <Text style={styles.directionsButtonText}>{directionsText}</Text>
  </View>
</TouchableOpacity>

  <View style={styles.modeContainer}>
    <TouchableOpacity onPress={() => setMode('DRIVING')} style={styles.modeButton}><Text style={styles.modeText}>Driving</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => setMode('WALKING')} style={styles.modeButton}><Text style={styles.modeText}>Walking</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => setMode('TRANSIT')} style={styles.modeButton}><Text style={styles.modeText}>Transit</Text></TouchableOpacity>
  </View>

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
  searchBarContainer: {
    position: 'absolute',
    top: 20,
    width: '70%',
    left: 20,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  searchBar: {
    height: 40,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  map: {
    width: '100%',
    height: '80%', // Adjust map height to fit below search bar
  },
  toggleButtonContainer: {
    position: 'absolute',
    top: 80, // Place it directly below the search bar
    left: 20, // Align the button to the left of the screen
    zIndex: 1, // Ensures it appears above the map
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
    backgroundColor: '#800000',  
    paddingVertical: 10,          
    paddingHorizontal: 10,        
    borderRadius: 50,            
    alignItems: 'center', 
    flexDirection: 'row',
  },
  directionsButtonText: {
     color: 'white',
     fontSize: 16,
     fontWeight: 'bold'
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
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    marginVertical: 10 },

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