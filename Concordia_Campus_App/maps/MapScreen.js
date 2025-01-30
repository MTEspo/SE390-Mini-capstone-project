// maps/MapScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = () => {
  // Coordinates for Concordia University (Sir George Williams Campus)
  const location = {
    latitude: 45.49532997441208, // Latitude of Concordia University
    longitude: -73.57859533082366, // Longitude of Concordia University
    title: "Concordia University",
    description: "A well-known university located in Montreal, Canada."
  };

  return (
    <View style={styles.container}>
      {/* Buttons above the map */}
      <View style={styles.buttonsContainer}>
        <Button title="Button 1" onPress={() => console.log('Button 1 pressed')} />
        <Button title="Button 2" onPress={() => console.log('Button 2 pressed')} />
      </View>

      {/* Map view */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,  // Center map at Concordia University
          longitude: location.longitude,  // Center map at Concordia University
          latitudeDelta: 0.00001,  // Zoom level for a closer view
          longitudeDelta: 0.00001,  // Zoom level for a closer view
        }}
      >
        {/* Marker for Concordia University */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={location.title}
          description={location.description}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  buttonsContainer: {
    position: 'absolute',
    top: 20,
    zIndex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '80%',  // Map will take 80% of the screen height
  },
});

export default MapScreen;

