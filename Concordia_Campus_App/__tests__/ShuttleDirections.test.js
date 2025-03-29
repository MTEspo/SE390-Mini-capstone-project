import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import DirectionsDisplay from "../shuttle_bus/shuttle_directions";
import FullShuttleSchedule from "../shuttle_bus/full_schedule";
import * as locationUtils from '../maps/locationUtils';

const selectedMockStop = {"departureTimes": {"friday": ["09:45 AM", "10:00 AM", "10:15 AM", "10:45 AM", "11:15 AM", "11:30 AM", "12:15 PM", "12:30 PM", "12:45 PM", "1:15 PM", "1:45 PM", "2:00 PM", "2:15 PM", "2:45 PM", "3:00 PM", "3:15 PM", "3:45 PM", "4:00 PM", "4:45 PM", "5:15 PM", "5:45 PM", "6:15 PM"], "monday_to_thursday": ["9:30 AM", "09:45 AM", "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM", "11:00 AM", "11:15 AM", "11:30 AM", "12:15 PM", "12:30 PM", "12:45 PM", "1:00 PM", "1:15 PM", "1:30 PM", "1:45 PM", "2:00 PM", "2:15 PM", "2:30 PM", "2:45 PM", "3:00 PM", "3:15 PM", "3:30 PM", "4:00 PM", "4:15 PM", "4:45 PM", "5:00 PM", "5:15 PM", "5:30 PM", "5:45 PM", "6:00 PM", "6:15 PM", "6:30 PM"]}, "from": "SGW Campus", "keyID": 1, "latitude": 45.497163, "longitude": -73.578535, "title": "SGW Shuttle Bus Stop", "to": "Loyola Campus"};

jest.mock("expo-location", () => ({
    requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: "granted"})),
    getCurrentPositionAsync: jest.fn(() => Promise.resolve({coords: {"accuracy": 5, "altitude": 13.06981014194075, "altitudeAccuracy": 30, "heading": -1, "latitude": 45.49539422334427, "longitude": -73.57890936530445, "speed": -1}})),
}));

jest.mock('react-native-maps-directions', () => {
    const MockMapViewDirections = () => null; 
    return MockMapViewDirections;
});

global.fetch = jest.fn(() => 
    Promise.resolve({
      json: () => Promise.resolve([{
        "distance": {
          "text": "0.1 km",
          "value": 0
        },
        "html_instructions": "Head <b>northwest</b> on <b>Street</b> toward <b>Street 2</b>",
      }]),
    })
  );

describe("Bottom Sheet Components for Shuttle Bus tests", () =>{
    beforeEach(() => {
        jest.spyOn(locationUtils, 'getLocation').mockResolvedValue({ latitude: 45.49539422334427, longitude: -73.57890936530445 }); 
    });

    test("it renderes correctly", async () => {
        const { getByText } = await waitFor(() => render(<DirectionsDisplay stop={selectedMockStop} />)); 
        expect(getByText("Directions")).toBeTruthy();
    });

    test("render full schedule", () =>{
        const tree = render(<FullShuttleSchedule />);
        expect(tree).toBeTruthy();
    })
});