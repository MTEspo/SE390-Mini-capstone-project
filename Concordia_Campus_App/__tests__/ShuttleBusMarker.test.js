jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  }));

import React from 'react';
import { render, act, fireEvent, waitFor, screen } from '@testing-library/react-native';
import ShuttleBusMarker from '../maps/ShuttleBusMarker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

jest.mock('react-native-maps', () => ({
  Marker: 'Marker',
  Callout: 'Callout'
}));

jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

jest.mock('../maps/shuttleBusInfo.js', () => ([
  {
    keyID: '1',
    latitude: 45.123,
    longitude: -73.456,
    title: 'Test Stop 1'
  },
  {
    keyID: '2',
    latitude: 45.789,
    longitude: -73.012,
    title: 'Test Stop 2'
  }
]));

jest.mock('../shuttle_bus/bottom_sheet', () => 'BottomSheetComponent');

jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage');

describe('ShuttleBusMarker', () => {
  const mockSetToggleMapDirections = jest.fn();
  const mockSetShuttleStop = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() => 
      Promise.resolve({
        headers: {
          get: () => 'test-cookie'
        }
      })
    );
  });

  it('renders all shuttle stop markers', () => {
    const { getAllByText } = render(
      <ShuttleBusMarker 
        setToggleMapDirections={mockSetToggleMapDirections}
        setShuttleStop={mockSetShuttleStop}
      />
    );
    
    expect(getAllByText('Test Stop 1')).toBeTruthy();
    expect(getAllByText('Test Stop 2')).toBeTruthy();
  });

  it('stores cookie from initial fetch', async () => {
    render(
      <ShuttleBusMarker 
        setToggleMapDirections={mockSetToggleMapDirections}
        setShuttleStop={mockSetShuttleStop}
      />
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('cookie', 'test-cookie');
    });
  });

  it('handles marker press correctly', async () => {
    const mockShuttleData = {
      data: {
        d: {
          Points: [
            { ID: 'BUS1', Latitude: 45.123, Longitude: -73.456 }
          ]
        }
      }
    };

    axios.post.mockResolvedValueOnce(mockShuttleData);
    AsyncStorage.getItem.mockResolvedValueOnce('test-cookie');

    const { getByTestId } = render(
      <ShuttleBusMarker 
        setToggleMapDirections={mockSetToggleMapDirections}
        setShuttleStop={mockSetShuttleStop}
      />
    );

    const firstMarker = getByTestId('shuttle-stop-1');
    
    await act(async () => {
      fireEvent.press(firstMarker);
    });

    await waitFor(() => {
      expect(mockSetShuttleStop).toHaveBeenCalledWith(expect.objectContaining({
        keyID: '1',
        title: 'Test Stop 1'
      }));
    });
  });

  it('renders bus markers when shuttle marker pressed', async () => {
    const mockShuttleData = {
      d: {
        Points: [
          { ID: 'BUS1', Latitude: 45.123, Longitude: -73.456 },
          { ID: 'BUS2', Latitude: 45.789, Longitude: -73.012 }
        ]
      }
    };
  
    AsyncStorage.getItem.mockResolvedValue('test-cookie');
    axios.post.mockResolvedValue({ data: mockShuttleData });
  
    const { getByTestId } = render(
      <ShuttleBusMarker 
        setToggleMapDirections={mockSetToggleMapDirections}
        setShuttleStop={mockSetShuttleStop}
      />
    );

    const firstMarker = getByTestId('shuttle-stop-1');
    
    await act(async () => {
      fireEvent.press(firstMarker);
    });
  
    await waitFor(async () => {
        const busMarker1 = await screen.findByTestId('bus-marker-BUS1');
        const busMarker2 = await screen.findByTestId('bus-marker-BUS2');
        expect(busMarker1).toBeTruthy();
        expect(busMarker2).toBeTruthy();
      }, { timeout: 3000 });
  });

  it('handles bottom sheet changes correctly', () => {
    const { getByTestId } = render(
      <ShuttleBusMarker 
        setToggleMapDirections={mockSetToggleMapDirections}
        setShuttleStop={mockSetShuttleStop}
      />
    );

    const bottomSheet = getByTestId('bottom-sheet-component');
    
    act(() => {
      fireEvent(bottomSheet, 'onSheetChanges', -1);
    });

    expect(mockSetShuttleStop).toHaveBeenCalledWith(null);
  });

});