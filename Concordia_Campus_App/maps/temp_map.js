import React, { useState, useRef, useEffect } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import MapView, { Polygon, Marker, Overlay, Polyline } from 'react-native-maps';
import styles from './styles/mapScreenStyles'; 
import buildingsData from './buildingCoordinates.js';
import { API_KEY } from '@env';
import { getLocation } from './locationUtils';
import Icon from 'react-native-vector-icons/FontAwesome';

const TempMap = ({route}) =>{
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
    const [destinationActive, setDestinationActive] = useState(false);


    //indoor directions concept
    
    const startPoint = { latitude: 45.497246532696096, longitude: -73.57886038112717 };
    const node1 = { latitude: 45.4972393725777, longitude: -73.5788538017577 };
    const node2 = { latitude: 45.497203445409944, longitude: -73.57888318618875 };
    const node3 = { latitude: 45.49734717344082, longitude: -73.57916302027736 };
    const node4 = { latitude: 45.497184689150686, longitude: -73.57934491031155 };
    const endPoint = { latitude: 45.497189473812725, longitude: -73.57938018653913 };

    const handleMapPress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        console.log("Tapped Coordinates:", latitude, longitude);
    };

    
    const handleReturn = () => {
      setCurrentScreen("Map");
      setShowBuildingDirections(false);
      setSelectedStart(null);
      setSelectedEnd(null);
    };
    
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
        console.log("Retrieved location:", location);
        const userPoint = { latitude: location.latitude, longitude: location.longitude };
        const currentBuilding = buildingsData.buildings.find((building) =>
          isPointInPolygon(userPoint, building.coordinates)
        );
        if (currentBuilding) {
          setSelectedStartBuilding(currentBuilding);
          setStartQuery(currentBuilding.name);
          setSelectedStart(currentBuilding.markerCoord);
          console.log("Using building:", currentBuilding.name);
        } else {
          const pseudoBuilding = {
            name: "My Current Location",
            coordinates: [{ latitude: userPoint.latitude, longitude: userPoint.longitude }],
            markerCoord: userPoint,
            fillColor: 'orange', 
            strokeColor: 'orange',
          };
          setSelectedStartBuilding(pseudoBuilding);
          setStartQuery("My Current Location");
          setSelectedStart(userPoint);
          console.log("Using pseudo building: My Current Location");
        }
        moveToLocation(userPoint.latitude, userPoint.longitude);
      } catch (error) {
        console.error("Error retrieving location:", error);
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
    }, [toggleMapDirections, shuttleStop, currentScreen]);
  
    async function moveToLocation(latitude, longitude) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        },
        2000 
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
      setSelectedBuilding(building);
      setSelectedMarker({
        latitude: building.markerCoord.latitude,
        longitude: building.markerCoord.longitude
      });
      setShowBuildingDirections(false);
    };
  

  
    const handleSelectSGW = () => {
      if (activeButton === 'SGW') {
        // If already on SGW view, reset the map to SGW center
        mapRef.current.animateToRegion({
          latitude: campusLocations['SGW'].latitude,
          longitude: campusLocations['SGW'].longitude,
          latitudeDelta: zoomLevel,
          longitudeDelta: zoomLevel,
        }, 1000);
      } else {
        // If not on SGW view, switch to SGW view
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
        setDestinationActive(false);
        setToggleMapDirections(false);
      }
    };
    
    const handleSelectLoyola = () => {
      if (activeButton === 'Loyola') {
        // If already on LOY view, reset the map to LOY center
        mapRef.current.animateToRegion({
          latitude: campusLocations['Loyola'].latitude,
          longitude: campusLocations['Loyola'].longitude,
          latitudeDelta: zoomLevel,
          longitudeDelta: zoomLevel,
        }, 1000);
      } else {
        // If not on LOY view, switch to LOY view
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
        setDestinationActive(false);
        setToggleMapDirections(false);
      }
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
    
    if (centerOnUserLocation) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: zoomLevel,
        longitudeDelta: zoomLevel,
      }, 1000);
    } else {
      setCenterOnUserLocation(true);
    }
    setShowDirections(false);
    setShowBuildingDirections(false);
    setSelectedStart(null);
    setSelectedEnd(null);
    setSelectedBuilding(null);
    setSelectedMarker(null);
    setActiveButton('user');
    setEta(null);
    setDistance(null);
  };

  
   useEffect(() => {
      return () => {
        setShowBuildingDirections(false);
        setShowDirections(false);
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
  
    useEffect(() => {
      const addInitialMarkers = async () => {
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: campusLocations['SGW'].latitude,
            longitude: campusLocations['SGW'].longitude,
            latitudeDelta: zoomLevel,
            longitudeDelta: zoomLevel,
          }, 0);
          mapRef.current.animateToRegion({
            latitude: campusLocations['Loyola'].latitude,
            longitude: campusLocations['Loyola'].longitude,
            latitudeDelta: zoomLevel,
            longitudeDelta: zoomLevel,
          }, 0);
          const userLocation = await getLocation();
          if (userLocation) {
            mapRef.current.animateToRegion({
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: zoomLevel,
              longitudeDelta: zoomLevel,
            }, 0);
          }
        }
      };
      addInitialMarkers();
    }, []);
  
    
  
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
                moveToLocation(details?.geometry?.location.lat, details?.geometry?.location.lng);
                setSelectedMarker({
                  latitude: details?.geometry?.location.lat,
                  longitude: details?.geometry?.location.lng,
                });
              }}
              onFail={(error) => console.log('Error:', error)}
            />
          </View>
        ) : (
          <>
            <View
              style={[
                styles.searchContainer,
                {
                  position: 'absolute',
                  left: 10,
                  right: 10,
                  top: 10, 
                  backgroundColor: 'transparent', 
                  padding: 0,
                  borderRadius: 0,
                  zIndex: 20,
                },
              ]}
            >
  
              <TextInput
                style={[
                  styles.searchBar,
                  { backgroundColor: '#800000', color: '#FFFFFF', width: '100%' },
                ]}
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
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedStartBuilding(item);
                        setSelectedStart(item.markerCoord);
                        setStartQuery(item.name);
                        setFilteredStartBuildings([]);
                      }}
                    >
                      <Text style={styles.searchResultItem}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
              <TouchableOpacity style={styles.useLocationButton} onPress={handleUseCurrentLocation}>
                <Text style={styles.useLocationButtonText}>Use My Current Location</Text>
              </TouchableOpacity>
              <TextInput
                style={[
                  styles.searchBar,
                  {
                    backgroundColor: '#800000',
                    color: '#FFFFFF',
                    width: '100%',
                    marginTop: 10,
                  },
                ]}
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
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedDestination(item);
                        setDestinationQuery(item.name);
                        setFilteredDestinationBuildings([]);
                      }}
                    >
                      <Text style={styles.searchResultItem}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                zIndex: 30,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.searchBar,
                  {
                    backgroundColor: '#800000',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    alignSelf: 'flex-start',
                  },
                ]}
                onPress={handleReturn}
              >
                <Text style={[styles.searchResultItem, { color: '#FFFFFF', textAlign: 'center' }]}>
                  Return
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
    
        <View style={styles.toggleButtonContainer}>
          
            <>
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
            </>
        </View>
    
        <MapView
          ref={mapRef}
          style={styles.map}
          showsPointsOfInterest={false}
          onPress={handleMapPress}
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
  
          <Marker coordinate={campusLocations['SGW']} title={campusLocations['SGW'].title} description={campusLocations['SGW'].description} />
          <Marker coordinate={campusLocations['Loyola']} title={campusLocations['Loyola'].title} description={campusLocations['Loyola'].description} />
  
           
          {buildingsData.buildings.map((building, index) => {
            const polygonFillColor = building.fillColor;
  
  
            return (
                <>
              <Polygon
                key={index}
                coordinates={building.coordinates}
                fillColor={polygonFillColor}
                strokeColor={building.strokeColor}
                strokeWidth={2}
                onPress={() => handlePolygonPress(building)} 
                testID={`polygon-${index}`}
              />
              
              {building.name == 'Henry F.Hall Building' && (
                <Overlay
                    bounds={[
                        [
                        Math.min(...building.coordinates.map(coord => coord.latitude)),
                        Math.min(...building.coordinates.map(coord => coord.longitude))
                        ],
                        [
                        Math.max(...building.coordinates.map(coord => coord.latitude)),
                        Math.max(...building.coordinates.map(coord => coord.longitude))
                        ]
                    ]}
                    image={require('../assets/floor_plans/Hall-8.png')}
                    opacity={0.8}
                />
                
              )}
              <Polyline
                coordinates={[startPoint, node1, node2, node3, node4, endPoint]}
                strokeColor="black"
                strokeWidth={2}
                lineDashPattern={[5, 5]}
              />
              <Marker coordinate={startPoint} pinColor={'green'} />
              <Marker coordinate={endPoint} pinColor={'black'} />
              

              </>
              
            );
          })}
          
        </MapView>
            
        
        
          
      </View>
    );
}


export default TempMap;