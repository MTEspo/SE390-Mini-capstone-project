import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Keyboard} from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import styles from './styles/mapScreenStyles.js'; 
import buildingsData from './buildingCoordinates.js';
import { getLocation } from './locationUtils.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import PathOverlay from './PathOverlay.js';
import BuildingOverlay from './BuildingOverlay.js';
import indoorFloorData from './indoorFloorCoordinates.js';
import {findShortestPath} from './IndoorFloorShortestPathAlgo.js';
import FloorButtons from './FloorButtons.js';
import SearchBar from '../utilities/SearchBar.js';
import SearchResults from '../utilities/SearchResults.js';
import TransitScreen from './transitOptions.js';
import { style } from './styles/indoorMapScreenStyles.js';

const IndoorMapDirections = () => {
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
    const [secondPath, setSecondPath] = useState('');
    const [showPath, setShowPath] = useState(false);
    const pathUpdateInterval = useRef(null);


    const [selectedFloor, setSelectedFloor] = useState(null);
    const [selectedFloor2, setSelectedFloor2] = useState(null);

    const [isSelectingStart, setIsSelectingStart] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [wheelChairToggle, setWheelChairToggle] = useState(false);

    const [eta, setEta] = useState(null);
    const [distance, setDistance] = useState(null);
  

    const buildings = indoorFloorData.buildings.map(building => {
      const rooms = [];   
      Object.keys(building).forEach(key => {
          if (key.startsWith('floor-')) {
              Object.keys(building[key]).forEach(roomKey => {
                  if (!roomKey.startsWith('node_') && 
                      !['escalator_up', 'escalator_down', 'elevator', 'entrance', 'exit', 'building_entrance', 'imageFloorPath'].includes(roomKey)) {
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

   
    const handleSameBuildingPath =  (startBuilding, startFloor, endFloor, endpoint,counter) => {
      let stRoom = startingRoom
      let dstRoom = destinationRoom
      let up = "escalator_up"
      let down = "escalator_down"
      let exit = "exit";
      let entrance = "entrance"
      if(endpoint != null){
        if(counter == 1){
          dstRoom = endpoint
        }
        else{
          stRoom = endpoint
        }
      }

      if(wheelChairToggle){
        exit = entrance = up = down = "elevator"
      }


      const floors = Object.keys(indoorFloorData.buildings.find(building => building.name === startBuilding)).sort();
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
        const floor = indoorFloorData.buildings.find(building => building.name === startBuilding)[floorNumber];
    
        let startNode, endNode;
    
        if (filteredFloors.length === 1) {
          // Classes on same floor
          startNode = stRoom;
          endNode = dstRoom;
        } else if (i === 0) {
          // First floor in multi-floor path
          startNode = stRoom;
          endNode = startFloorNumber > endFloorNumber ? down : up;
        } else if (i === filteredFloors.length - 1) {
          // Last floor in multi-floor path
          startNode = startFloorNumber > endFloorNumber ? exit : entrance;
          endNode = dstRoom;
        } else {
          // Middle floors in multi-floor path
          startNode = startFloorNumber > endFloorNumber ? exit  : entrance;
          endNode = startFloorNumber > endFloorNumber ? down : up;
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
      return paths;
    };
    
    const onPressShowPath = () => {
     
      setShowPath(true);
    
      // Clear the previous interval if it exists
      if (pathUpdateInterval.current) {
        clearInterval(pathUpdateInterval.current);
      }
    
      setFullPath([]);
      setSecondPath([]);
    
      const startBuilding = startLocation;
      const endBuilding = destinationLocation;
    
      if (startBuilding === endBuilding) {
        setTimeout(() => {
          const paths =  handleSameBuildingPath(startBuilding, startingFloor, destinationFloor, null);
          setFullPath(paths);
          setSelectedFloor(startingFloor)
        }, 1000);
      } else {
        setTimeout(() => {
          const paths1 = handleSameBuildingPath(startBuilding, startingFloor, "floor-1", "building_entrance",1);
          setFullPath(paths1);          
          
          const paths2 =  handleSameBuildingPath(endBuilding, "floor-1", destinationFloor,"building_entrance",2);
          setSecondPath(paths2);
          setSelectedFloor(startingFloor)
          setSelectedFloor2(destinationFloor)
        }, 1000);
      }

      mapRef.current?.animateToRegion({
        latitude: indoorFloorData.buildings.find(b => b.name === startLocation)?.["floor-1"]?.building_entrance.latitude,
        longitude: indoorFloorData.buildings.find(b => b.name === startLocation)?.["floor-1"]?.building_entrance.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      }, 1000);
    };

    useEffect(() => {
        if(showPath){
          onPressShowPath();
        }
    }, [wheelChairToggle]);
      
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

    // Resets the start class search bar 
    const resetStartingSearchBar = () => {
      setSearchStartingText('');
      setStartLocation('');
      onPressClearPath();
    }

    // Resets the destination class search bar 
    const resetDestinationSearchBar = () => {
      setSearchDestinationText('');
      setDestinationLocation('');
      onPressClearPath();
    }

    // Gets route data of outdoor directions
    const handleRouteData  = (eta, distance) => {
      setEta(eta);
      setDistance(distance);
    }
  

    return (
        <View style={{alignItems: 'center'}}>             
                <View style={style.inputContainer}>
                  {/* Searchbar for start class */}
                  <SearchBar 
                    searchText={searchStartingText} 
                    isOrigin={true} 
                    placeHolderTxt={"Choose starting class"}
                    iconName={"map-pin"}
                    iconSize={20}
                    iconColor={"green"}
                    searchCallback={handleSearch} 
                    startingCallback={setIsSelectingStart} 
                    resetCallback={resetStartingSearchBar}
                  />

                {full_path && showPath && (
                  <View style={style.inputRowFloorButtons}>
                        <FloorButtons 
                            selectedFloor={selectedFloor} 
                            onFloorSelect={(floor) => setSelectedFloor('floor-' + floor)}
                            startLocation={startLocation}
                        />
                  </View>
                )}

                  {/* Searchbar for destination class */}
                  <SearchBar 
                    searchText={searchDestinationText} 
                    isOrigin={false} 
                    placeHolderTxt={"Choose destination"} 
                    iconName={"map-pin"}
                    iconSize={20}
                    iconColor={"black"}
                    searchCallback={handleSearch} 
                    startingCallback={setIsSelectingStart} 
                    resetCallback={resetDestinationSearchBar}
                  />
                
                {full_path && showPath && startLocation != destinationLocation &&(
                <View style={style.inputRowFloorButtons2}>
                  {startLocation != destinationLocation && secondPath != [] && showPath && (
                      <FloorButtons 
                          selectedFloor={selectedFloor2} 
                          onFloorSelect={(floor) => setSelectedFloor2('floor-' + floor)}
                          startLocation={destinationLocation}
                      />
                  )} 
                </View>)}

                {isSearching && filteredBuildings.length > 0 && (
                  <SearchResults 
                    searchableData={filteredBuildings} 
                    isOrigin={isSelectingStart} 
                    handleOriginCallback={handleStartingSelection} 
                    handleDestinationCallback={handleDestinationSelection}
                    screen={"indoor"}
                  />
                )}
                    
                    {startLocation && destinationLocation && !showPath && (
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

                          {showPath && (
                          <TouchableOpacity
                            style={{
                              backgroundColor: wheelChairToggle ? 'green' : '#800000',
                              borderRadius: 10,
                              paddingVertical: 8,
                              paddingHorizontal: 15,
                              width: 'auto',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderWidth: 1,
                              borderColor: 'black',
                              marginRight: 5,
                              marginBottom: 6
                            }}
                            onPress={() => {
                              setWheelChairToggle(prev => !prev);
                            }}
                            testID="sgwButton"
                          >
                            <Icon name="wheelchair" size={19} color="white" />
                          </TouchableOpacity>
                        )}

                  </View>
                </View>
        
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    showsPointsOfInterest={false}
                    onPress={handleMapPress}
                    pitchEnabled={false}
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

                                {startLocation != destinationLocation && building.name === startLocation && showPath && (
                                    <BuildingOverlay
                                        coordinates={building.coordinates}
                                        image={startLocation && selectedFloor ? indoorFloorData.buildings.find(b => b.name === startLocation)?.[selectedFloor]?.imageFloorPath : undefined}

                                    />
                                )}

                                {startLocation != destinationLocation && building.name === destinationLocation && showPath && (
                                    <BuildingOverlay
                                        coordinates={building.coordinates}
                                        image={startLocation && selectedFloor2 ? indoorFloorData.buildings.find(b => b.name === destinationLocation)?.[selectedFloor2]?.imageFloorPath : undefined}

                                    />
                                )}

                                {full_path && showPath && (
                                    <PathOverlay path={full_path.find(floorData => floorData.floor === selectedFloor)?.coordinates || []} />
                                )}  
                                {secondPath && showPath && (
                                    <PathOverlay path={secondPath.find(floorData => floorData.floor === selectedFloor2)?.coordinates || []} />
                                )}                             
                            </React.Fragment>
                        );
                    })}
                    {showPath && startLocation != destinationLocation && (
                      <TransitScreen 
                        showDirections={true} 
                        origin={indoorFloorData.buildings.find(building => building.name == startLocation )["floor-1"]["building_entrance"]}
                        destination={indoorFloorData.buildings.find(building => building.name == destinationLocation )["floor-1"]["building_entrance"]}
                        routeData={handleRouteData}
                        strokeWidth={1}
                        defaultMode={"WALKING"}
                      />
                    )}
                </MapView>       

                {showPath && startLocation != destinationLocation && (
                  <RouteInfoContainer eta={eta} distance={distance}/>
                )}
        </View>
    );
};

export default IndoorMapDirections;