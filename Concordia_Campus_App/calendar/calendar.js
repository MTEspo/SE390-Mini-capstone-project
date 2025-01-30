import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =  "https://mmzllysbkfjeypyuodqr.supabase.co";
const SUPABASE_ANON_KEY =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1temxseXNia2ZqZXlweXVvZHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxOTg3MDAsImV4cCI6MjA1Mzc3NDcwMH0.bMYbKNUeMiToPKbEnN7ypk1lG2IWN7tEOrnGw57RuX0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Calendar() {
  const session = useSession();

  async function googleSignIn() {
    const {data, error} = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      }
    });

    console.log(data);
    console.log("SESSION: " + session);
    
  }

  return (
    <View>
      {session ?
      <>
        <h2> Hey there {session.user.email}</h2>
      </>
      :
      <>
        <Button title='Sign in with google' onPress={() => googleSignIn()}/>
      </>
      }
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});