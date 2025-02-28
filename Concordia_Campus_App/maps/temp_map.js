import React, { useState, useRef, useEffect, Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Keyboard, FlatList } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import styles from './styles/mapScreenStyles'; 
import buildingsData from './buildingCoordinates.js';
import { API_KEY } from '@env';
import { getLocation } from './locationUtils';
import Icon from 'react-native-vector-icons/FontAwesome';
import PathOverlay from './PathOverlay.js';
import BuildingOverlay from './BuildingOverlay.js';
import indoorFloorData from './indoorFloorCoordinates.js';
import {findShortestPath} from './IndoorFloorShortestPathAlgo.js';
import FloorButtons from './FloorButtons.js';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({ hasError: true });
        console.log(error, errorInfo);
    }
    render() { 
        if (this.state.hasError) {
            return <Text style={styles.errorText}>Something went wrong.</Text>;
        }
        return this.props.children;
    }
}

const TempMap = () => {
    const [campus, setCampus] = useState('SGW');
    const [zoomLevel, setZoomLevel] = useState(0.005);
    const mapRef = useRef(null);
    const [userLocation, setUserLocation] = useState(null);
    const [centerOnUserLocation, setCenterOnUserLocation] = useState(true);
    const [isUserLocationFetched, setIsUserLocationFetched] = useState(false);
    const [activeButton, setActiveButton] = useState('user');

    const [searchStartingText, setSearchStartingText] = useState('');
    const [searchDestinationText, setSearchDestinationText] = useState('');
    const [filteredBuildings, setFilteredBuildings] = useState([]);
    const [startLocation, setStartLocation] = useState('');
    const [destinationLocation, setDestinationLocation] = useState('');
    const [full_path, setFullPath] = useState('');
    const [showPath, setShowPath] = useState(false);
    const pathUpdateInterval = useRef(null);


    const [selectedFloor, setSelectedFloor] = useState(null);
    const floorImages = {
      1: require('../assets/floor_plans/Hall-1.png'),
      2: require('../assets/floor_plans/Hall-2.png'),
      8: require('../assets/floor_plans/Hall-8.png'),
      9: require('../assets/floor_plans/Hall-9.png'),
    };

    const [isSelectingStart, setIsSelectingStart] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const buildings = [
        {
            names: ['Hall Building'], 
            rooms: ['H-831', 'H-820', 'H-833', 'H-843']
        },
    ];

    const handleStartingSearch = (text) => {
      setSearchStartingText(text);
      if (text) {
          setIsSearching(true);
          const filtered = buildings.filter(building =>
              building.names.some(name => name.toLowerCase().includes(text.toLowerCase())) ||
              building.rooms.some(room => room.toLowerCase().includes(text.toLowerCase()))
          );
          setFilteredBuildings(filtered);
      } else {
          setIsSearching(false);
          setFilteredBuildings([]);
      }
    };

    const handleDestinationSearch = (text) => {
      setSearchDestinationText(text);
      if (text) {
          setIsSearching(true);
          const filtered = buildings.filter(building =>
              building.names.some(name => name.toLowerCase().includes(text.toLowerCase())) ||
              building.rooms.some(room => room.toLowerCase().includes(text.toLowerCase()))
          );
          setFilteredBuildings(filtered);
      } else {
          setIsSearching(false);
          setFilteredBuildings([]);
      }
    };

    const onPressShowPath = () => {
      // if (!startLocation || !destinationLocation) {
      //     console.warn("Both starting location and destination must be selected");
      //     return;
      // }
      
      setShowPath(true);
      
      // Clear the previous interval if it exists
      if (pathUpdateInterval.current) {
          clearInterval(pathUpdateInterval.current);
      }
  
      // First show the overlay without the path
      setFullPath([]);
      
      // Then wait 1 second before drawing the path (to prevent any inconsistencies where the image overlay would overlap the polyline)
      setTimeout(() => {
          const floor8 = indoorFloorData.buildings[0]['floor-8'];
          const shortestPath = findShortestPath("820", "831", floor8);
          
          const pathWithCoordinates = shortestPath.map(nodeKey => {
              const node = floor8[nodeKey];
              if (node) {
                  return {
                      latitude: node.latitude,
                      longitude: node.longitude
                  };
              }
              return null;
          }).filter(node => node !== null);
          
          setFullPath(pathWithCoordinates);
      }, 1000);
  };
    
    // useEffect(() => {
    //     fetchUserLocation();
    // }, []);

    useEffect(() => {
        if (mapRef.current && campus) {
            mapRef.current.animateToRegion({
                latitude: campusLocations[campus].latitude,
                longitude: campusLocations[campus].longitude,
                latitudeDelta: zoomLevel,
                longitudeDelta: zoomLevel,
            }, 1000);
        }
    }, [campus, zoomLevel]);

    useEffect(() => {
        return () => {
            if (pathUpdateInterval.current) {
                clearInterval(pathUpdateInterval.current);
            }
        };
    }, []);

    const onPressClearPath = () => {
        setFullPath('');
        if (pathUpdateInterval.current) {
            clearInterval(pathUpdateInterval.current);
        }
        setShowPath(false);
    };

    //helper for node coordinates (used when setting up path config file)
    const handleMapPress = (event) => {
        Keyboard.dismiss();
        setIsSearching(false);
        if (event && event.nativeEvent && event.nativeEvent.coordinate) {
            const { latitude, longitude } = event.nativeEvent.coordinate;
            console.log("Tapped Coordinates:", latitude, longitude);
        }
    };

    const handleStartingSelection = (item) => {
      setSearchStartingText(item.room);
      setStartLocation(item.building);
      setFilteredBuildings([]);
    };

    const handleDestinationSelection = (item) => {
      setSearchDestinationText(item.room);
      setDestinationLocation(item.building);
      setFilteredBuildings([]);
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
            setCampus('SGW');
            setCenterOnUserLocation(false);
            setActiveButton('SGW');
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
            setCampus('Loyola');
            setCenterOnUserLocation(false);
            setActiveButton('Loyola');
        }
    };
    
    const handleUserLocation = () => {
        if (!userLocation) {
            fetchUserLocation();
            return;
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
        setActiveButton('user');
    };
    
    const fetchUserLocation = async () => {
        try {
            const location = await getLocation();
            if(location){
                setUserLocation(location);
                setCenterOnUserLocation(true);
                setIsUserLocationFetched(true);
            }
        } catch (error) {
            console.error("Error fetching location:", error);
            // Maybe show a user-friendly error message
        }
    };

    const Item = ({ rooms }) => (
        <View style={[style.item, { backgroundColor: 'white' }]}>
            {rooms.map((room, index) => (
                <Text key={index} style={style.title}>{room}</Text>
            ))}
        </View>
    );

    return (
        <View>
            <ErrorBoundary>
                <View style={style.inputContainer}>
                <View style={style.inputRow}>
                  <View style={style.iconContainer}>
                      <View style={style.iconDot} />
                      <View style={style.iconDots} />
                  </View>
                  <View style={style.textInputWrapper}>
                      <TextInput
                          style={style.input}
                          placeholder="Choose starting class"
                          value={searchStartingText}
                          onFocus={() => setIsSelectingStart(true)}
                          onChangeText={handleStartingSearch}
                      />
                      {searchStartingText.length > 0 && (
                          <TouchableOpacity onPress={() => setSearchStartingText('')}>
                              <Icon name="times-circle" size={18} color="gray" />
                          </TouchableOpacity>
                      )}
                  </View>
                </View>

                <View style={style.inputRow}>
                    <View style={style.iconContainer}>
                        <Icon name="map-marker" size={20} color="red" />
                    </View>
                    <View style={style.textInputWrapper}>
                        <TextInput
                            style={style.input}
                            placeholder="Choose destination"
                            value={searchDestinationText}
                            onFocus={() => setIsSelectingStart(false)}
                            onChangeText={handleDestinationSearch}
                        />
                        {searchDestinationText.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchDestinationText('')}>
                                <Icon name="times-circle" size={18} color="gray" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                    {isSearching && filteredBuildings.length > 0 && (
                          <FlatList
                              style={{ marginTop: 5, width: '100%', backgroundColor: 'white', borderRadius: 8 }}
                              data={filteredBuildings.flatMap(building => 
                                  building.rooms.map(room => ({ room, building }))
                              )}
                              renderItem={({ item }) => (
                                <TouchableOpacity 
                                onPress={() => isSelectingStart ? handleStartingSelection(item) : handleDestinationSelection(item)}>
                                      <View style={style.item}>
                                          <Text style={style.title}>{item.room}</Text>
                                      </View>
                                      <View style={style.separator} />
                                  </TouchableOpacity>
                              )}
                              keyExtractor={(item, index) => `${item.building.names[0]}-${index}`}
                              maxHeight={115}
                          />
                      )}
                    
                    <TouchableOpacity style={style.pathButton} onPress={onPressShowPath}>
                        <Text style={style.pathButtonText}>Show Directions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[style.pathButton, {backgroundColor: '#e74c3c'}]} onPress={onPressClearPath}>
                        <Text style={style.pathButtonText}>Clear Directions</Text>
                    </TouchableOpacity>

                    <FloorButtons onFloorSelect={(floor) => setSelectedFloor(floor)} />
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
                    <Marker key={"sgw"} coordinate={campusLocations['SGW']} title={campusLocations['SGW'].title} description={campusLocations['SGW'].description} />
                    <Marker key={"loy"} coordinate={campusLocations['Loyola']} title={campusLocations['Loyola'].title} description={campusLocations['Loyola'].description} />
            
                    {isUserLocationFetched && userLocation && (
                        <Marker
                            coordinate={{
                                latitude: userLocation.latitude,
                                longitude: userLocation.longitude,
                            }}
                            pinColor="green"
                            title="Your Location"
                        />
                    )}
                
                    {buildingsData.buildings.map((building, index) => {
                        const polygonFillColor = building.fillColor;

                        return (
                            <React.Fragment key={index}> 
                                <Polygon
                                    key={`polygon-${index}`}
                                    coordinates={building.coordinates}
                                    fillColor={polygonFillColor}
                                    strokeColor={building.strokeColor}
                                    strokeWidth={2}
                                    testID={`polygon-${index}`}
                                />

                                {/* {building.name === 'Henry F.Hall Building' && showPath && (
                                    <BuildingOverlay
                                        coordinates={building.coordinates}
                                        image={require('../assets/floor_plans/Hall-8.png')}
                                    />
                                )} */}

                                {building.name === 'Henry F.Hall Building' && (
                                    <BuildingOverlay
                                        coordinates={building.coordinates}
                                        image={floorImages[selectedFloor]}
                                    />
                                )}

                                {full_path && showPath && (
                                    <PathOverlay path={full_path} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </MapView>
            </ErrorBoundary>
        </View>
    );
};

const style = StyleSheet.create({
    inputContainer: {
        position: 'absolute',
        top: 20,
        left: 50,
        right: 50,
        zIndex: 1000,
        backgroundColor: 'transparent',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconContainer: {
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'black',
    },
    iconDots: {
        width: 2,
        height: 10,
        backgroundColor: 'gray',
        marginVertical: 2,
    },
    input: {
        flex: 1,
        height: 30,
        paddingHorizontal: 10,
      },
      textInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    pathButton: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
        alignItems: 'center',
    },
    pathButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    title: {
      fontSize: 10,
      fontWeight: '500',
    },
    item: {
      padding: 15,
      paddingBottom: 15,
    },
    separator: {
      height: 1,
      backgroundColor: 'black',
      marginHorizontal: 10,
    },
});

export default TempMap;