import * as Location from 'expo-location';

export const getLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("Permission to access location was denied");
    return null;
  }

  let location = await Location.getCurrentPositionAsync({});
  return location.coords;
};