import React, { useState, useRef, useEffect } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import { View, Text, TouchableOpacity, Image, FlatList, TextInput, Alert} from 'react-native';
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
import TransitScreen from './transitOptions.js';
import RouteInfoContainer from './RouteInfoContainer.js';


const MapScreen = ({route}) => {
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
  const [activeCampusDirections, setActiveCampusDirections] = useState(false);
  const {destinationLoc} = route.params || {};
  const {destinationCoords} = route.params || {};
  const [routeKey, setRouteKey] = useState(0);

  

  const handleReturn = () => {
    setCurrentScreen("Map");
    setShowBuildingDirections(false);
    setSelectedStart(null);
    setSelectedEnd(null);
    setActiveCampusDirections(false);
    setShowDirections(false);
    setEta(null);
    setDistance(null);
    setStartQuery(null);
    setDestinationQuery(null);
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
    if(currentScreen !== "Building Map Directions"){
      setSelectedBuilding(building);
      setSelectedMarker({
        latitude: building.markerCoord.latitude,
        longitude: building.markerCoord.longitude
      });
      setShowBuildingDirections(false);
    }
  };

  const handleClosePopup = () => {
    setSelectedBuilding(null);
  };
  const destinationLocation = campus === 'SGW' ? campusLocations.Loyola : campusLocations.SGW;
  const directionsText = campus === 'SGW' ? 'Directions To LOY' : 'Directions To SGW';

  // Gets direction data from the TransitOptions component and returns it to the map screen.
  const handleDirectionsToMap = (eta, distance) => {
    setEta(eta);
    setDistance(distance);
  }

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
      setToggleMapDirections(false);
      setActiveCampusDirections(false);
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
      setToggleMapDirections(false);
      setActiveCampusDirections(false);
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
  setActiveCampusDirections(false);
  setEta(null);
  setDistance(null);
};

  const handleCampusDirections = () =>{
    if (activeButton === 'user') return;
    setShowDirections(true);
    setSelectedStart(null);
    setSelectedEnd(null);
    setShowBuildingDirections(false);
    setActiveCampusDirections(true);

    if(activeCampusDirections){
      setShowDirections(false);
      setEta(null);
      setDistance(null);
      setActiveCampusDirections(false);
    }
  };

  const handleBuildingDirections = async () => {
    setShowDirections(false);
    if(currentScreen === 'Map'){
      setCurrentScreen("Building Map Directions");
      setSelectedStartBuilding(null);
      setSelectedDestination(null);
      setEta(null);
      setDistance(null);
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
      setActiveButton(null);
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
    } else if(currentScreen === 'Building Map Directions'){
      setCurrentScreen("Map");
      setShowDirections(false);
    }
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


  useEffect(() => {
    if (selectedStart && selectedEnd) {
      console.log(" Start and End Selected:", selectedStart, selectedEnd);
  
      setShowBuildingDirections(false); // Reset state
      setTimeout(() => {
        setShowBuildingDirections(true); // Enable route rendering
        setRouteKey((prev) => prev + 1); //  Force re-render
      }, 100); 
  
      setTimeout(() => {
        console.log(" Auto-Fitting Route to Screen");
        mapRef.current.fitToCoordinates(
          [selectedStart, selectedEnd],
          {
            edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
            animated: true,
          }
        );
      }, 300);
    }
  }, [selectedStart, selectedEnd]);
  
  
  

  useEffect(() => {
    if (destinationLoc) {
      console.log('Destination Location:', destinationLoc);
      
      const selectedBuilding = buildingsData.buildings.find(
        (building) => building.name === destinationLoc
      );
  
      if (selectedBuilding) {
        handlePolygonPress(selectedBuilding); // Highlight the building
        moveToLocation(selectedBuilding.markerCoord.latitude + 0.001, selectedBuilding.markerCoord.longitude);
      }
    }
  }, [destinationLoc]);
  
  useEffect(() => {
    if (destinationCoords || route.params?.startCoords) {
      console.log("Processing directions for:", destinationCoords);
  
      const startLocation = route.params?.startCoords;
      if (startLocation) {
        setSelectedStart(startLocation);
        moveToLocation(startLocation.latitude, startLocation.longitude);
      }
  
      const selectedBuilding = buildingsData.buildings.find(
        (building) => building.name === destinationCoords
      );
  
      if (selectedBuilding) {
        setCurrentScreen("Building Map Directions");
        setStartQuery("My Current Location");
        setDestinationQuery(selectedBuilding.name);       
        setSelectedEnd(selectedBuilding.markerCoord);
        setSelectedDestination(selectedBuilding); 
      } else {
        console.error("Invalid destinationCoords format:", destinationCoords);
      }
    }
  }, [destinationCoords, route.params?.startCoords]);
  
  return (
    <View style={styles.container}>
      {currentScreen === 'Map' ? (
        <View style={styles.searchBarContainer}>
          <GooglePlacesAutocomplete
            fetchDetails={true}
            placeholder="Search for Point of Interest..."
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
                { backgroundColor: '#800000', color: '#FFFFFF', width: '100%', borderColor: 'black' },
              ]}
              placeholder="Select Start Building..."
              placeholderTextColor="#FFFFFF"
              value={startQuery}
              onChangeText={handleStartSearch}
              onFocus={() => setFilteredStartBuildings([])}
            />
            {filteredStartBuildings.length > 0 && (
              <FlatList
                style={styles.flatListResult}
                data={filteredStartBuildings}
                keyExtractor={(item) => item.name}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={(index === filteredStartBuildings.length - 1 ) ? styles.searchResultItemNoBorder : styles.searchResultItem}
                    activeOpacity={0.6}
                    onPress={() => {
                      setSelectedStartBuilding(item);
                      setSelectedStart(item.markerCoord);
                      setStartQuery(item.name);
                      setFilteredStartBuildings([]);
                    }}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity style={styles.useCurrentLocationBtn} onPress={handleUseCurrentLocation}>
              <Text style={styles.useCurrentLocationText}>Use My Current Location</Text>
            </TouchableOpacity>
            <TextInput
              style={[
                styles.searchBar,
                {
                  backgroundColor: '#800000',
                  color: '#FFFFFF',
                  width: '100%',
                  marginTop: 10,
                  borderColor: 'black'
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
                style={styles.flatListResult}
                data={filteredDestinationBuildings}
                keyExtractor={(item) => item.name}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={(index === filteredDestinationBuildings.length - 1 ) ? styles.searchResultItemNoBorder : styles.searchResultItem}
                    activeOpacity={0.6}
                    onPress={() => {
                      setSelectedDestination(item);
                      setSelectedEnd(item.markerCoord);
                      setDestinationQuery(item.name);
                      setFilteredDestinationBuildings([]);
                    }}
                  >
                    <Text>{item.name}</Text>
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
              zIndex: 1,
            }}
          >
            <TouchableOpacity
              style={[
                styles.searchBar,
                {
                  backgroundColor: 'red',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  alignSelf: 'flex-start',
                  borderColor: 'black',
                  flexDirection: 'row',
                  bottom: -40,
                  right: -15
                  
                },
              ]}
              onPress={handleReturn}
            >
              <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>
                Return
              </Text>
            </TouchableOpacity>
            <TouchableOpacity               
            style={[
                styles.searchBar,
                {
                  backgroundColor: 'green',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderColor: 'black',
                  flexDirection: 'row',
                  left: 0,
                  bottom: 550,
                },
              ]}>
              <Text style={{ color: '#FFFFFF', textAlign: 'center' }} >Get Directions</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
  
      <View style={styles.toggleButtonContainer}>
        {currentScreen === 'Map' ? (
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
            
            {activeButton !== 'user' && (
              <TouchableOpacity 
                style={(!activeCampusDirections) ? styles.directionsButton : styles.directionsButtonActive} 
                onPress={handleCampusDirections} 
                testID="directions-button"
              >
                <Text style={(!activeCampusDirections) ? styles.directionsButtonText: styles.highlightedText}>{(!activeCampusDirections) ? directionsText : "Cancel Directions"}</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.directionsButton} onPress={handleBuildingDirections}>
              <Text style={styles.directionsButtonText}>Building Directions</Text>
            </TouchableOpacity>
          </>
        ) : (null)}
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

        <Marker coordinate={campusLocations['SGW']} title={campusLocations['SGW'].title} description={campusLocations['SGW'].description} />
        <Marker coordinate={campusLocations['Loyola']} title={campusLocations['Loyola'].title} description={campusLocations['Loyola'].description} />

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
  
        {!showDirections && (currentScreen === "Map") &&(
          <ShuttleBusMarker setToggleMapDirections={setToggleMapDirections} setShuttleStop={setShuttleStop} />
        )}  

        {!showDirections && toggleMapDirections && userLocation && shuttleStop && (
          <MapDirections userLocation={userLocation} destinationLocation={shuttleStop} />
        )}

        {buildingsData.buildings.map((building, index) => {
          let polygonFillColor = building.fillColor;
          if (building === selectedBuilding) polygonFillColor = 'blue';

          return (
            <Polygon
              key={index}
              coordinates={building.coordinates}
              fillColor={polygonFillColor}
              strokeColor={building.strokeColor}
              strokeWidth={2}
              onPress={() => handlePolygonPress(building)} 
              testID={`polygon-${index}`}
            />
          );
        })}
        
        <TransitScreen showDirections={(showDirections) ? showDirections : showBuildingDirections} campus={campus} routeData={handleDirectionsToMap} origin={selectedStart} destination={selectedEnd} />

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
                  testID={"test-"+building.name}
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
      
      {currentScreen === "Map" ? (
        <BuildingPopup
          building={selectedBuilding}
          onClose={handleClosePopup}
          testID="building-popup" 
        />
      ) : null}
      
      {currentScreen === 'Building Map Directions' ? (
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={handleCampusDirections}
        >
          <View style={styles.directionsButton}>
            <Image source={require('../assets/arrow.png')} style={styles.buttonImage} />
            <Text style={styles.directionsButtonText}>{directionsText}</Text>
          </View>
        </TouchableOpacity>
      ) : null} 

      <RouteInfoContainer eta={eta} distance={distance}/>
        
    </View>
  );
};

export default MapScreen;
