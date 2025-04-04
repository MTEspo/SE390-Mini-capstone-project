import { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Pressable, Platform, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { createClient } from "@supabase/supabase-js";
import { Card, Text, Button, Menu, Provider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { extractTokens, convertDateTime } from "./calendarUtils";
import mapData from "./mapData";
import { getLocation } from "./locationUtils";


WebBrowser.maybeCompleteAuthSession();
const SUPABASE_URL = "https://mmzllysbkfjeypyuodqr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1temxseXNia2ZqZXlweXVvZHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxOTg3MDAsImV4cCI6MjA1Mzc3NDcwMH0.bMYbKNUeMiToPKbEnN7ypk1lG2IWN7tEOrnGw57RuX0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default function Calendar() {
  const [session, setSession] = useState(null);
  const [providerToken, setProviderToken] = useState(null);
  const [events, setEvents] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [menuVisibleState, setMenuVisibleState] = useState(false);
  const [expandCards, setExpandCards] = useState({});
  const moment = require('moment-timezone');

  const check20Minutes = (startTime, endTime) => {
    //const currentTime = new Date(moment().tz('America/Toronto'));
    const currentTime = new Date("2025-04-03T20:45:00.000Z"); //If you need to demonstrate an event being within 20 mins, this line can be uncommented to simulate a specific time. Should highlight SOEN342 on the 27th.
    //const currentTime = new Date("2025-03-27T21:45:00.000Z"); //If you need to demonstrate an event that is ongoing, this line can be uncommented to simulate a specific time. Should highlight SOEN342 on the 27th.
    const eventStartTime = new Date(startTime);
    const eventEndTime = new Date(endTime);
    const timeDifference = eventStartTime - currentTime;

    if(timeDifference > 0 && timeDifference <= 20 * 60 * 1000) {
      return 1;
    }else if(timeDifference <= 0 && eventEndTime >= currentTime) {
      return 2;
    }
    return 0;
  }
  const toggleExpandCard = (eventID) => {
    setExpandCards((otherStates) => ({
      [eventID]: !otherStates[eventID],
    }));
  };
  const navigation = useNavigation();

  const googleSignIn = async () => {
    const redirectUri = Linking.createURL("/");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
        redirectTo: redirectUri,
      },
    });

    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
      if (result.type === "success" && result.url) {
        const { access_token, refresh_token, provider_token } = extractTokens(result.url);
        await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        const {
          data: { session: updatedSession },
        } = await supabase.auth.getSession();
        setSession(updatedSession);
        setProviderToken(provider_token);
        // Immediately fetch calendars using the token.
        getGoogleCalendars(provider_token);
      }
    } else {
      console.error("Error starting OAuth:", error);
    }
  };

  const googleSignOut = async () => {
    await supabase.auth.signOut().then(() => {
      setSession(null);
      setProviderToken(null);
      setCalendars([]);
      setSelectedCalendar(null);
      setEvents([]);
    });
  };

  // Fetch all calendars using pagination.
  const getGoogleCalendars = async (tokenParam) => {
    const token = tokenParam || providerToken;
    if (!token) {
      console.error("No valid token found for calendars.");
      return;
    }
    let fetchedCalendars = [];
    let nextPageToken = null;
    try {
      do {
        const response = await axios.get(
          "https://www.googleapis.com/calendar/v3/users/me/calendarList",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              maxResults: 250, // Request up to 250 calendars per page
              pageToken: nextPageToken,
            },
          }
        );
        fetchedCalendars = fetchedCalendars.concat(response.data.items);
        nextPageToken = response.data.nextPageToken;
      } while (nextPageToken);

      // Sorting calendars with "Schedule 1" first
      fetchedCalendars.sort((a, b) => {
        if (a.summary === "Schedule 1") return -1; // "Schedule 1" first
        if (b.summary === "Schedule 1") return 1;
        return a.summary.localeCompare(b.summary); // Alphabetical order for other calendars
      });

      setCalendars(fetchedCalendars);

      if (fetchedCalendars.length > 0) {
        setSelectedCalendar(fetchedCalendars[0]);
        getGoogleCalendarEvents(fetchedCalendars[0].id, token);
      }
    } catch (error) {
      console.error("Error fetching Google Calendars:", error);
      if (error.response && error.response.status === 401) {
        googleSignOut();
      }
    }
  };

  const getGoogleCalendarEvents = async (calendarId, token) => {
    if (!token) {
      console.error("No valid token found for events.");
      return;
    }
    try {
      const currentTime = new Date();
      const sunday = new Date(currentTime);
      sunday.setDate(currentTime.getDate() - currentTime.getDay());
      sunday.setHours(0, 0, 0, 0);

      const saturday = new Date(sunday);
      saturday.setDate(sunday.getDate() + 6);
      saturday.setHours(23, 59, 59, 999);

      const minTime = sunday.toISOString();
      const maxTime = saturday.toISOString();
      const response = await axios.get(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            timeMin: minTime,
            timeMax: maxTime,
            orderBy: "startTime",
            singleEvents: true,
          },
        }
      );
      setEvents(response.data.items);
    } catch (error) {
      console.error("Error fetching Google Calendar events:", error);
      if (error.response && error.response.status === 401) {
        googleSignOut();
      }
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (providerToken) {
        getGoogleCalendars(providerToken);
      } else {
        googleSignOut();
      }
    });
    return unsubscribe;
  }, [navigation, providerToken]);



  return (
    <Provider>
      <View style={styles.container}>
        {session ? (
          <>
            <View style={styles.header}>
              <Menu
                testID="test-menu-close"
                visible={menuVisibleState}
                onDismiss={() => {
             
                  setMenuVisibleState(false);
                }}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setMenuVisibleState(true);
                    }}
                  >
                    {selectedCalendar ? selectedCalendar.summary : "Select Calendar"}
                  </Button>
                }
              >
                {calendars.map((calendar) => (
                  <Menu.Item
                    testID={"test"+calendar.id}
                    key={calendar.id}
                    onPress={() => {
                      setSelectedCalendar(calendar);
                      getGoogleCalendarEvents(calendar.id, providerToken);
                      setMenuVisibleState(false);
                    }}
                    title={calendar.summary}
                  />
                ))}
              </Menu>
            </View>
            <ScrollView style={styles.eventList} contentContainerStyle={styles.eventListContent}>
              {events.length > 0 ? (
                events.map((event) => (
                  <Card testID={"test-"+event.summary} key={event.id} style={[styles.card,  (() => {
                    const checkResult = check20Minutes(event.start.dateTime || event.start.date, event.end.dateTime || event.end.date);
                    if (checkResult === 1) {
                      return { backgroundColor: '#edaf02' }; 
                    } else if (checkResult === 2) {
                      return { backgroundColor: '#36c939' }; 
                    }
                    return {}; 
                  })()]}>
                    <Pressable onPress={() => toggleExpandCard(event.id)}>
                      <Card.Content style={styles.cardContent}>
                        <Text variant="titleMedium">{event.summary}</Text>
                        <View style={styles.eventDetails}>
                          <Text variant="bodySmall">
                            Start: {convertDateTime(event.start.dateTime || event.start.date)}
                          </Text>
                          <Text variant="bodySmall">
                            End: {convertDateTime(event.end.dateTime || event.end.date)}
                          </Text>
                        </View>
                      </Card.Content>
                    </Pressable>
                    {expandCards[event.id] && (
                      <View>
                        <Text variant="bodySmall" style={{ paddingLeft: 16 }}>
                          Location: {event.description}
                        </Text>
                        <View style={styles.cardButtons}>
                          <Button
                            mode="contained"
                            onPress={() => {
                              const buildingCode = event.description;
                              const code = buildingCode.match(/^[^\d\s]+/);
                              const building = mapData.buildings.find((building) => building.code === code[0]);
                              navigation.navigate("Map", { destinationLoc: building.name });
                            }}
                          >
                            Location
                          </Button>
                          <Button
  style={{ marginTop: 10 }}
  mode="contained"
  onPress={async () => {
    try {
      const location = await getLocation(); // Fetch user's current location
      if (!location) {
        Alert.alert("Error", "Could not retrieve current location.");
        return;
      }

      const buildingCode = event.description;
      const code = buildingCode.match(/^[^\d\s]+/);
      const building = mapData.buildings.find((b) => b.code === code[0]);

      if (!building) {
        Alert.alert("Error", "Building not found in map data.");
        return;
      }

      navigation.navigate("Map", {
        startCoords: location,
        destinationCoords: building.name,
      });
    } catch (error) {
      console.error("Error retrieving user location:", error);
      Alert.alert("Error", "Could not retrieve current location.");
    }
  }}
>
  Directions
</Button>


                        </View>
                      </View>
                    )}
                  </Card>
                ))
              ) : (
                <Text style={styles.noEvents}>No events found.</Text>
              )}
            </ScrollView>
            <Button mode="outlined" onPress={googleSignOut} style={styles.signOutButton}>
              Sign Out
            </Button>
          </>
        ) : (
          <Button mode="contained" onPress={googleSignIn}>
            Sign in with Google
          </Button>
        )}
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,  
  },
  header: {
    marginBottom: 20,
  },
  eventList: {
    flex: 1,
    width: "100%",
  },
  eventListContent: {
    alignItems: "center", 
    paddingBottom: 20,
  },
  card: {
    marginVertical: 10, 
    alignSelf: "center", 
    width: "90%",  
  },
  cardContent: {
    paddingTop: 10,
  },
 
  eventDetails: {
    marginBottom: 10,
  },
  noEvents: {
    textAlign: "center",
    marginTop: 20,
  },
  signOutButton: {
    marginTop: 20,
  },
  cardButtons: {
    flexDirection: "column",
    paddingHorizontal: 50,
    paddingVertical: 10,
  },
});
