import { renderHook, act } from '@testing-library/react-native';
import { useState } from 'react';

const useTestHook = () => {
  const [showDirections, setShowDirections] = useState(false);
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const [showBuildingDirections, setShowBuildingDirections] = useState(false);

  const handleCampusDirections = () => {
    setShowDirections(true);  
    setSelectedStart(null);
    setSelectedEnd(null);
    setShowBuildingDirections(false);
  };

  return {
    showDirections,
    selectedStart,
    selectedEnd,
    showBuildingDirections,
    handleCampusDirections,
  };
};

describe('handleCampusDirections', () => {
  it('should show directions when "Get directions" button is pressed', () => {
    const { result } = renderHook(() => useTestHook());


    act(() => {
      result.current.handleCampusDirections();
    });

    expect(result.current.showDirections).toBe(true);
    expect(result.current.selectedStart).toBe(null);
    expect(result.current.selectedEnd).toBe(null);
    expect(result.current.showBuildingDirections).toBe(false);
  });
});
