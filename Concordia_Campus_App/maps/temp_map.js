import React, { useState, useRef, useEffect, Component  } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Keyboard, FlatList, Button } from 'react-native';
import MapView, { Polygon, Marker, Overlay, Polyline } from 'react-native-maps';
import styles from './styles/mapScreenStyles'; 
import buildingsData from './buildingCoordinates.js';
import { API_KEY } from '@env';
import { getLocation } from './locationUtils';
import Icon from 'react-native-vector-icons/FontAwesome';
import PathOverlay from './PathOverlay.js';
import BuildingOverlay from './BuildingOverlay.js';
import indoorFloorData from './indoorFloorCoordinates.js';

class ErrorBoundary extends Component {
    
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    render() { 
        if (this.state.hasError) {
            console.log(error);
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

    const buildings = [
        {
        names: ['Hall Building'], 
        rooms: ['H-831', 'H-820']
        },
    ]

    //full path example


    const onPressShowPath = () => {
        const floor8 = indoorFloorData.buildings[0]['floor-8'];
        const nodes = Object.keys(floor8).filter(key => key.startsWith('node_'));
        const path = nodes.map(nodeKey => {
          const node = floor8[nodeKey];
          return { latitude: node.latitude, longitude: node.longitude };
        });
        setFullPath(path);
    }

    
    const onPressClearPath = () => {
        setFullPath('');
    }


    //helper for node coordinates
    const handleMapPress = (event) => {
        Keyboard.dismiss();
            
        if (event && event.nativeEvent && event.nativeEvent.coordinate) {
            const { latitude, longitude } = event.nativeEvent.coordinate;
            console.log("Tapped Coordinates:", latitude, longitude);
        }
    };

    const handleStartingSearch = (text) => {
        setSearchStartingText(text);
        if (text) {
            const filtered = buildings.filter(building =>
                building.names.some(name => name.toLowerCase().includes(text.toLowerCase())) ||
                building.rooms.some(room => room.toLowerCase().includes(text.toLowerCase()))
            );
            setFilteredBuildings(filtered);
        } else {
            setFilteredBuildings([]);
        }
    };

    const handleDestinationSearch = (text) => {
        setSearchDestinationText(text);
        if (text) {
            const filtered = buildings.filter(building =>
                building.names.some(name => name.toLowerCase().includes(text.toLowerCase())) ||
                building.rooms.some(room => room.toLowerCase().includes(text.toLowerCase()))
            );
            setFilteredBuildings(filtered);
        } else {
            setFilteredBuildings([]);
        }
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
      let is_inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i].longitude, yi = polygon[i].latitude;
        let xj = polygon[j].longitude, yj = polygon[j].latitude;
        let intersect = ((yi > y) !== (yj > y)) && 
                        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return is_inside;
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
      const location = await getLocation();
      if(location){
        setUserLocation(location);
        setCenterOnUserLocation(true);
        setIsUserLocationFetched(true);
      }
    };
    
    // useEffect(() => {
    //   fetchUserLocation();
    // }, []);
  
    // useEffect(() => {
    //   mapRef.current.animateToRegion({
    //     latitude: campusLocations[campus].latitude,
    //     longitude: campusLocations[campus].longitude,
    //     latitudeDelta: zoomLevel,
    //     longitudeDelta: zoomLevel,
    //   }, 1000);
    // }, [campus, zoomLevel]);
  
    // useEffect(() => {
    //   const addInitialMarkers = async () => {
    //     if (mapRef.current) {
    //       mapRef.current.animateToRegion({
    //         latitude: campusLocations['SGW'].latitude,
    //         longitude: campusLocations['SGW'].longitude,
    //         latitudeDelta: zoomLevel,
    //         longitudeDelta: zoomLevel,
    //       }, 0);
    //       mapRef.current.animateToRegion({
    //         latitude: campusLocations['Loyola'].latitude,
    //         longitude: campusLocations['Loyola'].longitude,
    //         latitudeDelta: zoomLevel,
    //         longitudeDelta: zoomLevel,
    //       }, 0);
    //       const userLocation = await getLocation();
    //       if (userLocation) {
    //         mapRef.current.animateToRegion({
    //           latitude: userLocation.latitude,
    //           longitude: userLocation.longitude,
    //           latitudeDelta: zoomLevel,
    //           longitudeDelta: zoomLevel,
    //         }, 0);
    //       }
    //     }
    //   };
    //   addInitialMarkers();
    // }, []);

    const Item = ({ rooms }) => (
        <View style={styles.item}>
            {rooms.map((room, index) => (
                <Text key={index} style={styles.title}>{room}</Text>
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
                        <TextInput
                            style={style.input}
                            placeholder="Choose starting class"
                            value={searchStartingText}
                            onChangeText={handleStartingSearch}
                        />
                        
                    </View>
                    <View style={style.inputRow}>
                        <View style={style.iconContainer}>
                            <Icon name="map-marker" size={20} color="red" />
                        </View>
                        <TextInput
                            style={style.input}
                            placeholder="Choose destination"
                            value={searchDestinationText}
                            onChangeText={handleDestinationSearch}
                        />
                    </View>

                    {filteredBuildings.length > 0 && (
                        <FlatList
                            style={{ marginTop: 5, width: '100%' }}
                            data={filteredBuildings}
                            renderItem={({ item }) => <Item rooms={item.rooms} />}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    )}
                    
                    <TouchableOpacity onPress={onPressShowPath}>
                        <Text>Show path</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPressClearPath}>
                        <Text>Clear path</Text>
                    </TouchableOpacity>
                </View>
        
       
        {/* <View style={styles.toggleButtonContainer}>
          
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
        </View> */}
    
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
                    //onPress={() => handlePolygonPress(building)}
                    testID={`polygon-${index}`}
                />

                {full_path && building.name === 'Henry F.Hall Building' && (
                    <BuildingOverlay
                    coordinates={building.coordinates}
                    image={require('../assets/floor_plans/Hall-8.png')}
                    />
                )}
                {building.name === 'Henry F.Hall Building' && full_path && <PathOverlay path={full_path} />}
                
                </React.Fragment>
            );
            })}
        </MapView>
        </ErrorBoundary>
      </View>
    );
}

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
  });

export default TempMap;