import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Calendar from "../calendar/calendar";

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({
      addListener: jest.fn(),
    }),
  }));

jest.mock("expo-linking", () => ({
    createURL: jest.fn(() => "exp://localhost:8081"),
    openURL: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({
      addListener: jest.fn(),
    }),
}));
  
jest.mock("expo-web-browser", () => ({
    openAuthSessionAsync: jest.fn(() => Promise.resolve({ type: "success", url: "mock-url" })),
    maybeCompleteAuthSession: jest.fn(),
}));

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithOAuth: jest.fn(() => Promise.resolve({ data: { url: "mock-url" }, error: null })),
      signOut: jest.fn(() => Promise.resolve()),
      getSession: jest.fn(() => Promise.resolve({ data: { session: null } })),
      onAuthStateChange: jest.fn((callback) => {
        callback("SIGNED_OUT", null);
        return { data: { subscription: { unsubscribe: jest.fn() } } };
      }),
      setSession: jest.fn(() => Promise.resolve()),  // Mock setSession method
    },
  })),
}));

jest.mock("../calendar/calendar", () => {
    const originalModule = jest.requireActual("../calendar/calendar");
    return {
      ...originalModule,
      googleSignIn: jest.fn(),  // Mock googleSignIn
    };
  });

test("renders sign-in button when no session exists", async () => {
  const { findByText } = render(<Calendar />);
  const signInButton = await findByText("Sign in with Google");
  expect(signInButton).toBeTruthy();
});

test("calls googleSignIn on button press", async () => {
    const { findByText } = render(<Calendar />);

    const signInButton = await findByText("Sign in with Google");
    fireEvent.press(signInButton);

    expect(Calendar.googleSignIn).toHaveBeenCalled();
});

/*
test("calls googleSignOut on button press", async () => {
    const { findByText } = render(<Calendar />);
    const signOutButton = await findByText("Sign Out");
  
    fireEvent.press(signOutButton);
    expect(createClient().auth.signOut).toHaveBeenCalled();
});

test("opens menu and selects calendar", async () => {
    const { findByText, getByTestId } = render(<Calendar />);
    
    const menuButton = await findByText("Select Calendar");
    fireEvent.press(menuButton);
  
    const calendarItem = getByTestId("calendar-item-1");
    fireEvent.press(calendarItem);
  
    expect(findByText("Mock Calendar 1")).toBeTruthy();
  });*/
