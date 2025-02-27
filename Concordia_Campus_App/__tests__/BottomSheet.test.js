import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import BottomSheetComponent from "../shuttle_bus/bottom_sheet";

const mockSheetChange = (index) => {};
const mockMapDirections = ( state ) => {}

const selectedMockStop = {"departureTimes": {"friday": ["09:45 AM", "10:00 AM", "10:15 AM", "10:45 AM", "11:15 AM", "11:30 AM", "12:15 PM", "12:30 PM", "12:45 PM", "1:15 PM", "1:45 PM", "2:00 PM", "2:15 PM", "2:45 PM", "3:00 PM", "3:15 PM", "3:45 PM", "4:00 PM", "4:45 PM", "5:15 PM", "5:45 PM", "6:15 PM"], "monday_to_thursday": ["9:30 AM", "09:45 AM", "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM", "11:00 AM", "11:15 AM", "11:30 AM", "12:15 PM", "12:30 PM", "12:45 PM", "1:00 PM", "1:15 PM", "1:30 PM", "1:45 PM", "2:00 PM", "2:15 PM", "2:30 PM", "2:45 PM", "3:00 PM", "3:15 PM", "3:30 PM", "4:00 PM", "4:15 PM", "4:45 PM", "5:00 PM", "5:15 PM", "5:30 PM", "5:45 PM", "6:00 PM", "6:15 PM", "6:30 PM"]}, "from": "SGW Campus", "keyID": 1, "latitude": 45.497163, "longitude": -73.578535, "title": "SGW Shuttle Bus Stop", "to": "Loyola Campus"};

jest.mock('@expo/vector-icons/FontAwesome', () => 'Icon');

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
}));

jest.mock('../shuttle_bus/next_shuttle_arrival', () => 'NextArival');

jest.mock("expo-location", () => ({
    requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: "granted"})),
    getCurrentPositionAsync: jest.fn(() => Promise.resolve({coords: {"accuracy": 5, "altitude": 13.06981014194075, "altitudeAccuracy": 30, "heading": -1, "latitude": 45.49539422334427, "longitude": -73.57890936530445, "speed": -1}})),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-maps-directions', () => {
    const MockMapViewDirections = () => null; 
    return MockMapViewDirections;
});

global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(),
    })
);

describe("Bottom Sheet Components for Shuttle Bus tests", () =>{
    
    test("it renderes correctly", () => {
        const { getByText } = render(<BottomSheetComponent selectedStop={selectedMockStop} bottomSheetIndex={0} onSheetChanges={mockSheetChange} toggleMapDirections={mockMapDirections} />);

        expect(getByText("Directions")).toBeTruthy();
        expect(getByText("Next Arrival")).toBeTruthy();
        expect(getByText("SGW Shuttle Bus Stop")).toBeTruthy();
    })

    test("display schedule", async () => {
        const { getByTestId } = render(<BottomSheetComponent selectedStop={selectedMockStop} bottomSheetIndex={0} onSheetChanges={mockSheetChange} toggleMapDirections={mockMapDirections} />);
        const scheduleButton = getByTestId("shuttle-schedule-test");
        await act(() => {
            expect(scheduleButton.props.style.backgroundColor).toBe("#ECF3FE");  
            fireEvent.press(scheduleButton);
        })

        expect(scheduleButton.props.style.backgroundColor).toBe("#367AE4"); 

    })

    test("display directions", async () => {
        const { getByTestId } = render(<BottomSheetComponent selectedStop={selectedMockStop} bottomSheetIndex={0} onSheetChanges={mockSheetChange} toggleMapDirections={mockMapDirections} />);
        const directionsButton = getByTestId("shuttle-directions-test");
        await act(() => {
            expect(directionsButton.props.style.backgroundColor).toBe("#ECF3FE");  
            fireEvent.press(directionsButton);   

        })

        expect(directionsButton.props.style.backgroundColor).toBe("#367AE4"); 

    })
});

