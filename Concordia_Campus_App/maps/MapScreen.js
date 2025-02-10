
import { duration } from 'moment-timezone';
import React, { useState, useRef, useEffect } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import MapView, { Polygon, Marker, Polyline } from 'react-native-maps';
import styles from './styles/mapScreenStyles'; 
import buildingsData from './buildingCoordinates.js';
import BuildingPopup from './BuildingPopup'; 
import MapViewDirections from 'react-native-maps-directions';
import { API_KEY } from '@env';
import ShuttleBusMarker from './ShuttleBusMarker';
import { getLocation } from './locationUtils';
import MapDirections from './MapDirections';
import Icon from 'react-native-vector-icons/FontAwesome';


const MapScreen = () => {
  const [campus, setCampus] = useState('SGW');
  const [zoomLevel, setZoomLevel] = useState(0.005); 
  const [selectedBuilding, setSelectedBuilding] = useState(null); 
  const mapRef = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [showBuildingDirections, setShowBuildingDirections] = useState(false);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null); 
  const [shuttleStop, setShuttleStop] = useState(null);
  const [toggleMapDirections, setToggleMapDirections] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [centerOnUserLocation, setCenterOnUserLocation] = useState(true);
  const [isUserLocationFetched, setIsUserLocationFetched] = useState(false);
  const [activeButton, setActiveButton] = useState('user');

  
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

  useEffect(() => {
    let interval;
      const fetchUserLocation = async () => {
        const location = await getLocation();
        if(location){
          setUserLocation(location);
        }
      };
      if(toggleMapDirections && shuttleStop){
        fetchUserLocation();
        interval = setInterval(fetchUserLocation, 5000);
      }
      return () => {
        if(interval) clearInterval(interval);
      };
    }, [toggleMapDirections,shuttleStop]);


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

  const handlePolygonPress = (building) => {
    if(!selectedStart){
      setSelectedStart(building.markerCoord);
      setShowBuildingDirections(false);
    } else if (!selectedEnd) {
      setSelectedEnd(building.markerCoord);
      setShowBuildingDirections(false);
    } else {
      setSelectedStart(building.markerCoord);
      setSelectedEnd(null);
      setShowBuildingDirections(false);
    }
    setSelectedBuilding(building); // Update the selected building info
    setSelectedMarker({
      latitude: building.markerCoord.latitude,
      longitude: building.markerCoord.longitude
    });
    setShowBuildingDirections(false);
  };

  const handleClosePopup = () => {
    setSelectedBuilding(null); // Close the popup by clearing the selected building
  };
  const destinationLocation = campus === 'SGW' ? campusLocations.Loyola : campusLocations.SGW;
  const directionsText = campus === 'SGW' ? 'Directions To LOY' : 'Directions To SGW';

  const handleDirections = (result) => {
    setEta(result.duration);
    setDistance(result.distance);
  };



const handleSelectSGW = () => {
  setShowDirections(false);
  setEta(null);
  setDistance(null);
  setCampus('SGW');
  setShowBuildingDirections(false);
  setSelectedStart(null);
  setSelectedEnd(null);
  setSelectedBuilding(null);
  setSelectedMarker(null);
  setCenterOnUserLocation(false);
  setActiveButton('SGW');
};

const handleSelectLoyola = () => {
  setShowDirections(false);
  setEta(null);
  setDistance(null);
  setCampus('Loyola');
  setShowBuildingDirections(false);
  setSelectedStart(null);
  setSelectedEnd(null);
  setSelectedBuilding(null);
  setSelectedMarker(null);
  setCenterOnUserLocation(false);
  setActiveButton('Loyola');
};

const handleUserLocation = () => {
  setCenterOnUserLocation(true);
  setShowDirections(false);
  setShowBuildingDirections(false);
  setSelectedStart(null);
  setSelectedEnd(null);
  setSelectedBuilding(null);
  setSelectedMarker(null);
  setActiveButton('user');
};

  const handleCampusDirections = () =>{
    if (activeButton === 'user') return;
    setShowDirections(true);
    setSelectedStart(null);
    setSelectedEnd(null);
    setShowBuildingDirections(false);
  }

  const handleBuildingDirections = () => {
    setShowBuildingDirections(true);
    setShowDirections(false);
  }

  useEffect(() => {
    return () => {
      setShowDirections(false);
      setEta(null);
      setDistance(null);
    };
  }, []);
  
  useEffect(() => {
    return () => {
      setShowBuildingDirections(false);
      setEta(null);
      setDistance(null);
    };
  }, []);

  useEffect(() => {
    const fetchUserLocation = async () => {
      const location = await getLocation();
      if(location){
        setUserLocation(location);
        setCenterOnUserLocation(true);
        setIsUserLocationFetched(true);
      }
    };
    fetchUserLocation();
  }, []);

  useEffect(() => {
    mapRef.current.animateToRegion({
      latitude: campusLocations[campus].latitude,
      longitude: campusLocations[campus].longitude,
      latitudeDelta: zoomLevel,
      longitudeDelta: zoomLevel,
    }, 1000);
  }, [campus, zoomLevel]);

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
            key: API_KEY,
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
        {/* {selectedStart && selectedEnd &&(
          <TouchableOpacity
          style = {styles.directionsBuildingButton}
          onPress={handleBuildingDirections}
          >
          <Image source={require('../assets/location.png')} style={styles.buttonImage} />
          <Text style={styles.directionsBuildingButtonText}>Start</Text>
          </TouchableOpacity>
        )} */}
      </View>
             {selectedStart && selectedEnd && showBuildingDirections && (
             <MapViewDirections
             origin={selectedStart}
             destination={selectedEnd}
             apikey={API_KEY}
             strokeWidth={5}
             strokeColor="blue"
             onReady={handleDirections}
             />
        )}
      <View style={styles.toggleButtonContainer}>
        <TouchableOpacity
          style={activeButton === 'SGW' ? styles.sgwButtonActive : styles.sgwButton}
          onPress={handleSelectSGW}
          testID="sgwButton"
        >
          <Text style={activeButton === 'SGW' ? styles.highlightedText : styles.normalText}>SGW</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={activeButton === 'Loyola' ? styles.loyolaButtonActive : styles.loyolaButton}
          onPress={handleSelectLoyola}
          testID="loyolaButton"
        >
          <Text style={activeButton === 'Loyola' ? styles.highlightedText : styles.normalText}>LOY</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={activeButton === 'user' ? styles.userLocationButtonActive : styles.userLocationButton}
          onPress={handleUserLocation}
          testID="userLocationButton"
        >
          <Icon name="user" size={20} color={activeButton === 'user' ? 'blue' : 'white'} />
        </TouchableOpacity>
        {activeButton !== 'user' && (
          <TouchableOpacity style={styles.directionsButton} onPress={handleCampusDirections} testID="directions-button">
            <Text style={styles.directionsButtonText}>{directionsText}</Text>
          </TouchableOpacity>
    
        )}
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: isUserLocationFetched ? userLocation.latitude : location.latitude,
          longitude: isUserLocationFetched ? userLocation.longitude : location.longitude,
          latitudeDelta: zoomLevel,
          longitudeDelta: zoomLevel,
        }}
        region={{
          latitude: centerOnUserLocation ? (isUserLocationFetched ? userLocation.latitude : location.latitude) : location.latitude,
          longitude: centerOnUserLocation ? (isUserLocationFetched ? userLocation.longitude : location.longitude) : location.longitude,
          latitudeDelta: zoomLevel,
          longitudeDelta: zoomLevel,
        }}
      >
        {/* ... other markers and polygons ... */}
        {isUserLocationFetched && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            pinColor="green"
            title="Your Location"
          />
        )}
        <Marker coordinate={location} title={location.title} description={location.description} />
        <Marker coordinate={destinationLocation} title={destinationLocation.title} description={destinationLocation.description} />


        <ShuttleBusMarker setToggleMapDirections={setToggleMapDirections} setShuttleStop={setShuttleStop}/>

        {toggleMapDirections && userLocation && shuttleStop && (
          <MapDirections 
            userLocation={userLocation} 
            destinationLocation={shuttleStop}/>
        )}

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
            onPress={() => handlePolygonPress(building)} 
            testID={`polygon-${index}`}
          />
        ))}
        {showDirections && (
          <MapViewDirections
            origin={location}
            destination={destinationLocation}
            apikey={API_KEY}
            strokeWidth={5}
            strokeColor="blue"
            onReady={handleDirections}
          />
        )}
        {selectedStart && selectedEnd && showBuildingDirections &&(
             <MapViewDirections
             origin={selectedStart}
             destination={selectedEnd}
             apikey={API_KEY}
             strokeWidth={5}
             strokeColor="blue"
             onReady={handleDirections}
             />
        )}
      </MapView>
      <BuildingPopup
        building={selectedBuilding}
        onClose={handleClosePopup}
        testID="building-popup" 
      />

      {eta !== null && distance !== null && (
        <View style={[styles.routeInfoContainer, { flexDirection: 'row'}]}>
          <Text style={styles.routeInfoText}>Distance: {Math.round(distance)} km</Text>
          <Text style={styles.routeInfoText}>      ETA: {Math.round(eta)} min</Text>
        </View>
      )}
    </View>
  );
};

export default MapScreen;

