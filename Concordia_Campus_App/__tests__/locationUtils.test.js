import { getLocation } from "../maps/locationUtils";
import * as Location from "expo-location";

jest.mock("expo-location", () => ({
    requestForegroundPermissionsAsync: jest.fn(),
    getCurrentPositionAsync: jest.fn(),
  }));
  
  describe("getLocation", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test("returns location coordinates when permission is granted", async () => {
      Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: "granted" });
      Location.getCurrentPositionAsync.mockResolvedValue({coords: { latitude: 10, longitude: 10 }});
  
      const location = await getLocation();
  
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
      expect(location).toEqual({ latitude: 10, longitude: 10 });
    });
  
    test("returns null when permission is denied", async () => {
      Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: "denied" });
  
      const location = await getLocation();
  
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
      expect(location).toBeNull();
    });
  });