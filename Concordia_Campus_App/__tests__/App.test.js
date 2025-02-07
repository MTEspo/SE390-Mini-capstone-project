import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  NavigationContainer: ({ children }) => <>{children}</>,
}));

jest.mock('@react-navigation/drawer', () => ({
  ...jest.requireActual('@react-navigation/drawer'),
  createDrawerNavigator: () => ({
    Navigator: ({ children }) => <>{children}</>,
    Screen: ({ children }) => <>{children}</>,
  }),
}));

describe('App Component', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<App />);
    expect(toJSON()).toMatchSnapshot();
  });
});


