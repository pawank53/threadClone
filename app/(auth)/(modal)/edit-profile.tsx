import { StyleSheet, Text, TouchableOpacity, View , Image, TextInput} from 'react-native'
import React, { useState } from 'react'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { Colors } from '@/constants/Colors';
import { updateUser } from '@/convex/users';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import * as Sentry from '@sentry/react-native';
import { Id } from '@/convex/_generated/dataModel';

export default function EditProfile() {

    const {biostring, linkString, userId, imageUrl}= useLocalSearchParams<{
        biostring: string,
        linkString: string,
        userId: string,
        imageUrl: string
    }>();
    console.log("EditProfile>>", biostring, linkString, userId, imageUrl);

    const [bio, setBio] = useState(biostring);
  const [link, setLink] = useState(linkString);
  const updateUser = useMutation(api.users.updateUser);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateImage = useMutation(api.users.updateImage);
  // const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

    const onDone=async ()=>{
      updateUser({ _id: userId as Id<'users'>, bio, websiteUrl: link });
      Sentry.captureEvent({
        message: 'User Profile updated',
        extra: {
          bio,
          link,
        },
      });
      // if (selectedImage) {
      //   await updateProfilePicture();
      // }
      router.dismiss();
    }
    
  return (
    <View>
      <Stack.Screen
      options={{
        headerRight:()=>(
          <TouchableOpacity onPress={onDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
        )
      }}
      />
      {/* <TouchableOpacity onPress={selectImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
        ) : (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        )}
      </TouchableOpacity> */}
      <TouchableOpacity>
        <Image source={{ uri: imageUrl }} style={styles.image} />
      </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Write a bio..."
          numberOfLines={4}
          multiline
          textAlignVertical="top"
          style={styles.bioInput}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Link</Text>
        <TextInput value={link} onChangeText={setLink} placeholder="Link" autoCapitalize="none" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 4,
    padding: 8,
    margin: 16,
  },
  bioInput: {
    height: 50,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
  },
})