import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import IndoorMapDirections from '../maps/IndoorMapScreen.js';
import * as locationUtils from '../maps/locationUtils';

jest.mock('react-native-vector-icons/FontAwesome', () => 'FontAwesome');
jest.mock('react-native-vector-icons/FontAwesome5', () => 'FontAwesome5');

jest.mock('react-native-maps-directions', () => {
    const MockMapViewDirections = () => null; 
    return MockMapViewDirections;
});


describe("Indoor Map Directions Tests", () => {    
    beforeEach(() => {
        jest.useFakeTimers();
        jest.spyOn(locationUtils, 'getLocation').mockResolvedValue({coords: { latitude: 10, longitude: 10 }}); 
    });

    afterEach(() => {
        jest.useRealTimers();
    })

    test("it renders correctly", () =>{
        const { getByTestId, getByPlaceholderText } = render(<IndoorMapDirections />);

        const originSB = getByPlaceholderText("Choose starting class");
        const destinationSB = getByPlaceholderText("Choose destination")
        const sgwButton = getByTestId("sgwButton");
        const loyButton = getByTestId("loyolaButton");

        expect(originSB).toBeTruthy();
        expect(destinationSB).toBeTruthy();
        expect(sgwButton).toBeTruthy();
        expect(loyButton).toBeTruthy();

    });

    test("get class in same building", async () => {
        const { findByTestId, findByText } = render(<IndoorMapDirections />);

        await act(async () => {
            // Gets origin class
            const originSB = await findByTestId("test-origin-sb");
            fireEvent(originSB, 'focus');
            fireEvent.changeText(originSB, "H-");
            const hall_110 = await findByText("H-110");
            fireEvent.press(hall_110);

            // Gets destination class
            const destinationSB = await findByTestId("test-destination-sb");
            fireEvent(destinationSB, 'focus');
            fireEvent.changeText(destinationSB, "H");
            const hall_831 = await findByText("H-831");
            fireEvent.press(hall_831);
   
            // Get directions button and wheelchair button
            const directionsBTN = await findByTestId("test-directions");

            expect(directionsBTN).toBeTruthy();
            fireEvent.press(directionsBTN);

            act(() => {
                jest.advanceTimersByTime(1000);
            });

            expect(directionsBTN).toBeTruthy();
        });

    });

    test("get class in different building", async () => {
        const { findByTestId, findByText } = render(<IndoorMapDirections />);

        await act(async () => {
            // Gets origin class
            const originSB = await findByTestId("test-origin-sb");
            fireEvent(originSB, 'focus');
            fireEvent.changeText(originSB, "H-");
            const hall_110 = await findByText("H-110");
            fireEvent.press(hall_110);

            // Gets destination class
            const destinationSB = await findByTestId("test-destination-sb");
            fireEvent(destinationSB, 'focus');
            fireEvent.changeText(destinationSB, "M");
            const mb_1301 = await findByText("MB-1.301");
            fireEvent.press(mb_1301);
        
            // Get directions button and wheelchair button
            const directionsBTN = await findByTestId("test-directions");

            expect(directionsBTN).toBeTruthy();
            fireEvent.press(directionsBTN);

            act(() => {
                jest.advanceTimersByTime(1000); 
            });

            expect(directionsBTN).toBeTruthy();
        });

    });

    test("get class in same building (wheelchair)", async () => {
        const { findByTestId, findByText } = render(<IndoorMapDirections />);

        await act(async () => {
            // Gets origin class
            const originSB = await findByTestId("test-origin-sb");
            fireEvent(originSB, 'focus');
            fireEvent.changeText(originSB, "H-");
            const hall_110 = await findByText("H-110");
            fireEvent.press(hall_110);

            // Gets destination class
            const destinationSB = await findByTestId("test-destination-sb");
            fireEvent(destinationSB, 'focus');
            fireEvent.changeText(destinationSB, "H");
            const hall_831 = await findByText("H-831");
            fireEvent.press(hall_831);
   
            // Get directions button and click on it
            const directionsBTN = await findByTestId("test-directions");

            expect(directionsBTN).toBeTruthy();
            fireEvent.press(directionsBTN);

            act(() => {
                jest.advanceTimersByTime(1000);
            });

            // Get wheelchair button and click on it
            const wheelchairBTN = await findByTestId("wheelchair");
            fireEvent.press(wheelchairBTN);
            expect(wheelchairBTN.props.style.backgroundColor).toBe("green");

            act(() => {
                jest.advanceTimersByTime(1000);
            });

            expect(wheelchairBTN.props.style.backgroundColor).toBe("green");

        });

    });

    test("get class in same building (select different floor)", async () => {
        const { findByTestId, findByText } = render(<IndoorMapDirections />);

        await act(async () => {
            // Gets origin class
            const originSB = await findByTestId("test-origin-sb");
            fireEvent(originSB, 'focus');
            fireEvent.changeText(originSB, "H-");
            const hall_110 = await findByText("H-110");
            fireEvent.press(hall_110);

            // Gets destination class
            const destinationSB = await findByTestId("test-destination-sb");
            fireEvent(destinationSB, 'focus');
            fireEvent.changeText(destinationSB, "H");
            const hall_831 = await findByText("H-831");
            fireEvent.press(hall_831);
   
            // Get directions button click on it
            const directionsBTN = await findByTestId("test-directions");

            expect(directionsBTN).toBeTruthy();
            fireEvent.press(directionsBTN);

            act(() => {
                jest.advanceTimersByTime(1000);
            });

            // Get hall 8th floor button and click on it
            const hall_8th = await findByTestId("test-floor-2");
            expect(hall_8th.props.style.backgroundColor).toBe("#708090");
            fireEvent.press(hall_8th);

            act(() => {
                jest.advanceTimersByTime(1000);
            });

            expect(hall_8th.props.style.backgroundColor).toBe("green");

        });

    });

    test("clear search bars after searching for origin and desitnation", async () => {
        const { findByTestId, findByText } = render(<IndoorMapDirections />);

        await act(async () => {
            // Gets origin class
            const originSB = await findByTestId("test-origin-sb");
            fireEvent(originSB, 'focus');
            fireEvent.changeText(originSB, "H-");
            const hall_110 = await findByText("H-110");
            fireEvent.press(hall_110);

            // Gets destination class
            const destinationSB = await findByTestId("test-destination-sb");
            fireEvent(destinationSB, 'focus');
            fireEvent.changeText(destinationSB, "M");
            const mb_1301 = await findByText("MB-1.301");
            fireEvent.press(mb_1301);
   
            // Get directions button click on it
            const directionsBTN = await findByTestId("test-directions");

            expect(directionsBTN).toBeTruthy();
            fireEvent.press(directionsBTN);

            act(() => {
                jest.advanceTimersByTime(1000);
            });

            // Gets the origin search bar and clears it
            const searchBarOriginClear = await findByTestId("search-exit-5");
            fireEvent.press(searchBarOriginClear);
            expect(originSB.props.value).toBe("");

            // Gets the destination search bar and clears it
            const searchBarDestinationClear = await findByTestId("search-exit-8");
            fireEvent.press(searchBarDestinationClear);
            expect(destinationSB.props.value).toBe("");
        });

    });

    test("press the SGW and LOY buttons", async () => {
        const { findByTestId } = render(<IndoorMapDirections />);

        await act(async () => {
            const sgwButton = await findByTestId("sgwButton");
            const loyButton = await findByTestId("loyolaButton");

            expect(sgwButton.props.style.backgroundColor).toBe("white");
            expect(loyButton.props.style.backgroundColor).toBe("#800000");

            fireEvent.press(loyButton);
            fireEvent.press(loyButton);
            fireEvent.press(sgwButton);
            fireEvent.press(sgwButton);
        });

    });
});