import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import Button from "./Button";

const GalleryScreen = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      const albumList = await MediaLibrary.getAlbumsAsync();
      setAlbums(albumList);
    } else {
      console.log("Permission not granted to access gallery");
    }
  };

  const fetchPhotos = async (album) => {
    const albumPhotos = await MediaLibrary.getAssetsAsync({
      album: album.id,
      first: 100, // Limiting to first 100 photos for performance
    });
    setPhotos(albumPhotos.assets);
    setSelectedAlbum(album);
  };

  const handleSelectImage = (image) => {
    setSelectedImage(image);
  };

  const handleGoBack = () => {
    setSelectedImage(null);
    setSelectedAlbum(null);
    setPhotos([]);
  };

  const renderAlbum = ({ item }) => (
    <TouchableOpacity
      style={[styles.albumContainer, { backgroundColor: "#1D4C85" }]}
      onPress={() => fetchPhotos(item)}
    >
      <Text style={[styles.albumTitle, { color: "#FFFFFF" }]}>
        {item.title}
      </Text>
      <Text style={[styles.albumCount, { color: "#FFFFFF" }]}>
        {item.assetCount} Photos
      </Text>
    </TouchableOpacity>
  );

  const renderPhoto = ({ item }) => (
    <Image source={{ uri: item.uri }} style={styles.image} resizeMode="cover" />
  );

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <View style={styles.selectedImageContainer}>
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.selectedImage}
            resizeMode="contain"
          />
          <Button
            title="Go Back"
            onPress={handleGoBack}
            width={150}
            height={40}
          />
        </View>
      ) : selectedAlbum ? (
        <>
          <FlatList
            data={photos}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectImage(item)}>
                <Image
                  source={{ uri: item.uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            numColumns={3}
          />
          <Button
            title="Go Back"
            onPress={handleGoBack}
            width={150}
            height={40}
          />
        </>
      ) : (
        <FlatList
          data={albums}
          renderItem={renderAlbum}
          keyExtractor={(item) => item.id}
          numColumns={2}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  albumContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    backgroundColor: "#ccc",
    padding: 10,
  },
  albumTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  albumCount: {
    fontSize: 14,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  selectedImageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default GalleryScreen;
