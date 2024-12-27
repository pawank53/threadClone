import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Link, useRouter } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { useUserProfile } from '@/hooks/useUserProfile'

type UserProfileProps = {
    userId?: string
}
const UserProfile = ({ userId }: UserProfileProps) => {
    const profile = useQuery(api.users.getUserById, { userId: userId as Id<'users'> });
    const { userProfile } = useUserProfile();
    const isSelf = userProfile?._id === userId;
    console.log("profile", profile);
    const router = useRouter();

    // if (!userId) {
    //     return (
    //       <View>
    //         <Text>Error: User ID is missing.</Text>
    //       </View>
    //     );
    //   }

    // //   const profile = useQuery(api.users.getUserById, { userId: userId as Id<'users'> });

    //   if (!profile) {
    //     return (
    //       <View>
    //         <Text>Loading user profile...</Text>
    //       </View>
    //     );
    //   }

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <View style={styles.profileTextContainer}>
                    <Text style={styles.name}>
                        {profile?.first_name} {profile?.last_name}
                    </Text>
                    <Text style={styles.email}>{profile?.username}</Text>
                </View>
                <Image source={{ uri: profile?.imageUrl as string }} style={styles.image} />
            </View>
            <Text style={styles.bio}>{profile?.bio ? profile?.bio : 'No bio yet'}</Text>
            <Text>
                {profile?.followersCount} followers  {profile?.websiteUrl}
            </Text>
            <View style={styles.buttonRow}>
                {isSelf && (
                    <>
                        {/* <Link
                            href={`/(modal)/edit-profile?biostring=${profile?.bio ? encodeURIComponent(profile?.bio) : ''
                                }&linkstring=${profile?.websiteUrl ? encodeURIComponent(profile?.websiteUrl) : ''}&userId=${profile?._id
                                }&imageUrl=${profile?.imageUrl ? encodeURIComponent(profile?.imageUrl) : ''}`}
                            asChild> */}
                            <TouchableOpacity style={styles.button} 
                            onPress={() => router.push({pathname:"/(auth)/(modal)/edit-profile", params:{biostring: profile?.bio ? encodeURIComponent(profile?.bio) : '', linkString: profile?.websiteUrl ? encodeURIComponent(profile?.websiteUrl) : '', userId: profile?._id, imageUrl: profile?.imageUrl ? encodeURIComponent(profile?.imageUrl) : ''}})}>
                                <Text style={styles.buttonText}>Edit profile</Text>
                            </TouchableOpacity>
                        {/* </Link> */}
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Share profile</Text>
                        </TouchableOpacity>
                    </>
                )}

                {!isSelf && (
                    <>
                        <TouchableOpacity style={styles.fullButton}>
                            <Text style={styles.fullButtonText}>Follow</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Mention</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    )
}
export default UserProfile;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileTextContainer: {
        gap: 6,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 14,
        color: 'gray',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    bio: {
        fontSize: 14,
        marginTop: 16,
        marginBottom: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 16,
        gap: 16,
    },
    button: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
    },
    fullButton: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullButtonText: {
        fontWeight: 'bold',
        color: 'white',
    },
})