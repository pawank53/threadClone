import { Slot, Stack, useNavigationContainerRef, useRouter, useSegments } from "expo-router";
import { ClerkProvider, ClerkLoaded, useAuth, useUser } from '@clerk/clerk-expo'
import { tokenCache } from "@/utils/cache";
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold, useFonts } from '@expo-google-fonts/dm-sans'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import * as Sentry from "@sentry/react-native";


const navigationIntegration = Sentry.reactNavigationIntegration();
const routingInstrumentation = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN, // this key should be set in .env
  attachScreenshot: true, // track screenshots of errors
  tracesSampleRate: 1.0,
  debug: false,
  _experiments: {
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,

  },
  integrations: [navigationIntegration, Sentry.mobileReplayIntegration()], 
  enableNativeFramesTracking: true // this is the default
  
});

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});


if (!clerkPublishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [fontLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold
  })

  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const user =useUser();
  console.log("segments", segments);
  
  useEffect(() => {
    console.log("user present", user);
    if (fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded])

  // useEffect(() => {
  //   if (!isLoaded) return;

  //   const inAuthGroup = segments[0] === '(auth)';
  //   console.log("inAuthGroup>>",{ inAuthGroup, segments });

  //   if (isLoaded && !inAuthGroup) {
  //     console.log("isLoaded,inAuthGroup >>", isLoaded, inAuthGroup);
      
  //     router.replace('/(auth)/(tabs)/feed');
  //   } else if (!isSignedIn && inAuthGroup) {
  //     router.replace('/(public)');
  //   }

  // }, [isSignedIn]);

  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === '(auth)';

    if (isSignedIn && !inTabsGroup) {
      router.replace('/(auth)/(tabs)/feed');
    } else if (!isSignedIn && inTabsGroup) {
      router.replace('/(public)');
    }
  }, [isSignedIn]);

  

  useEffect(()=>{
    if(user && user.user){
      // console.log("user>>", user.user);
      Sentry.setUser({ email: user.user.emailAddresses[0].emailAddress , id: user.user.id });
    }else{
      Sentry.setUser(null)
    }
  }, [user])

  return <Slot />
}
export default function RootLayout() {
  // to tract application crashes
  const ref=useNavigationContainerRef();
  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);
  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <InitialLayout />
          {/* <Slot/> */}
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  )
}
