import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Keyboard, FlatList } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import styles from './styles/mapScreenStyles'; 
import buildingsData from './buildingCoordinates.js';
import { getLocation } from './locationUtils';
import Icon from 'react-native-vector-icons/FontAwesome';
import PathOverlay from './PathOverlay.js';
import BuildingOverlay from './BuildingOverlay.js';
import indoorFloorData from './indoorFloorCoordinates.js';
import {findShortestPath} from './IndoorFloorShortestPathAlgo.js';
import FloorButtons from './FloorButtons.js';
import DirectionsTransitScreen from './DirectionsTransitScreen.js';

const TempMap = () => {
    const [campus, setCampus] = useState('SGW');
    const [zoomLevel, setZoomLevel] = useState(0.005);
    const mapRef = useRef(null);
    const [userLocation, setUserLocation] = useState(null);
    const [centerOnUserLocation, setCenterOnUserLocation] = useState(true);
    const [isUserLocationFetched, setIsUserLocationFetched] = useState(false);
    const [activeButton, setActiveButton] = useState('SGW');

    const [searchStartingText, setSearchStartingText] = useState('');
    const [searchDestinationText, setSearchDestinationText] = useState('');
    const [filteredBuildings, setFilteredBuildings] = useState([]);

    const [startLocation, setStartLocation] = useState('');
    const [destinationLocation, setDestinationLocation] = useState('');
    const [startingFloor, setStartingFloor] = useState('');
    const [destinationFloor, setDestinationFloor] = useState('');
    const [startingRoom, setStartingRoom] = useState('');
    const [destinationRoom, setDestinationRoom] = useState('');

    const [full_path, setFullPath] = useState('');
    const [showPath, setShowPath] = useState(false);
    const pathUpdateInterval = useRef(null);


    const [selectedFloor, setSelectedFloor] = useState(null);

    const [isSelectingStart, setIsSelectingStart] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    

    const buildings = indoorFloorData.buildings.map(building => {
      const rooms = [];   
      Object.keys(building).forEach(key => {
          if (key.startsWith('floor-')) {
              Object.keys(building[key]).forEach(roomKey => {
                  if (!roomKey.startsWith('node_') && 
                      !['escalator_up', 'escalator_down', 'elevator', 'entrance', 'exit', 'building_entrance'].includes(roomKey)) {
                      rooms.push(`${roomKey}`);
                  }
              });
          }
      });
      return {
          names: [building.name],
          rooms: rooms
      };
    });

    const handleSearch = (text, isStarting) => {
      if (isStarting) {
        setSearchStartingText(text);
      } else {
        setSearchDestinationText(text);
      }
      
      if (text) {
        setIsSearching(true);
        const filteredResults = [];
        
        buildings.forEach(building => {
          const matchingRooms = building.rooms.filter(room => 
            room.toLowerCase().includes(text.toLowerCase())
          );
          
          if (matchingRooms.length > 0) {
            filteredResults.push({
              ...building,
              rooms: matchingRooms
            });
          }
        });
        
        buildings.forEach(building => {
          if (building.names.some(name => name.toLowerCase().includes(text.toLowerCase()))) {
            if (!filteredResults.some(result => result.names[0] === building.names[0])) {
              filteredResults.push(building);
            }
          }
        });
        
        setFilteredBuildings(filteredResults);
      } else {
        setIsSearching(false);
        setFilteredBuildings([]);
      }
    };

    const getFloorByRoom = (roomNumber) => {
      for (const building of indoorFloorData.buildings) {
          for (const [floor, rooms] of Object.entries(building)) {
              if (floor.startsWith("floor-") && roomNumber in rooms) {
                  return floor;
              }
          }
      }
      return null;
    };

   
    const onPressShowPath = () => {

      setShowPath(true);
    
      // Clear the previous interval if it exists
      if (pathUpdateInterval.current) {
        clearInterval(pathUpdateInterval.current);
      }
    
      setFullPath([]);
    
      setTimeout(() => {
        const startFloor = startingFloor;
        const endFloor = destinationFloor;
        const floors = Object.keys(indoorFloorData.buildings.find(building => building.name === startLocation)).sort();
        

        const getNumericFloor = (floor) => {
          const match = floor.match(/floor-(\d+)/);
          return match ? parseInt(match[1], 10) : NaN;
        };

        const startFloorNumber = getNumericFloor(startFloor);
        setSelectedFloor(startFloor)
        const endFloorNumber = getNumericFloor(endFloor);

    
        const filteredFloors = floors.filter(floor => {
          const floorNumber = getNumericFloor(floor);
          
          if (startFloorNumber < endFloorNumber) {
            return floorNumber >= startFloorNumber && floorNumber <= endFloorNumber;
          } else {
            return floorNumber <= startFloorNumber && floorNumber >= endFloorNumber;
          }
        }).sort((a, b) => {
          const floorANumber = getNumericFloor(a);
          const floorBNumber = getNumericFloor(b);
          
          if (startFloorNumber < endFloorNumber) {
            return floorANumber - floorBNumber;
          } else {
            return floorBNumber - floorANumber;
          }
        });


        let paths = [];
    
        for (let i = 0; i < filteredFloors.length; i++) {
          const floorNumber = filteredFloors[i];
          const floor = indoorFloorData.buildings.find(building => building.name === startLocation)[floorNumber];
          
          let startNode, endNode;
          
          if (filteredFloors.length === 1) {
            // Classes on same floor
            startNode = startingRoom;
            endNode = destinationRoom;
          } else if (i === 0) {
            // First floor in multi-floor path
            startNode = startingRoom;
            endNode = startFloorNumber > endFloorNumber ? "escalator_down" : "escalator_up";
          } else if (i === filteredFloors.length - 1) {
            // Last floor in multi-floor path
            startNode = startFloorNumber > endFloorNumber ? "exit" : "entrance";
            endNode = destinationRoom;
          } else {
            // Middle floors in multi-floor path
            startNode = startFloorNumber > endFloorNumber ? "exit" : "entrance";
            endNode = startFloorNumber > endFloorNumber ? "escalator_down" : "escalator_up";
          }
        
          const shortestPath = findShortestPath(startNode, endNode, floor);
        
          const pathWithCoordinates = shortestPath
            .map(nodeKey => {
              const node = floor[nodeKey];
              if (node) {
                return {
                  node: nodeKey,
                  latitude: node.latitude,
                  longitude: node.longitude,
                };
              }
              return null;
            })
            .filter(node => node !== null);
        
            paths.push({
              floor: floorNumber,
              coordinates: pathWithCoordinates
            });
        }
    
        //console.log(JSON.stringify(paths, null, 1));
        
        //console.log(paths)
        setFullPath(paths);
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
      setStartingRoom(item.room);
      setStartingFloor(getFloorByRoom(item.room))
      setStartLocation(item.building.names[0]);
      setFilteredBuildings([]);
    };
    
    const handleDestinationSelection = (item) => {
      setSearchDestinationText(item.room);
      setDestinationRoom(item.room);
      setDestinationFloor(getFloorByRoom(item.room))
      setDestinationLocation(item.building.names[0]);
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

    return (
        <View>             
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
                          onChangeText={(text) => handleSearch(text, true)}
                      />
                      {searchStartingText.length > 0 && (
                          <TouchableOpacity onPress={() => {setSearchStartingText(''), setStartLocation(''), onPressClearPath()}}>
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
                            onChangeText={(text) => handleSearch(text, false)}
                        />
                        {searchDestinationText.length > 0 && (
                            <TouchableOpacity onPress={() => {setSearchDestinationText(''), setDestinationLocation(''), onPressClearPath()}}>
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
                    renderItem={({ item, index, separators }) => {
                      const totalItems = filteredBuildings.flatMap(building => 
                        building.rooms.map(room => ({ room, building }))
                      ).length;
                      
                      const showSeparator = totalItems > 1 && index < totalItems - 1;
                      
                      return (
                        <TouchableOpacity 
                          onPress={() => isSelectingStart ? handleStartingSelection(item) : handleDestinationSelection(item)}>
                          <View style={style.item}>
                            <Text style={style.title}>{item.room}</Text>
                          </View>
                          {showSeparator && <View style={style.separator} />}
                        </TouchableOpacity>
                      );
                    }}
                    keyExtractor={(item, index) => `${item.building.names[0]}-${index}`}
                    maxHeight={115}
                  />
                )}
                    
                    {startLocation && destinationLocation && (
                      <TouchableOpacity style={style.pathButton} onPress={onPressShowPath}>
                      <Text style={style.pathButtonText}>Show Directions</Text>
                      </TouchableOpacity>)
                    }

                  <View style={style.toggleButtonContainer}>
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

                  </View>
                </View>
        
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    showsPointsOfInterest={false}
                    onPress={handleMapPress}
                    mapType="standard"
                    showsBuildings={false}
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
                                    fillColor={showPath ? 'transparent' : polygonFillColor}
                                    strokeColor={showPath ? 'transparent' : building.strokeColor}
                                    strokeWidth={2}
                                    testID={`polygon-${index}`}
                                />

                                {startLocation === destinationLocation && building.name === startLocation && showPath && (
                                    <BuildingOverlay
                                        coordinates={building.coordinates}
                                        image={startLocation && selectedFloor ? indoorFloorData.buildings.find(b => b.name === startLocation)?.[selectedFloor]?.imageFloorPath : undefined}

                                    />
                                )}
                                {/* {building.name === "John Molson School of Business" && showPath && (
                                  <BuildingOverlay
                                  coordinates={building.coordinates}
                                  image={require('../assets/floor_plans/MB-1.png')}/>)} */}

                                {full_path && showPath && (
                                    <PathOverlay path={full_path.find(floorData => floorData.floor === selectedFloor)?.coordinates || []} />
                                )}                             
                            </React.Fragment>
                        );
                    })}
                    {showPath && startLocation != destinationLocation && (
                      <DirectionsTransitScreen showDirections={true}
                              location={{"latitude": 45.49704153785414, "longitude": -73.57871974639625}} 
                              destinationLocation={{"latitude": 45.49549607659399, "longitude": -73.57921570098344}}/>
                    )}
                </MapView>
                {full_path && showPath && (
                    <FloorButtons 
                        selectedFloor={selectedFloor} 
                        onFloorSelect={(floor) => setSelectedFloor('floor-' + floor)}
                        startLocation={startLocation}
                    />
                )}             
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
    toggleButtonContainer: {
      top: 5,
      zIndex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      width: 250,
      flexWrap: 'wrap'
    },
});

export default TempMap;