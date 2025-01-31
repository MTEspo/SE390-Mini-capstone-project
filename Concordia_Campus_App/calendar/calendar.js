import * as React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { createClient } from '@supabase/supabase-js';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

WebBrowser.maybeCompleteAuthSession();
const SUPABASE_URL =  "https://mmzllysbkfjeypyuodqr.supabase.co";
const SUPABASE_ANON_KEY =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1temxseXNia2ZqZXlweXVvZHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxOTg3MDAsImV4cCI6MjA1Mzc3NDcwMH0.bMYbKNUeMiToPKbEnN7ypk1lG2IWN7tEOrnGw57RuX0";
const provider_token = "ya29.a0AXeO80SaHShUxtuAtH_RC_qu8XrRH6Zys4xibmZsskpTVDUDq6BeFui1hWBrajvyT8j_PS3hRFlkVH7JvZP3GOvpOhlIc6ijxV8eX4rXNNN5gsRuRt0is9Gk_fpDBC5ye4wkXppdPDGOkB5wDXAVlfoU1129vli6KzI6U3uftAaCgYKAaQSARMSFQHGX2MiYD-B4WMhWqhegXZ4hGxXHw0177";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  }
});

export default function Calendar() {
  const [session, setSession] = React.useState(null);
  const [events, setEvents] = React.useState([]);
  const navigation = useNavigation();

  async function googleSignIn() {
    const redirectUri = Linking.createURL('/');

    const {data, error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar',
        redirectTo: redirectUri
      }
    });

    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

      if (result.type === "success" && result.url) {
        const { access_token, refresh_token, provider_token1 } = extractTokens(result.url);
        await supabase.auth.setSession({
          access_token,
          refresh_token,
          provider_token1
        })
        console.log(provider_token1);

        const { data: updatedSession } = await supabase.auth.getSession();
        setSession(updatedSession);
        //getGoogleCalendarEvents();
      }
    } else {
      console.error('Error starting OAuth:', error);
    }
  }

  async function googleSignOut() {
    await supabase.auth.signOut().then(() =>{
      setSession(null);
    });
  }
  
  async function getGoogleCalendarEvents() {
    if (session && session.user) {
      try {
        // Make a GET request to Google Calendar API
        const response = await axios.get(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          {
            headers: {
              Authorization: `Bearer ${provider_token}`,
            },
          }
        );

        // Update state with the events
        setEvents(response.data.items);
      } catch (error) {
        googleSignOut();
        console.error('Error fetching Google Calendar events:', error);
      }
    }
  }

  React.useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {   
      getGoogleCalendarEvents();
    });

    return unsubscribe;
  }, [navigation]);

  // SIGN OUT BUTTON
  // <Button style={styles.googleAuth} title="Sign Out" onPress={() => googleSignOut()} />
  return (
    <View style={styles.container}>
    {session ?
      <>
        <View>
          {events.length > 0 ? (
            events.map((event, index) => (
              <View style={{ padding: 10 }} key={index}>
              <Card key={index} style={{ marginBottom: 10 }}  onPress={() => console.log("Card pressed")}>
                <Card.Content style={styles.card}>
                  <Text variant="titleLarge">{event.summary}</Text>
                  <Text>Start Time: {convertDateTime(event.start.dateTime)[0]} - {convertDateTime(event.start.dateTime)[1]}</Text>
                  <Text>End Time: {convertDateTime(event.end.dateTime)[0]} - {convertDateTime(event.end.dateTime)[1]}</Text>
                </Card.Content>
              </Card>
            </View>
            ))
          ) : (
            <>
             <Button style={styles.center} title="Get Events" onPress={() => getGoogleCalendarEvents()} />
             <Text style={{textAlign: 'center'}} >No events found.</Text>
            </>
          )}
        </View>
      </>
     : 
      <Button style={styles.center} title="Sign in with Google" onPress={() => googleSignIn()} />
    }
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});


// Helper function to extract tokens from the URL
function extractTokens(url) {
  const params = new URLSearchParams(url.split('#')[1]);
  return {
    access_token: params.get("access_token"),
    refresh_token: params.get("refresh_token"),
    provider_token1: params.get("provider_token")
  };
}

function convertDateTime(input){
  let dateAndTime = [];
  const dateTime = new Date(input);
  dateAndTime[0] = dateTime.toISOString().split("T")[0];
  dateAndTime[1] = dateTime.toISOString().split("T")[1].split(".")[0];

  return dateAndTime;
}