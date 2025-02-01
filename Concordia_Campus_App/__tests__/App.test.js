import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App, { HomeScreen } from '../App';
jest.mock('form-data', () => {
  return class FormData {
    append() {}
    get() {}
    getAll() {}
    has() {}
    set() {}
    delete() {}
    keys() {}
    values() {}
    entries() {}
    forEach() {}
  };
});
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

  it('displays the expected text on HomeScreen', async () => {
    const { getAllByText } = render(<HomeScreen />);
    
    await waitFor(() => getAllByText('Open up App.js to start working on your app!'), { timeout: 2000 });
  
    const textElements = getAllByText('Open up App.js to start working on your app!');
    expect(textElements).toHaveLength(1);
  });
});

