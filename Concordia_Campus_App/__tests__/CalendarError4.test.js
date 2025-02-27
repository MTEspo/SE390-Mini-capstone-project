import React, { use } from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import Calendar from "../calendar/calendar";
import axios from "axios";

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

describe("calendar fails to fetch calendar events", () => {
    test("cant fetch calendars", async () =>{
        const tree = render(<Calendar />);
            
        const signInButton = await tree.findByText("Sign in with Google");
        fireEvent.press(signInButton);

        expect(tree.findByText("Sign in with Google")).toBeTruthy();
    });

    test("cant fetch calendars events", async () =>{
      const tree = render(<Calendar />);
      axios.get
          .mockImplementationOnce(() => Promise.resolve(
            {data: {items: [{id: "mock-id", 
                              summary: "Test Calendar"}], 
                              nextPageToken: null}}
      ))
      const signInButton = await tree.findByText("Sign in with Google");
      fireEvent.press(signInButton);

      expect(tree.findByText("Test Calendar")).toBeTruthy();
  });
})