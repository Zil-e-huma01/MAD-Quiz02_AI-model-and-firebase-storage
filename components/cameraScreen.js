import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Alert, Platform } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { stylesHome, stylesCamera } from "./style";
import Button from "./Button";

const CameraScreen = ({ HandleSignOut }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [cameraPermission, setCameraPermission] = useState(null);
  const [imagePermission, setImagePermission] = useState(null);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);

  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const permissionFunction = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(cameraPermission.status === "granted");

    const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    setImagePermission(imagePermission.status === "granted");

    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    setMediaLibraryPermission(mediaLibraryPermission.status === "granted");

    if (
      imagePermission.status !== "granted" &&
      cameraPermission.status !== "granted" &&
      mediaLibraryPermission.status !== "granted"
    ) {
      Alert.alert("Permission for media access needed.");
    }
  };

  useEffect(() => {
    permissionFunction();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      await saveImageToGallery(data.uri);
      setImageUri(data.uri);
    }
  };

  const saveImageToGallery = async (uri) => {
    if (mediaLibraryPermission) {
      try {
        const asset = await MediaLibrary.createAssetAsync(uri);
        if (Platform.OS === "android") {
          MediaLibrary.createAlbumAsync("Images", asset, false)
            .then(() => {
              console.log("File Saved Successfully!");
            })
            .catch((e) => {
              console.log("Error In Saving File!", e);
            });
        } else {
          MediaLibrary.createAlbumAsync("Images", [asset], false)
            .then(() => {
              console.log("File Saved Successfully!");
            })
            .catch((e) => {
              console.log("Error In Saving File!", e);
            });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Need Storage permission to save file");
    }
  };

  if (
    cameraPermission === null ||
    imagePermission === null ||
    mediaLibraryPermission === null
  ) {
    return <View />;
  }
  if (
    cameraPermission === false ||
    imagePermission === false ||
    mediaLibraryPermission === false
  ) {
    return <Text>No access to camera or gallery</Text>;
  }

  return (
    <View style={stylesHome.container}>
      <Text style={stylesCamera.title}>Welcome to Camera App!</Text>
      <View style={stylesCamera.cameraContainer}>
        {isFocused && (
          <Camera
            ref={(ref) => setCamera(ref)}
            style={stylesCamera.fixedRatio}
            type={type}
            ratio={"1:1"}
          />
        )}
      </View>
      <Button title="Capture" onPress={takePicture} width={150} height={40} />
    </View>
  );
};

export default CameraScreen;
