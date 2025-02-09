import { duration } from 'moment-timezone';
import React, { useState, useRef, useEffect } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import styles from './styles/mapScreenStyles'; 
import buildingsData from './buildingCoordinates.js';
import BuildingPopup from './BuildingPopup'; 
import MapViewDirections from 'react-native-maps-directions';
import { API_KEY } from '@env';
import ShuttleBusMarker from './ShuttleBusMarker';
import { getLocation } from './locationUtils';
import MapDirections from './MapDirections';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getDistance } from 'geolib';

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
  const [selectedStartBuilding, setSelectedStartBuilding] = useState(null);
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null); 
  const [shuttleStop, setShuttleStop] = useState(null);
  const [toggleMapDirections, setToggleMapDirections] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const [currentScreen, setCurrentScreen] = useState('Map');
  

  const [startQuery, setStartQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [filteredStartBuildings, setFilteredStartBuildings] = useState([]);
  const [filteredDestinationBuildings, setFilteredDestinationBuildings] = useState([]);
  const [lastTappedBuilding, setLastTappedBuilding] = useState(null);

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


  const handleStartSearch = (query) => {
    setStartQuery(query);
    if (query.length === 0) {
      setFilteredStartBuildings([]);
      return;
    }
    const results = buildingsData.buildings.filter((b) =>
      b.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStartBuildings(results);
  };

  const handleDestinationSearch = (query) => {
    setDestinationQuery(query);
    if (query.length === 0) {
      setFilteredDestinationBuildings([]);
      return;
    }
    const results = buildingsData.buildings.filter((b) =>
      b.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDestinationBuildings(results);
  };

  const handleSelectBuilding = (building) => {
    Alert.alert(
      `Select Building`,
      `Do you want to set "${building.name}" as Start or Destination?`,
      [
        {
          text: "Start",
          onPress: () => {
            setSelectedStartBuilding(building);
            setStartQuery(building.name);
          },
        },
        {
          text: "Destination",
          onPress: () => {
            setSelectedDestination(building);
            setDestinationQuery(building.name);
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const isPointInPolygon = (point, polygon) => {
    let x = point.longitude, y = point.latitude;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      let xi = polygon[i].longitude, yi = polygon[i].latitude;
      let xj = polygon[j].longitude, yj = polygon[j].latitude;
      let intersect = ((yi > y) !== (yj > y)) && 
                      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const handleUseCurrentLocation = async () => {
    try {
      const location = await getLocation();
      const userPoint = { latitude: location.latitude, longitude: location.longitude };
      
      const currentBuilding = buildingsData.buildings.find((building) =>
        isPointInPolygon(userPoint, building.coordinates)
      );
      
      if (currentBuilding) {
        setSelectedStartBuilding(currentBuilding);
        setStartQuery(currentBuilding.name);
        moveToLocation(userPoint.latitude, userPoint.longitude);
      } else {
   
        Alert.alert(
          "No building found",
          "You are not within a known building. Would you like to use your current location as the start point?",
          [
            {
              text: "Yes",
              onPress: () => {
                
                const pseudoBuilding = {
                  name: "My Current Location",
             
                  coordinates: [{ latitude: userPoint.latitude, longitude: userPoint.longitude }],
                  markerCoord: userPoint,
                  fillColor: 'orange', 
                  strokeColor: 'orange',
                };
                setSelectedStartBuilding(pseudoBuilding);
                setStartQuery("My Current Location");
                moveToLocation(userPoint.latitude, userPoint.longitude);
              },
            },
            { text: "No", style: "cancel" },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Could not retrieve current location.");
    }
  };


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
    }, [toggleMapDirections,shuttleStop,currentScreen]);


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
  if(currentScreen === 'Building Map Directions'){
    mapRef.current.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: zoomLevel,
        longitudeDelta: zoomLevel,
      },
      1000
    );
  }
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

  const handleBuildingDirections = async () => {
    setShowDirections(false);
    if(currentScreen === 'Map'){

      setCurrentScreen("Building Map Directions");

      setSelectedStartBuilding(null)
      setSelectedDestination(null)

      let closestCampus = null;
      let minDistance = Infinity;

      for(const loc in campusLocations){
        const campus = campusLocations[loc];
        const distance = getDistance({ latitude: userLocation.latitude, longitude: userLocation.longitude },{ latitude: campus.latitude, longitude: campus.longitude });
        if(distance < minDistance) {
          minDistance = distance;
          closestCampus = campus;
        }
      }
      
      setActiveButton(null)

      if (closestCampus && mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: closestCampus.latitude,
            longitude: closestCampus.longitude,
            latitudeDelta: zoomLevel,
            longitudeDelta: zoomLevel,
          },
          1000
        );
      }
      setShowDirections(false);

    }else if(currentScreen === 'Building Map Directions'){
      setCurrentScreen("Map");
      setShowDirections(false);
    }
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

  const fetchUserLocation = async () => {
    const location = await getLocation();
    if(location){
      setUserLocation(location);
      setCenterOnUserLocation(true);
      setIsUserLocationFetched(true);
    }
  };
  
  useEffect(() => {
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
      {currentScreen === 'Map' ? (
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
      </View>) :     
      <View style={styles.searchContainer}>
        <View style={styles.searchBarWrapper}>
          <Text style={styles.label}>Start:</Text>
          <TextInput
            style={[styles.searchBar, { backgroundColor: '#800000', color: '#FFFFFF' }]}
            placeholder="Select Start Building..."
            placeholderTextColor="#FFFFFF"
            value={startQuery}
            onChangeText={handleStartSearch}
            onFocus={() => setFilteredStartBuildings([])}
          />
          {filteredStartBuildings.length > 0 && (
            <FlatList
              data={filteredStartBuildings}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  setSelectedStart(item);
                  setStartQuery(item.name);
                  setFilteredStartBuildings([]);
                }}>
                  <Text style={styles.searchResultItem}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}
          {/* New button for using current location */}
          <TouchableOpacity style={styles.useLocationButton} onPress={handleUseCurrentLocation}>
            <Text style={styles.useLocationButtonText}>Use My Current Location</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBarWrapper}>
          <Text style={styles.label}>Destination:</Text>
          <TextInput
            style={[styles.searchBar, { backgroundColor: '#800000', color: '#FFFFFF' }]}
            placeholder="Select Destination Building..."
            placeholderTextColor="#FFFFFF"
            value={destinationQuery}
            onChangeText={handleDestinationSearch}
            onFocus={() => setFilteredDestinationBuildings([])}
          />
          {filteredDestinationBuildings.length > 0 && (
            <FlatList
              data={filteredDestinationBuildings}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  setSelectedDestination(item);
                  setDestinationQuery(item.name);
                  setFilteredDestinationBuildings([]);
                }}>
                  <Text style={styles.searchResultItem}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>}
  
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
        >
          <Text style={activeButton === 'SGW' ? styles.highlightedText : styles.normalText}>SGW</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={activeButton === 'Loyola' ? styles.loyolaButtonActive : styles.loyolaButton}
          onPress={handleSelectLoyola}
        >
          <Text style={activeButton === 'Loyola' ? styles.highlightedText : styles.normalText}>LOY</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={activeButton === 'user' ? styles.userLocationButtonActive : styles.userLocationButton}
          onPress={handleUserLocation}
        >
          <Icon name="user" size={20} color={activeButton === 'user' ? 'blue' : 'white'} />
        </TouchableOpacity>
        {activeButton !== 'user' && (
          <TouchableOpacity style={styles.directionsButton} onPress={handleCampusDirections}>
            <Text style={styles.directionsButtonText}>{directionsText}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity>
          <TouchableOpacity style={styles.directionsButton} onPress={handleBuildingDirections}>
            <Text style={styles.directionsButtonText}>Building Directions</Text>
          </TouchableOpacity>
        </TouchableOpacity>
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
  
        <ShuttleBusMarker setToggleMapDirections={setToggleMapDirections} setShuttleStop={setShuttleStop} />
  
        {toggleMapDirections && userLocation && shuttleStop && (
          <MapDirections userLocation={userLocation} destinationLocation={shuttleStop} />
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
            apikey={API_KEY}
            strokeWidth={5}
            strokeColor="blue"
            onReady={handleDirections}
          />
        )}
  
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

        {currentScreen === 'Building Map Directions' ? (
          <>
            {buildingsData.buildings.map((building) => {
              let fillColor = building.fillColor;
              if (building === selectedStartBuilding) fillColor = 'green';
              else if (building === selectedDestination) fillColor = 'blue';

              return (
                <Polygon
                  key={building.name}
                  coordinates={building.coordinates}
                  fillColor={fillColor}
                  strokeColor={building.strokeColor}
                  strokeWidth={2}
                  onPress={() => handleSelectBuilding(building)}
                />
              );
            })}

            {lastTappedBuilding && (
              <Marker
                coordinate={lastTappedBuilding.markerCoord}
                title={lastTappedBuilding.name}
              />
            )}
          </>
        ) : null}
      </MapView>
  
      {/* Render the BuildingPopup component with the close handler */}
      <BuildingPopup building={selectedBuilding} onClose={handleClosePopup} />

      {currentScreen === 'Map' ? (
      <TouchableOpacity
        style={styles.directionsButton}
        onPress={handleCampusDirections}
      >
        <View style={styles.directionsButton}>
          <Image source={require('../assets/arrow.png')} style={styles.buttonImage} />
          <Text style={styles.directionsButtonText}>{directionsText}</Text>
        </View>
      </TouchableOpacity>
      ):null} 

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
