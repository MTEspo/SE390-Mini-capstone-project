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
    height: '75%', // Slightly reduce map height to accommodate popup
  },
  toggleButtonContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#800000', 
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  highlightedText: {
    color: 'white',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  normalText: {
    color: 'grey',
  },
  zoomButtonContainer: {
    position: 'absolute',
    bottom: 200,
    right: 10,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  zoomButton: {
    backgroundColor: 'white', 
    borderRadius: 5,
    width: 42,  
    height: 42, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0, 
    borderWidth: 1, 
    borderColor: 'black', 
  },
  zoomButtonText: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#800000', 
  },
});

export default styles;
