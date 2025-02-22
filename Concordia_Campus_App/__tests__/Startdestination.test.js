
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import * as locationUtils from '../maps/locationUtils';
import buildingsData from '../maps/buildingCoordinates';
import BuildingDirectionsMapScreen from '../maps/BuildingDirectionsMapScreen';
describe('BuildingDirectionsMapScreen - Start and Destination Selection', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('displays "Get Directions" button when both start and destination buildings are selected', async () => {

    const startBuildingName = 'John Molson School of Business';
    const destinationBuildingName = 'Faubourg Tower';

    const { getByPlaceholderText, getByText } = render(<BuildingDirectionsMapScreen />);

    
    const startInput = getByPlaceholderText('Select Start Building...');
    fireEvent.changeText(startInput, startBuildingName);
    
    const startResult = await waitFor(() => getByText(startBuildingName));
    fireEvent.press(startResult);

    //Select the Destination building
    const destinationInput = getByPlaceholderText('Select Destination Building...');
    fireEvent.changeText(destinationInput, destinationBuildingName);
    const destinationResult = await waitFor(() => getByText(destinationBuildingName));
    fireEvent.press(destinationResult);

    //Verify that the "Get Directions" button appears
    const getDirectionsButton = await waitFor(() => getByText('Get Directions'));
    expect(getDirectionsButton).toBeTruthy();
  });

  it('sets the current building as start when "Use My Current Location" is pressed', async () => {
    // Find the "John Molson School of Business" building from the data.
    const johnMolsonBuilding = buildingsData.buildings.find(
      (b) => b.name === 'John Molson School of Business'
    );
    
    const simulatedLocation = {
      latitude: johnMolsonBuilding.markerCoord.latitude,
      longitude: johnMolsonBuilding.markerCoord.longitude,
    };

    
    const getLocationSpy = jest
      .spyOn(locationUtils, 'getLocation')
      .mockResolvedValue(simulatedLocation);

    const { getByText, getByDisplayValue } = render(<BuildingDirectionsMapScreen />);

    // Press the "Use My Current Location" button.
    const useMyLocationButton = getByText('Use My Current Location');
    fireEvent.press(useMyLocationButton);

    // Verify that the Start input is updated with "John Molson School of Business"
    const startInput = await waitFor(() =>
      getByDisplayValue('John Molson School of Business')
    );
    expect(startInput).toBeTruthy();
    expect(getLocationSpy).toHaveBeenCalled();
  });
});
