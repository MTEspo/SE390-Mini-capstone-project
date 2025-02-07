// styles/popupStyles.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    top: '30%',
    left: '15%',
    right: '15%',
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255,1)', 
    borderRadius: 12, 
    borderWidth: 1,
    borderColor: '#ddd',
    zIndex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 5, 
    right: 10,
    borderRadius: 20,
    padding: 5,
    zIndex: 2, 

  },
  closeButtonText: {
    color: 'rgb(0,0,0)',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  popupTitle: {
    fontSize: 12, 
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,  
    color: '#800000'
  },
  popupText: {
    fontSize: 10, 
    color: '#333',
    lineHeight: 24, 
    textAlign: 'center',
  },
});

export default styles;
