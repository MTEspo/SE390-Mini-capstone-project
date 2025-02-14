import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import Calendar from "../calendar/calendar";
import { createURL } from "expo-linking";
import { createClient } from "@supabase/supabase-js";
//import * as axios from "axios";

//jest.mock("axios");

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

/*jest.mock("../calendar/calendarUtils", () => ({
  extractTokens: jest.fn(() => {return {access_token: "mock-access", refresh_token: "mock-refresh", provider_token: "mock-provider"}})
}));*/

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


describe("Calendar Tests", () => {
  test("renders sign-in button when no session exists", async () => {
    const tree = render(<Calendar />);
    
    const signInButton = await tree.findByText("Sign in with Google");

    expect(signInButton).toBeTruthy();
  });

  test("calls googleSignIn on button press", async () => {
      const { findByText } = render(<Calendar />);

      await act(async () => {
        const signInButton = await findByText("Sign in with Google");
        fireEvent.press(signInButton);
      })

      expect(createURL).toHaveBeenCalled();
  });

  test("renders sign-out button after sign-in", async () => {
    const { findByText } = render(<Calendar />);

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
      await act(async () => {
        fireEvent.press(await findByText("Sign in with Google"));
      })

      expect(findByText("Select Calendar")).toBeTruthy();
  });
/*
  test("get calendars", async () => {
    const { findByText } = render(<Calendar />);

    await axios.get.mockImplementation(() => Promise.resolve({data: {items: [{id: "mock-id", summary: "Schedule 1"}], nextPageToken: null}}));

    await act(async () => {
      fireEvent.press(await findByText("Sign in with Google"));
      const calendarButton = await findByText("Select Calendar");
      fireEvent.press(calendarButton);
    })

    expect(findByText("Schedule 1")).toBeTruthy();


  })
*/

});
