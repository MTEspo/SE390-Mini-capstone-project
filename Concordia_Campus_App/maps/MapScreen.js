import { duration } from 'moment-timezone';
import React, { useEffect, useState, useRef } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import MapView, { Polygon, Marker, Polyline } from 'react-native-maps';
import styles from './styles/mapScreenStyles'; 
import buildingsData from './buildingCoordinates.js';
import BuildingPopup from './BuildingPopup'; 
import MapViewDirections from 'react-native-maps-directions';

const google_maps_api_key = 'AIzaSyCS3Tq6z9E4OpI87mHPprELatvXQ0AyZVI';

const MapScreen = () => {
  const [campus, setCampus] = useState('SGW');
  const [zoomLevel, setZoomLevel] = useState(0.005); 
  const [selectedBuilding, setSelectedBuilding] = useState(null); 
  const mapRef = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const [showDirections, setShowDirections] = useState(false);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);

  const campusLocations = {
    SGW: {
      latitude: 45.49532997441208,
      longitude: -73.57859533082366,
      title: 'SGW Campus',
      description: 'A well-known university located in Montreal, Canada',
    },
    Loyola: {
      latitude: 45.458161998720556,
      longitude: -73.63905090035233,
      title: 'Loyola Campus',
      description: 'Loyola Campus of Concordia University',
    },
  };

  const location = campusLocations[campus];

  async function moveToLocation(latitude, longitude) {
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      2000 //amount of time it takes to animate
    )
  }

  const handleZoomIn = () => {
    // Zoom in by decreasing the delta more significantly
    setZoomLevel((prevZoom) => Math.max(prevZoom * 0.7, 0.0005)); // Zoom in more per click
  };

  const handleZoomOut = () => {
    // Zoom out by increasing the delta more significantly
    setZoomLevel((prevZoom) => Math.min(prevZoom / 0.7, 0.05)); // Zoom out more per click
  };

  const handlePolygonPress = (building) => {
    setSelectedBuilding(building); // Update the selected building info
    setSelectedMarker({
      latitude: building.markerCoord.latitude,
      longitude: building.markerCoord.longitude
    });
  };

  const handleClosePopup = () => {
    setSelectedBuilding(null); // Close the popup by clearing the selected building
  };
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
      <View style={styles.searchBarContainer}>
        <GooglePlacesAutocomplete
          fetchDetails={true}
          placeholder="Search Building or Class..."
          styles={{
            textInput: styles.searchBar, 
          }}
          query={{
            key: 'your-key',
            language: 'en',
          }}
          onPress={(data, details = null) => {
            console.log(JSON.stringify(details?.geometry?.location));
            moveToLocation(details?.geometry?.location.lat, details?.geometry?.location.lng);
            setSelectedMarker({
              latitude: details?.geometry?.location.lat,
              longitude: details?.geometry?.location.lng,
            });
              console.log('Selected Marker:', selectedMarker); // Debug marker state
          }}
          onFail={(error) => console.log('Error:', error)}
      
        />
      </View>

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

      <MapView
        ref = {mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: zoomLevel, // Use zoomLevel for zooming
          longitudeDelta: zoomLevel,
        }}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: zoomLevel,
          longitudeDelta: zoomLevel,
        }}
      >
        <Marker coordinate={location} title={location.title} description={location.description} />
        <Marker coordinate={destinationLocation} title={destinationLocation.title} description={destinationLocation.description} />
        {selectedMarker && (
          <Marker
            coordinate={{
              latitude: selectedMarker.latitude,
              longitude: selectedMarker.longitude,
            }}
            pinColor="blue"
            title="Selected Location"
            style={{
              zIndex: 1000,
            }}
          />
        )}

        {buildingsData.buildings.map((building, index) => (
          <Polygon
            key={index}
            coordinates={building.coordinates}
            fillColor={building.fillColor}
            strokeColor={building.strokeColor}
            strokeWidth={2}
            onPress={() => handlePolygonPress(building)} // Handle the polygon press
          />
        ))}
        {showDirections && (
          <MapViewDirections
            origin={location}
            destination={destinationLocation}
            apikey={google_maps_api_key}
            strokeWidth={5}
            strokeColor="blue"
            onReady={handleDirections}
          />
        )}
      </MapView>

      {/* Render the BuildingPopup component with the close handler */}
      <BuildingPopup building={selectedBuilding} onClose={handleClosePopup} />

      {/* Zoom in/out buttons */}
      <View style={styles.zoomButtonContainer}>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
          <Text style={styles.zoomButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
          <Text style={styles.zoomButtonText}>−</Text>
        </TouchableOpacity>
      </View>
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
      {eta !== null && distance !== null && (
        <View style={[styles.routeInfoContainer, { flexDirection: 'row'}]}>
          <Text style={styles.routeInfoText}>Distance: {Math.round(distance)} km</Text>
          <Text style={styles.routeInfoText}>      ETA: {Math.round(eta)} min</Text>
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
    backgroundColor: '#800000',
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
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
});

export default MapScreen;


