import { StyleSheet } from 'react-native';

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
    zIndex: 2,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    flexDirection: 'row',
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
    height: '100%', // Slightly reduce map height to accommodate popup
  },
  toggleButtonContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    zIndex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: 250,
    flexWrap: 'wrap'
  },
  sgwButton: {
    backgroundColor: '#800000', 
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  },
  sgwButtonActive: {
    backgroundColor: 'white', 
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 5
  },
  loyolaButton: {
    backgroundColor: '#800000', 
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  },
  loyolaButtonActive: {
    backgroundColor: 'white', 
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 5
  },
  userLocationButton: {
    backgroundColor: '#800000', 
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  },
  userLocationButtonActive: {
    backgroundColor: 'white', 
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 5
  },
  normalText: {
    fontSize: 16,
    color: 'white',
     fontWeight: 'bold'
  },
  highlightedText: {
    fontSize: 16,
    color: 'blue',
     fontWeight: 'bold'
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
    position: 'absolute', 
    bottom: 20, 
    width: '90%',
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#800000',
    padding: 10,
    borderRadius: 10,
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
  modeContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    marginVertical: 10 
  },
  modeButton: { 
    marginHorizontal: 15,
    backgroundColor: '#800000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeText: { 
    fontSize: 16,
    fontWeight: 'medium',
    color: 'white',
  },
  directionsButton: {
    backgroundColor: '#800000',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 5,
    alignItems: 'center', 
    flexDirection: 'row',
    width: 'auto',
  },
  directionsButtonText: {
     color: 'white',
     fontSize: 16,
     fontWeight: 'bold'
  },
  directionsBuildingButton: {
    backgroundColor: '#800000',  
    paddingVertical: 10,          
    paddingHorizontal: 10,        
    borderRadius: 50,            
    alignItems: 'center', 
    flexDirection: 'row',
  },
  directionsBuildingButtonText: {
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

export default styles;
