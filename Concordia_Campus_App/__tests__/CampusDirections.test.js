import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import MapScreen from '../maps/MapScreen';
import * as locationUtils from '../maps/locationUtils';


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

jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');
jest.mock('react-native-vector-icons/FontAwesome5', () => 'FontAwesome5');

describe("Tests to get directions between campuses", () => {
    beforeEach(() => {
        getLocationSpy = jest.spyOn(locationUtils, 'getLocation')
                            .mockResolvedValue({coords: { latitude: 10, longitude: 10 }}); 
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("Get directions between campuses", () =>{
        const { getByText, getByTestId } = render(<MapScreen route={{params: "test"}}/>);
        const sgwButton = getByTestId("sgwButton");

        act(() =>{
            fireEvent.press(sgwButton);
        });

        expect(sgwButton.props.style.backgroundColor).toBe("white");

        act(() => {
            fireEvent.press(getByTestId("directions-button"));
        });

        expect(getByText("Cancel Directions")).toBeTruthy();
    })
})