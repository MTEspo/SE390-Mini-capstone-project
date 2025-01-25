import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders correctly', () => {
    const tree = render(<App />);
    expect(tree).toMatchSnapshot();
  });

  it('displays the correct text', () => {
    const { getByText } = render(<App />);
    const textElement = getByText('Open up App.js to start working on your app!');
    expect(textElement).toBeTruthy();
  });
});