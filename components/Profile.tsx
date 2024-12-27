import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useReducer } from 'react'
import { Id } from '@/convex/_generated/dataModel'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import UserProfile from './UserProfile'
import { Colors } from '@/constants/Colors'
import Tabs from './Tabs'

type ProfileProps = {
    userId?: Id<'users'>,
    showBackbutton?: boolean
}
const Profile = ({ showBackbutton = false }: ProfileProps) => {
    const userProfile = useUserProfile();
    const userId=userProfile?.userProfile?._id;
    console.log("UserProfile Hook Output:", userProfile);

    const { signOut } = useAuth();
    const router=useRouter();

    const { top } = useSafeAreaInsets();
    return (
        <View style={[styles.container, { paddingTop: top }]}>
            <FlatList
                data={[]}
                renderItem={useCallback(({item}:{item:any})=>(
                    <View>
                        <Text>{item}</Text> 
                    </View>
                ), [])}
                ListEmptyComponent={() => <Text style={styles.tabContentText}>You haven't posted anything yet.</Text>}
                ItemSeparatorComponent={() => (
                    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#ccc' }}></View>
                )}
                ListHeaderComponent={() => (
                    <>
                        <View style={styles.header}>
                            {showBackbutton ?
                                <TouchableOpacity style={styles.backButton} onPress={()=>router.back()}>
                                    <Ionicons name="chevron-back" size={24} color="black" />
                                    <Text>Back</Text>
                                </TouchableOpacity> :
                                <MaterialCommunityIcons name="web" size={24} color="black" />}
                            <View style={styles.headerIcons}>
                                <Ionicons name='logo-instagram' size={24} color={'#000'} />
                                <TouchableOpacity onPress={() => signOut()}>
                                    <Ionicons name='log-out-outline' size={24} color={'#000'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {userId? <UserProfile userId={userId}/> :<UserProfile  userId={userProfile?.userProfile?._id}/>}
                        <Tabs onTabChange={()=>{}}/>
                    </>
                )}
            />
        </View>
    )
}

export default Profile;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    backButton:{
        flexDirection:'row',
        alignItems:'center',
        gap:8
    },
    tabContentText: {
        fontSize: 16,
        marginVertical: 16,
        color: Colors.border,
        alignSelf: 'center',
      },
})