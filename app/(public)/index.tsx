import { Button, Text, View, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { useAuth, useUser } from '@clerk/clerk-expo'
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser'
import { useOAuth } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import Ionicons from '@expo/vector-icons/Ionicons';
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";



export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

const LoginScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [isAppReady, setIsAppReady] = useState(false);
  const { startOAuthFlow: startFacebookOAuthFlow } = useOAuth({ strategy: 'oauth_facebook' });
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  

  const data =useQuery(api.users.getAllUsers);
  // console.log("data:", data);
  

  useWarmUpBrowser()

  // useEffect(() => {
  //   setIsAppReady(true);
  // }, []);

  // useEffect(() => {
  //   if (isSignedIn && isAppReady) {
  //     router.push("/(auth)/(tabs)/create");
  //   }
  // }, [isSignedIn, isAppReady, router]);

  // const onPress = React.useCallback(async () => {
  //   try {
  //     const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
  //       redirectUrl: Linking.createURL('/dashboard', { scheme: 'myapp' }),
  //     })

  //     if (createdSessionId) {
  //       setActive!({ session: createdSessionId })
  //     } else {
  //       // Use signIn or signUp for next steps such as MFA
  //     }
  //   } catch (err) {
  //     console.error('OAuth error', err)
  //   }
  // }, [startOAuthFlow])


  const handleFacebookLogin = async () => {
    try {
      console.log("Starting Facebook OAuth...");
      // const { createdSessionId, setActive } = await startOAuthFlow();
      const result= await startFacebookOAuthFlow();
      const { createdSessionId, setActive }=result;
      console.log("Facebook OAuth Response:", result);
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        console.log("Session activated successfully.");
      }else{
        console.error("No session ID created. Inspect OAuth response.");
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  };

  

  const handleGoogleLogin = async () => {
    try{
      const result= await startGoogleOAuthFlow();
      const { createdSessionId, setActive }=result;
      // const {createdSessionId, setActive}= await startGoogleOAuthFlow();
      console.log("HandleGoogleLogin ~createdSessionId:", createdSessionId, result)
      if(createdSessionId){
        setActive!({session: createdSessionId})
      }
    }catch(err){
      console.error(err)
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/login.png')} style={styles.imageStyle} />
      <ScrollView>
        <Text style={styles.title}>How would you like to use Threads?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={handleFacebookLogin}>
            <View style={styles.loginButtonContainer}>
              <Image source={require("../../assets/images/instagram_icon.webp")} style={styles.loginButtonIcon}/>
              <Text style={styles.loginButtonText}>Continue with Instagram</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.border}/>
            </View>
            <Text style={styles.loginButtonDescription}>Log in or create a THreads profile with your Instagram account. With a profile, you
              can post, interact and get personalised recommendations.</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleGoogleLogin}>
            <View style={styles.loginButtonContainer}>
              <Text style={styles.loginButtonText}>Continue with Google</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.border}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton}>
            <View style={styles.loginButtonContainer}>
              <Text style={styles.loginButtonText}>Use without a profile</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.border}/>
            </View>
            <Text style={styles.loginButtonDescription}>You can browse Threads without a profile, but won't be able to post, interact or get
              personalised recommendations.</Text>
          </TouchableOpacity>

          <TouchableOpacity >
            <Text style={styles.switchAccountText}>Switch Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent:'center',
    alignItems: 'center',
    gap: 20,
    backgroundColor: Colors.background
  },
  imageStyle: {
    height: 300,
    width: '100%',
    resizeMode: 'cover'
  },
  title: {
    fontSize: 17,
    fontFamily: 'DMSans_700Bold',
    alignSelf: 'center',
  },
  buttonContainer: {
    // gap: 30,
    marginTop:10,
    marginHorizontal: 20,
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  loginButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loginButtonIcon:{
    width: 40,
    height: 40
  },
  loginButtonText:{
    color: '#000',
    fontSize: 15,
    fontFamily: 'DMSans_500Medium',
    flex: 1,
  },
  loginButtonDescription: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    color: 'gray',
    marginTop: 5,
  },
  switchAccountText:{
    alignSelf:'center',
    marginVertical:10,
    color:Colors.border
  }
})
export default LoginScreen;




