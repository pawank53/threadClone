import { useAuth } from "@clerk/clerk-expo"
import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, Stack, useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import * as Sentry from '@sentry/react-native';
const AuthRouteLayout = () => {

    const router = useRouter();
    // const {isSignedIn} = useAuth();
    // console.log({isSignedIn});
    // if(isSignedIn){
    //     return <Redirect href='/('/>
    // }
    return (
        <Stack screenOptions={{
            contentStyle: {
                // backgroundColor: 'white'
            },
            // headerShadowVisible:false
        }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name='(modal)/create'options={{
                presentation:'modal',
                title:'New Thread',
                headerRight:()=>(
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-horizontal-circle" size={24}/>
                    </TouchableOpacity>
                )
                }} />
                <Stack.Screen name='(modal)/edit-profile'options={{
                presentation:'modal',
                title:'Edit Profile',
                headerLeft:()=>(
                    <TouchableOpacity onPress={()=>{router.dismiss()}}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                )
                }} />
        </Stack>
    )

}
export default Sentry.wrap(AuthRouteLayout);