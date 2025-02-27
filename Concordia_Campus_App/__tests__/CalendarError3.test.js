import React, { use } from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import Calendar from "../calendar/calendar";

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
  extractTokens: jest.fn(() => {return {access_token: null, refresh_token: null, provider_token: null}})
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

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      addListener: jest.fn()
    }),
  };
});

describe("calendar fails to fetch calendars", () => {
    test("cant fetch calendars", async () =>{
        const tree = render(<Calendar />);
            
        const signInButton = await tree.findByText("Sign in with Google");
        fireEvent.press(signInButton);

        expect(tree.findByText("Sign in with Google")).toBeTruthy();
    });
})