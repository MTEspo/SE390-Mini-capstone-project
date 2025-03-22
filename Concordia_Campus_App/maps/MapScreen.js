import React, { useState, useRef, useEffect } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import { View, Text, TouchableOpacity, Image, Alert, Keyboard, FlatList} from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import styles from './styles/mapScreenStyles'; 
import buildingsData from './buildingCoordinates.js';
import BuildingPopup from './BuildingPopup'; 
import { API_KEY } from '@env';
import ShuttleBusMarker from './ShuttleBusMarker';
import { getLocation } from './locationUtils';
import MapDirections from './MapDirections';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getDistance } from 'geolib';
import TransitScreen from './transitOptions.js';
import RouteInfoContainer from './RouteInfoContainer.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SearchBar from '../utilities/SearchBar.js';
import SearchResults from '../utilities/SearchResults.js';


const MapScreen = ({route}) => {
  const [campus, setCampus] = useState('SGW');
  const [zoomLevel, setZoomLevel] = useState(0.005); 
  const [selectedBuilding, setSelectedBuilding] = useState(null); 
  const mapRef = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [showBuildingDirections, setShowBuildingDirections] = useState(false);
  const [showPOIdirections, setShowPOIdirections] = useState(false);
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
  const [isDirectionsActive, setIsDirectionsActive] = useState(false);
  const {destinationLoc} = route.params || {};
  const {destinationCoords} = route.params || {};
  const [routeKey, setRouteKey] = useState(0);
  const [selectedPOICategory, setSelectedPOICategory] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const poiSearchRef = useRef();

  const handleReturn = () => {
    setCurrentScreen("Map");
    setShowBuildingDirections(false);
    setSelectedStart(null);
    setSelectedEnd(null);
    setActiveCampusDirections(false);
    setShowDirections(false);
    setShowPOIdirections(false);
    setEta(null);
    setDistance(null);
    setStartQuery('');
    setDestinationQuery('');
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
      setShowPOIdirections(false);
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
      setShowPOIdirections(false);
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
  setShowPOIdirections(false);
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
    setShowPOIdirections(false);
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


  const handlePOICancel = () => {
    setShowPOIdirections(false);
    setEta(null);
    setDistance(null); 
    setSelectedPOI(null);
  };

  const handleCategorySelect = async (category) => {
    setSelectedPOICategory(category); 
  
    if (!userLocation) {
      Alert.alert('Location not available yet');
      return;
    }
  
    const { latitude, longitude } = userLocation;
    const radius = 5000; 
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${category}&key=${API_KEY}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.status === 'OK') {
        setNearbyPlaces(data.results);
      } else {
        console.warn('Places API error:', data.status);
        Alert.alert('Error', 'No places found for this category.');
        setNearbyPlaces([]);
      }
    } catch (error) {
      console.error('Failed to fetch places:', error);
      Alert.alert('Error', 'Something went wrong fetching places.');
    }
  };
  
  useEffect(() => {
      return () => {
        setShowBuildingDirections(false);
        setShowDirections(false);
        setShowPOIdirections(false);
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
    console.log('showPOIDirections changed:', showPOIdirections);
  }, [showPOIdirections]);

  useEffect(() => {
    if (destinationLoc) {
      console.log('Destination Location:', destinationLoc);
      
      const selectedBuilding = buildingsData.buildings.find(
        (building) => building.name === destinationLoc
      );
  
      if (selectedBuilding) {
        handlePolygonPress(selectedBuilding); 
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
  
  // Clears the start building search bar and removes the highlighted building
  const clearOriginSearchBar = () =>{
    setSelectedStartBuilding(null);
    setSelectedStart(null);
    setStartQuery("");
    setShowBuildingDirections(false);
    setEta(null);
    setDistance(null);
  }

  // Clears the desitnation building search bar and removes the highlighted building
  const clearDestinationSearchBar = () =>{
    setSelectedDestination(null);
    setSelectedEnd(null);
    setDestinationQuery("");
    setShowBuildingDirections(false);
    setEta(null);
    setDistance(null);
  }

  // When the searchbar provides results for start building this will be what happens when an item is clicked
  const handleOriginSearch = (building, buildingCoord, buildingName) => {
    setSelectedStartBuilding(building);
    setSelectedStart(buildingCoord);
    setStartQuery(buildingName);
    setFilteredStartBuildings([]);
  }

  // When the searchbar provides results for destination building this will be what happens when an item is clicked
  const handleDestinationBuildingSearch = (bulding, buildingCoord, buildingname) => {
    setSelectedDestination(bulding);
    setSelectedEnd(buildingCoord);
    setDestinationQuery(buildingname);
    setFilteredDestinationBuildings([]);
  }

    //helper for node coordinates (used when setting up path config file)
    const handleMapPress = () => {
        Keyboard.dismiss();
    };

  return (
    <View style={styles.container}>
      {currentScreen === 'Map' ? (
        <View style={styles.searchBarContainer}>
          <GooglePlacesAutocomplete
          ref={poiSearchRef}
            fetchDetails={true}
            placeholder="Search for Point of Interest..."
            styles={{
              textInput: styles.searchBar,
            }}
            query={{
              key: API_KEY,
              language: 'en',
              location: userLocation ? `${userLocation.latitude},${userLocation.longitude}` : undefined,
              radius: 5000, 
            }}
            onPress={(data, details = null) => {
              const placeLat = details?.geometry?.location.lat;
              const placeLng = details?.geometry?.location.lng;
              const poiLocation = { latitude: placeLat, longitude: placeLng };
            
              moveToLocation(placeLat, placeLng);
              setSelectedPOI(poiLocation);
            
              if (userLocation) {
                const distanceMeters = getDistance(userLocation, poiLocation);
                const distanceKm = (distanceMeters / 1000).toFixed(2);
                setEta(null); 
                setDistance(`${distanceKm} km`);
              }
            }}
            
            onFail={(error) => console.log('Error:', error)}
          />
    <TouchableOpacity
  onPress={() => setShowCategoryPicker(true)}
  style={{
    position: 'absolute',
    left: 1,
    top: 15,
    zIndex: 2,
    padding: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 3,
  }}
>
  <Icon name="filter" size={20} color="#555" />
</TouchableOpacity>


{nearbyPlaces.length > 0 && (
  <FlatList
  data={nearbyPlaces}
  keyExtractor={(item) => item.place_id}
  style={{ maxHeight: 200, backgroundColor: 'white', marginTop: 5, borderRadius: 10 }}
  renderItem={({ item }) => {
    const distanceMeters = userLocation
      ? getDistance(
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          {
            latitude: item.geometry.location.lat,
            longitude: item.geometry.location.lng,
          }
        )
      : null;

    const distanceKm = distanceMeters !== null ? (distanceMeters / 1000).toFixed(2) : 'N/A';

    return (
      <TouchableOpacity
        style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}
        onPress={() => {
          moveToLocation(item.geometry.location.lat, item.geometry.location.lng);
          setSelectedPOI({
            latitude: item.geometry.location.lat,
            longitude: item.geometry.location.lng,
          });
          poiSearchRef.current?.setAddressText(item.name);
          setNearbyPlaces([]); 
        }}
      >
        <Text style={{ fontWeight: 'bold' }}>
          {item.name} ({distanceKm} km)
        </Text>
        <Text>{item.vicinity}</Text>
      </TouchableOpacity>
    );
  }}
/>
)}

{showCategoryPicker && (
  <View
    style={{
      position: 'absolute',
      top: 55, 
      left: 10,
      width: 200, 
      backgroundColor: 'rgba(255,255,255,0.95)',
      padding: 10,
      borderRadius: 10,
      zIndex: 999,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    }}
  >
    {[
      { label: 'Coffee Shops', value: 'cafe', icon: 'local-cafe' },
      { label: 'Restaurants', value: 'restaurant', icon: 'restaurant' },
      { label: 'Clothing Stores', value: 'clothing_store', icon: 'store' },
    ].map((cat) => (
      <TouchableOpacity
        key={cat.value}
        onPress={() => {
          setShowCategoryPicker(false);
          handleCategorySelect(cat.value);
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
        }}
      >
      <MaterialIcons name={cat.icon} size={18} color="#800000" style={{ marginRight: 8 }} />
        <Text style={{ fontSize: 14 }}>{cat.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
)}

         {selectedPOI && (
            <TouchableOpacity
               onPress={() => {
               if (showPOIdirections) {
                   handlePOICancel();
                } else {
                  setShowPOIdirections(true);
                }
              }}
              style={[styles.startPOIbutton, { backgroundColor: showPOIdirections ? 'white' : '#800000' }]}
             >
              <Text style={{ color: showPOIdirections ? 'blue' : 'white', fontSize: 16 }}>
              {showPOIdirections ? 'Cancel' : 'Start'}
              </Text>
           </TouchableOpacity>
        )}
        </View>
      ) : (
        <>
          <View
            style={{
              position: 'absolute',
              top: 10,
              left: 50,
              right: 50,
              zIndex: 1000,
              backgroundColor: 'transparent'}}
          >
            {/* Start building search bar */}
            <SearchBar 
              searchText={startQuery}
              placeHolderTxt={"Select Start Building..."}
              searchCallback={handleStartSearch}
              resetCallback={clearOriginSearchBar}
            />

            {/* Destination building search bar */}
            <SearchBar 
              searchText={destinationQuery} 
              placeHolderTxt={"Select Destination Building..."} 
              iconName={"map-marker"}
              iconSize={20}
              iconColor={"red"}
              searchCallback={handleDestinationSearch} 
              resetCallback={clearDestinationSearchBar}
            />

            {/* Start building search results */}
            {filteredStartBuildings.length > 0 && (
              <SearchResults 
                searchableData={filteredStartBuildings}
                screen="outdoor"
                searchCallback={handleOriginSearch}
              />
            )}

            {/* Destination building search results */}
            {filteredDestinationBuildings.length > 0 && (
              <SearchResults 
                searchableData={filteredDestinationBuildings}
                screen="outdoor"
                searchCallback={handleDestinationBuildingSearch}
              />
            )}

            <TouchableOpacity style={styles.useCurrentLocationBtn} onPress={handleUseCurrentLocation}>
              <Text style={styles.useCurrentLocationText}>Use My Location</Text>
            </TouchableOpacity>

            {showBuildingDirections && (
              <TouchableOpacity style={{      
                backgroundColor: '#3498db',
                padding: 10,
                borderRadius: 8,
                alignItems: 'center',
                marginTop: 5}}
              >
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  Show Directions
                </Text>
              </TouchableOpacity>
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
                  right: -15
                },
              ]}
              onPress={handleReturn}
            >
              <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>
                Return
              </Text>
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

     {selectedPOI && (
       <Marker
        coordinate={selectedPOI}
        title="Selected POI"
        description="This is your selected point of interest."
        pinColor="blue" 
      />
    )}

{nearbyPlaces.map((place, index) => (
  <Marker
    key={index}
    coordinate={{
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    }}
    title={place.name}
    description={place.vicinity}
    pinColor="purple"
  />
))}

        {!showDirections && (currentScreen === "Map") &&(
          <ShuttleBusMarker setToggleMapDirections={setToggleMapDirections} setShuttleStop={setShuttleStop} />
        )}  

        {!showDirections && toggleMapDirections && userLocation && shuttleStop && (
          <MapDirections userLocation={userLocation} destinationLocation={shuttleStop} />
        )}

{selectedPOI && userLocation && showPOIdirections &&  (
  <TransitScreen
    showDirections={true}
    routeData={handleDirectionsToMap}
    origin={{
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    }}
    destination={{
      latitude: selectedPOI.latitude,
      longitude: selectedPOI.longitude,
    }}
  />
)}

                  {buildingsData.buildings.map((building, index) => {
                            let polygonFillColor = building.fillColor;
                            if (building === selectedBuilding) polygonFillColor = 'blue';

                      return (
                        <View key={index}>
                          <Polygon
                            key={building.name}
                            coordinates={building.coordinates}
                            fillColor={polygonFillColor}
                            strokeColor={building.strokeColor}
                            strokeWidth={2}
                            tappable
                            geodesic
                            onPress={() => handlePolygonPress(building)} 
                            testID={`polygon-${index}`}
                          />
                          <Marker
                            testID={`polygon-marker-${index}`}
                            zIndex={10}
                            coordinate={building.markerCoord}
                            onPress={() => {handlePolygonPress(building)}} 
                          >
                            <Text note style={{ color: "#800000", fontSize: 10 }}>
                            </Text>
                          </Marker>
                        </View>
                      );
                    })}
        {/* Displays the transit options when any form of directions is requested */}
        <TransitScreen 
          showDirections={(showDirections) ? showDirections : showBuildingDirections} 
          campus={campus} 
          routeData={handleDirectionsToMap} 
          origin={selectedStart} 
          destination={selectedEnd}
          defaultMode={"DRIVING"}
        />

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

      {/* Displays the estimated time until arrivate and distances between an origin and distination */}
      <RouteInfoContainer eta={eta} distance={distance}/>
        
    </View>
  );
};

export default MapScreen;