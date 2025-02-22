import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import ArrivalDisplay from '../shuttle_bus/next_shuttle_arrival';
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

describe('ArrivalDisplay Component', () => {
  const mockStop = {
    from: 'campus 1',
    to: 'campus 2',
    departureTimes: {
      monday_to_thursday: ['5:00 PM', '6:30 PM', '8:15 PM'],
      friday: ['4:00 PM', '5:45 PM', '7:00 PM'],
    },
  };

  const mockDate = new Date('2025-02-07T17:30:00');

  beforeEach(() => {
    global.Date = class extends Date {
      constructor() {
        return mockDate;
      }
      getDay() {
        return mockDate.getDay();
      }
      getHours() {
        return mockDate.getHours();
      }
      getMinutes() {
        return mockDate.getMinutes();
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders weekday schedule correctly', async () => {
    const { getByText } = render(<ArrivalDisplay stop={mockStop} />);
    await waitFor(() => getByText(`${mockStop.from} → ${mockStop.to}`));
    expect(getByText(`${mockStop.from} → ${mockStop.to}`)).toBeTruthy();
    expect(getByText(/Scheduled at/)).toBeTruthy();
    expect(getByText(/Leaving In/)).toBeTruthy();
  });

  test('shows no more buses message when all buses have passed', () => {
    const lateMockDate = new Date('2025-02-09T22:00:00');
    jest.spyOn(global, 'Date').mockImplementation(() => lateMockDate);
    const { getByText } = render(<ArrivalDisplay stop={mockStop} />);
    expect(getByText('No more buses available today.')).toBeTruthy();
  });


});
