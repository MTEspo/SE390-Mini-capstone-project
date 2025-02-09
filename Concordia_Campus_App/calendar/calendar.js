import { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Pressable, Platform, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { createClient } from "@supabase/supabase-js";
import { Card, Text, Button, Menu, Provider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";


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
  const toggleExpandCard = (eventID) => {
    setExpandCards((otherStates) => ({
      [eventID]: !otherStates[eventID]
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
        console.log("Extracted tokens:", { access_token, refresh_token, provider_token });
        await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        const {
          data: { session: updatedSession },
        } = await supabase.auth.getSession();
        setSession(updatedSession);
        setProviderToken(provider_token);
        console.log("Provider token set:", provider_token);
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
    console.log("Fetching calendars with token:", token);
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
        console.log("Fetched calendars page:", response.data.items);
        fetchedCalendars = fetchedCalendars.concat(response.data.items);
        nextPageToken = response.data.nextPageToken;
      } while (nextPageToken);
      console.log("All fetched calendars:", fetchedCalendars);
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
    console.log(`Fetching events for calendar ${calendarId} with token:`, token);
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
            orderBy: 'startTime',
            singleEvents: true,}
        }
      );
      console.log("Fetched events:", response.data.items);
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
      }else{
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
                visible={menuVisibleState}
                onDismiss={() => {
                  console.log("Menu dismissed");
                  setMenuVisibleState(false);
                }}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => {
                      console.log("Menu button pressed");
                      setMenuVisibleState(true);
                    }}
                  >
                    {selectedCalendar ? selectedCalendar.summary : "Select Calendar"}
                  </Button>
                }
              >
                {calendars.map((calendar) => (
                  <Menu.Item
                    key={calendar.id}
                    onPress={() => {
                      console.log("Calendar selected:", calendar.summary);
                      setSelectedCalendar(calendar);
                      getGoogleCalendarEvents(calendar.id, providerToken);
                      setMenuVisibleState(false);
                    }}
                    title={calendar.summary}
                  />
                ))}
              </Menu>
            </View>
            <ScrollView style={styles.eventList}>
              {events.length > 0 ? (
                events.map((event) => (
                  <Card key={event.id} style={styles.card}>
                    <Pressable  onPress={() => toggleExpandCard(event.id)}>
                      <Card.Content>
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
            
                          <Text variant= "bodySmall" style={{paddingLeft: 16}} >Location: {event.description}</Text>

                        <View style ={styles.cardButtons}>
                          <Button mode = "contained"
                          onPress={() => {
                            const location = encodeURIComponent(event.location);
                            const url = `https://www.google.com/maps?q=${location}`;
                            Linking.openURL(url).catch((err) => console.error("Cannot open Google Maps", err));
                          }
                        }>Location</Button>
                          
                          <Button style={{marginTop: 10}} mode = "contained"
                            onPress={() => {
                              const destination = encodeURIComponent(event.location);
                              const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
                              Linking.openURL(url).catch((err) => console.error("Cannot open Google Maps", err));
                            }}>Directions
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
  },
  card: {
    marginBottom: 10,
  },
  noEvents: {
    textAlign: "center",
    marginTop: 20,
  },
  signOutButton: {
    marginTop: 20,
  },
  cardButtons:{
    flexDirection: "column",
    paddingHorizontal: 50,
    paddingVertical: 10,
    
  }

});

function extractTokens(url) {
  const params = new URLSearchParams(url.split("#")[1]);
  return {
    access_token: params.get("access_token"),
    refresh_token: params.get("refresh_token"),
    provider_token: params.get("provider_token"),
  };
}

function convertDateTime(input) {
  if (!input) return "N/A";
  const dateTime = new Date(input);
  return dateTime.toLocaleString();
}