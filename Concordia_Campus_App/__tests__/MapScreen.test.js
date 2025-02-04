import react from "react";
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MapScreen from "../maps/MapScreen";

describe('MapScreen', () => {
    test('shows directions when "Get directions" is pressed', async () => {
        const { getByText } = render(<MapScreen />);
        const directionsButton = getByText('Get directions to Loyola'); 

        fireEvent.press(directionsButton);

        await waitFor(() => {
            expect(getByText(/Distance:/)).toBeTruthy();
            expect(getByText(/ETA:/)).toBeTruthy();
        });
    });
});