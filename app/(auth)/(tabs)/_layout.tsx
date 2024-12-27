
import { Colors } from "@/constants/Colors";
import { useAuth } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, useRouter } from "expo-router";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import * as Haptics from 'expo-haptics';

const  TabLayout=()=> {

    const {signOut}=useAuth();
    const router=useRouter();

    const CreateTabIcon=({color, size}:{color:string, size:number})=>{
        return(
            <View style={styles.createIconContainer}>
                <Ionicons name="add" size={size} color={color} />
            </View>
        )
    }
    return (
        <Tabs screenOptions={{
            tabBarShowLabel: false
            }}>
            <Tabs.Screen name="feed" options={{ 
                headerShown: false, 
                title: 'Home',
                tabBarIcon:({color, size, focused})=><Ionicons name={focused ? "home" : "home-outline" } color={color} size={focused ? size+4 : size}/>   
                }}/>
            <Tabs.Screen name="search" options={{
                headerShown: false, 
                title: 'Search',
                tabBarIcon:({color, size, focused})=> <Ionicons name={focused ? "search" : "search-outline"} color={color} size={focused ? size+4 : size}/>
                }}/>
            <Tabs.Screen name="create" options={{ 
                headerShown: true, 
                title: 'Create',
                tabBarIcon:({color, size})=> <CreateTabIcon color={color} size={size}/>
                }}
                listeners={{
                    tabPress:(e)=>{
                        e.preventDefault();
                        // Haptics.selectionAsync();
                        router.push("/(auth)/(modal)/create");
                    }
                }}
                />
            <Tabs.Screen name="favourite" options={{ 
                headerShown: true, 
                title: 'Favourite',
                tabBarIcon:({color, size, focused})=> <Ionicons name={focused ? "heart" : "heart-outline"} color={color} size={focused ? size+4 : size}/>
                }}/>
            <Tabs.Screen name="profile" options={{ 
                headerShown: false, 
                title: 'Profile',
                tabBarIcon:({color, size, focused})=> <Ionicons name={focused ? "person" : "person-outline"} color={color} size={focused ? size+4 : size}/>,
                // headerRight:()=>(
                //     <TouchableOpacity onPress={()=> signOut()} style={{marginRight:10}}>
                //         <Ionicons name="log-out" size={24}  />
                //     </TouchableOpacity>
                // )
                }}/>
        </Tabs>
    )


}
const styles = StyleSheet.create({
    createIconContainer:{
        padding:2,
        backgroundColor:Colors.itemBackground,
        borderRadius:8,
        height:40,
        width:40,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10
    }
})
export default TabLayout;