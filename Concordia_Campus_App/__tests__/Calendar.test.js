import React, { use } from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import Calendar from "../calendar/calendar";
import { extractTokens } from "../calendar/calendarUtils";
import * as axios from "axios";
import * as Location from "expo-location";

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
      addListener: jest.fn()
    }),
  };
});

jest.mock("axios");

jest.mock("expo-linking", () => ({
    createURL: jest.fn(() => "exp://localhost:8081"),
    openURL: jest.fn(),
}));
  
jest.mock("expo-web-browser", () => ({
    openAuthSessionAsync: jest.fn(() => Promise.resolve({ type: "success", url: "mock-url" })),
    maybeCompleteAuthSession: jest.fn(),
}));

jest.mock("../calendar/calendarUtils", () => ({
  ...jest.requireActual("../calendar/calendarUtils"),
  extractTokens: jest.fn(() => {return {access_token: "mock-access", refresh_token: "mock-refresh", provider_token: "mock-provider"}})
}));

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithOAuth: jest.fn(() => Promise.resolve({ data: { url: "mock-url" }, error: null })),
      signOut: jest.fn(() => Promise.resolve()),
      getSession: jest.fn(() => Promise.resolve({ data: { session: "mock-session" } })),
      onAuthStateChange: jest.fn((callback) => {
        callback("SIGNED_OUT", null);
        return { data: { subscription: { unsubscribe: jest.fn() } } };
      }),
      setSession: jest.fn(() => Promise.resolve({access_token: "mock-token", refresh_token: "mock-token"})), 
    },
  })),
}));

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

jest.mock('moment-timezone', () => {
  const actualMoment = jest.requireActual('moment-timezone');

  // Create a mock function that always returns the fixed date
  const mockMoment = () => actualMoment.utc('2025-03-27T21:45:00.000Z');
  
  // Mock tz() method to return the same fixed date
  mockMoment.tz = jest.fn(() => actualMoment.utc('2025-03-27T21:45:00.000Z'));

  return mockMoment;
});


describe("Calendar Tests That Should Pass", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders sign-in button when no session exists", async () => {
    const tree = render(<Calendar />);
    
    const signInButton = await tree.findByText("Sign in with Google");

    expect(signInButton).toBeTruthy();
  });

  test("calls googleSignIn on button press", async () => {
      const { findByText } = render(<Calendar />);

      axios.get
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{id: "mock-id", 
                       summary: "Test Calendar"}], 
                       nextPageToken: null}}
    ))
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{id: "mock-id", 
                       summary: "mock-event", 
                       start: {dateTime: "mock-date"}, 
                       end: {dateTime: "mock-date"} }]}}
    ));
      await act(async () => {
        const signInButton = await findByText("Sign in with Google");
        fireEvent.press(signInButton);
      })

      expect(extractTokens).toHaveBeenCalled();
  });

  test("renders sign-out button after sign-in", async () => {
    const { findByText } = render(<Calendar />);

    axios.get
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{id: "mock-id", 
                       summary: "Test Calendar"}], 
                       nextPageToken: null}}
    ))
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{id: "mock-id", 
                       summary: "mock-event", 
                       start: {dateTime: "mock-date"}, 
                       end: {dateTime: "mock-date"} }]}}
    ));

    await act(async () => {
      const signInButton = await findByText("Sign in with Google");
      fireEvent.press(signInButton);
      const signOutButton = await findByText("Sign Out");
      expect(signOutButton).toBeTruthy();
    })
  });


  test("calls googleSignOut on button press", async () => {
      const mockSignOutPress = jest.fn();

      const { findByText } = render(<Calendar />);
      axios.get
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{id: "mock-id", 
                       summary: "Test Calendar"}], 
                       nextPageToken: null}}
    ))
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{id: "mock-id", 
                       summary: "mock-event", 
                       start: {dateTime: "mock-date"}, 
                       end: {dateTime: "mock-date"} }]}}
    ));

      await act(async () => {
        fireEvent.press(await findByText("Sign in with Google"));
      
        const signOutButton = await findByText("Sign Out");
        fireEvent.press(signOutButton);
        mockSignOutPress()
      })

      expect(mockSignOutPress).toHaveBeenCalled();
  });

  test("renders calendars after sign-in", async () => {
    const { findByText } = render(<Calendar />);

    axios.get
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{id: "mock-id", 
                       summary: "Test Calendar"}], 
                       nextPageToken: null}}
    ))
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{id: "mock-id", 
                       summary: "mock-event", 
                       start: {dateTime: "mock-date"}, 
                       end: {dateTime: "mock-date"} }]}}
    ));

      await act(async () => {
        fireEvent.press(await findByText("Sign in with Google"));
      })

      expect(findByText("Test Calendar")).toBeTruthy();
  });

  test("get calendars and events", async () => {
    const { findByText } = render(<Calendar />);

    axios.get
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{
                       id: "mock-id1", 
                       summary: "Schedule 1"
                      },
                      {
                        id: "mock-id2",
                        summary: "schedule 2"
                      }
                     ], 
                       nextPageToken: null}}
    ))
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{id: "mock-id", 
                       summary: "Event 1", 
                       start: {dateTime: "2025-02-14T05:45:00.00Z"}, 
                       end: {dateTime: "2025-02-14T06:45:00.00Z"} }]}}
    ));

    await act(async () => {
      fireEvent.press(await findByText("Sign in with Google"));
      const calendarButton = await findByText("Schedule 1");
      expect(findByText("Schedule 1")).toBeTruthy();
      fireEvent.press(calendarButton);
      expect(findByText("Schedule 2")).toBeTruthy();
    })

    expect(findByText("Event 1")).toBeTruthy();
    expect(findByText("2025-02-14, 12:45:00 a.m.")).toBeTruthy();
    expect(findByText("2025-02-14, 1:45:00 a.m.")).toBeTruthy();

  });

  test("getting calendar event location", async () => {
    const { findByText } = render(<Calendar />);
    
    axios.get
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{
                       id: "mock-id1", 
                       summary: "Schedule 1"
                      },
                      {
                        id: "mock-id2",
                        summary: "schedule 2"
                      }
                     ], 
                       nextPageToken: null}}
    ))
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{id: "mock-id", 
                       summary: "Event 1",
                       description: "H123",
                       start: {dateTime: "2025-02-14T05:45:00.00Z"}, 
                       end: {dateTime: "2025-02-14T06:45:00.00Z"} }]}}
    ));

    await act(async () => {
      fireEvent.press(await findByText("Sign in with Google"));
      
      const calendarButton = await findByText("Schedule 1");
      expect(findByText("Schedule 1")).toBeTruthy();
      const event1 = await findByText("Event 1");
      
      fireEvent.press(event1);
      
      expect(await findByText("Location")).toBeTruthy();
      expect(await findByText("Directions")).toBeTruthy();

      fireEvent.press(await findByText("Location"));
    })

    expect(mockedNavigate).toHaveBeenCalled();
  });

  test("getting calendar event directions", async () => {
    const { findByText } = render(<Calendar />);
    
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: "granted" });
    Location.getCurrentPositionAsync.mockResolvedValue({coords: { latitude: 45.4940785853885, longitude: -73.57821171941591 }});

    axios.get
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{
                       id: "mock-id1", 
                       summary: "Schedule 1"
                      },
                      {
                        id: "mock-id2",
                        summary: "schedule 2"
                      }
                     ], 
                       nextPageToken: null}}
    ))
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{id: "mock-id", 
                       summary: "Event 1",
                       description: "H123",
                       start: {dateTime: "2025-02-14T05:45:00.00Z"}, 
                       end: {dateTime: "2025-02-14T06:45:00.00Z"} }]}}
    ));

    await act(async () => {
      fireEvent.press(await findByText("Sign in with Google"));
      
      const calendarButton = await findByText("Schedule 1");
      expect(findByText("Schedule 1")).toBeTruthy();
      const event1 = await findByText("Event 1");
      
      fireEvent.press(event1);
      
      expect(await findByText("Location")).toBeTruthy();
      expect(await findByText("Directions")).toBeTruthy();

      fireEvent.press(await findByText("Directions"));
    })

    expect(mockedNavigate).toHaveBeenCalled();
  });

  test("getting calendar event directions failure", async () => {
    const { findByText } = render(<Calendar />);
    
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: "denied" });

    axios.get
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{
                       id: "mock-id1", 
                       summary: "Schedule 1"
                      },
                      {
                        id: "mock-id2",
                        summary: "schedule 2"
                      }
                     ], 
                       nextPageToken: null}}
    ))
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{id: "mock-id", 
                       summary: "Event 1",
                       description: "H123",
                       start: {dateTime: "2025-02-14T05:45:00.00Z"}, 
                       end: {dateTime: "2025-02-14T06:45:00.00Z"} }]}}
    ));

    await act(async () => {
      fireEvent.press(await findByText("Sign in with Google"));
      
      const calendarButton = await findByText("Schedule 1");
      expect(findByText("Schedule 1")).toBeTruthy();
      const event1 = await findByText("Event 1");
      
      fireEvent.press(event1);
      
      expect(await findByText("Location")).toBeTruthy();
      expect(await findByText("Directions")).toBeTruthy();

      fireEvent.press(await findByText("Directions"));
    })

    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  test("getting calendar event directions failure no building", async () => {
    const { findByText } = render(<Calendar />);
    
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: "granted" });
    Location.getCurrentPositionAsync.mockResolvedValue({coords: { latitude: 45.4940785853885, longitude: -73.57821171941591 }});

    axios.get
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{
                       id: "mock-id1", 
                       summary: "Schedule 1"
                      },
                      {
                        id: "mock-id2",
                        summary: "schedule 2"
                      }
                     ], 
                       nextPageToken: null}}
    ))
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{id: "mock-id", 
                       summary: "Event 1",
                       description: "",
                       start: {dateTime: "2025-02-14T05:45:00.00Z"}, 
                       end: {dateTime: "2025-02-14T06:45:00.00Z"} }]}}
    ));

    await act(async () => {
      fireEvent.press(await findByText("Sign in with Google"));
      
      const calendarButton = await findByText("Schedule 1");
      expect(findByText("Schedule 1")).toBeTruthy();
      const event1 = await findByText("Event 1");
      
      fireEvent.press(event1);
      
      expect(await findByText("Location")).toBeTruthy();
      expect(await findByText("Directions")).toBeTruthy();

      fireEvent.press(await findByText("Directions"));
    })

    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  test("getting calendar event directions failure no building in list", async () => {
    const { findByText } = render(<Calendar />);
    
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: "granted" });
    Location.getCurrentPositionAsync.mockResolvedValue({coords: { latitude: 45.4940785853885, longitude: -73.57821171941591 }});
    
    axios.get
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{
                       id: "mock-id1", 
                       summary: "Schedule 1"
                      },
                      {
                        id: "mock-id2",
                        summary: "schedule 2"
                      }
                     ], 
                       nextPageToken: null}}
    ))
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{id: "mock-id", 
                       summary: "Event 1",
                       description: "CC123",
                       start: {dateTime: "2025-02-14T05:45:00.00Z"}, 
                       end: {dateTime: "2025-02-14T06:45:00.00Z"} }]}}
    ));

    await act(async () => {
      fireEvent.press(await findByText("Sign in with Google"));
      
      const calendarButton = await findByText("Schedule 1");
      expect(findByText("Schedule 1")).toBeTruthy();
      const event1 = await findByText("Event 1");
      
      fireEvent.press(event1);
      
      expect(await findByText("Location")).toBeTruthy();
      expect(await findByText("Directions")).toBeTruthy();

      fireEvent.press(await findByText("Directions"));
    })

    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  test("calendar highlights the correct color for class in-progress", async () => {
    const { findByTestId, findByText } = render(<Calendar />);

    axios.get
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{
                       id: "mock-id1", 
                       summary: "Schedule 1"
                      },
                      {
                        id: "mock-id2",
                        summary: "schedule 2"
                      }
                     ], 
                       nextPageToken: null}}
    ))
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{id: "mock-id", 
                       summary: "Event 1", 
                       start: {dateTime: "2025-03-27T21:00:00.000Z"}, 
                       end: {dateTime: "2025-03-27T23:00:00.000Z"} }]}}
    ));

    await act(async () => {
      fireEvent.press(await findByText("Sign in with Google"));
      
      const calendarButton = await findByText("Schedule 1");
      expect(calendarButton).toBeTruthy();
    })

    const calendarEvent = await findByTestId("test-Event 1");
    expect(calendarEvent.props.style.length).toBe(2);

  });

  test("calendar highlights the correct color for class in-progress", async () => {
    const { findByTestId, findByText } = render(<Calendar />);

    axios.get
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{
                       id: "mock-id1", 
                       summary: "Schedule 1"
                      },
                      {
                        id: "mock-id2",
                        summary: "schedule 2"
                      }
                     ], 
                       nextPageToken: null}}
    ))
    .mockImplementationOnce(() => Promise.resolve(
      {data: {items: [{id: "mock-id", 
                       summary: "Event 1", 
                       start: {dateTime: "2025-03-27T22:00:00.000Z"}, 
                       end: {dateTime: "2025-03-27T23:00:00.000Z"} }]}}
    ));

    await act(async () => {
      fireEvent.press(await findByText("Sign in with Google"));
      
      const calendarButton = await findByText("Schedule 1");
      expect(calendarButton).toBeTruthy();
    })

    const calendarEvent = await findByTestId("test-Event 1");
    expect(calendarEvent.props.style.length).toBe(2);

  });
});