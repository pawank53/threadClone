import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import * as Sentry from '@sentry/react-native';

export default function index() {
  const testError = () => {
    console.log("testError");

    try {
      Sentry.captureException(new Error("This is an error"));
    } catch (err) {
      const sentryID = Sentry.captureMessage("This is a message");
      console.log("sentryID:", sentryID);
      const userFeedback: Sentry.UserFeedback = {
        event_id: sentryID,
        name: "John Doe",
        email: "nV4l5@example.com",
        comments: "This is a comment",
      }

      Sentry.captureUserFeedback(userFeedback);
    }
  }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>this is feed</Text>
      <Button title="Tap Me!" onPress={testError} />

      <Button title='Try!' onPress={() => { Sentry.captureException(new Error('First error')) }} />
    </View>
  )
}

const styles = StyleSheet.create({})