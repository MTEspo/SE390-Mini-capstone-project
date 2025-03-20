import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  inputRowFloorButtons: {
    flexDirection: 'row',
    marginTop: 44,
  },
  inputRowFloorButtons2: {
    flexDirection: 'row',
    marginTop: 44,
  },
  inputContainer: {
    position: 'absolute',
    top: 10,
    left: 50,
    right: 50,
    zIndex: 1000,
    backgroundColor: 'transparent',
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
  toggleButtonContainer: {
    top: 5,
    zIndex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: 250,
  },
  wheelchairButton: {
    backgroundColor: '#800000',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  },
  wheelchairButtonActive: {
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
  }
});
