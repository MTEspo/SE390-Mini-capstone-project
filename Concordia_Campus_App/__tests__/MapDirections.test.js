import React from "react";
import { render } from "@testing-library/react-native";
import MapDirections from "../maps/MapDirections";

jest.mock("react-native-maps", () => ({
  Marker: jest.fn().mockImplementation(() => null),
}));

jest.mock("react-native-maps-directions", () => 
  jest.fn().mockImplementation(() => null)
);

const MapViewDirections = require("react-native-maps-directions");
const { Marker } = require("react-native-maps");

describe("MapDirections Component (shows 2 markers and path from marker 1 to marker 2)", () => {
  const mockUserLocation = { latitude: 10, longitude: 10 };
  const mockDestinationLocation = { latitude: 10.1, longitude: 10.1 };

  test("when user location and destination are provided, render Markers and MapViewDirections", () => {
    render(
      <MapDirections userLocation={mockUserLocation} destinationLocation={mockDestinationLocation}/>
    );

    expect(Marker).toHaveBeenCalledWith(
      expect.objectContaining({
        coordinate: mockUserLocation
      }),
      expect.any(Object)
    );
    expect(MapViewDirections).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: mockUserLocation,
        destination: mockDestinationLocation
      }),
      expect.any(Object)
    );

  });

  test("when locations are missing, return null", () => {
    const { toJSON } = render(
      <MapDirections userLocation={null} destinationLocation={null} />
    );
    expect(toJSON()).toBeNull();
  });

});