import React, { useState, useEffect } from "react";
import { View, Text, Image, Platform } from "react-native";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs-react-native";
import * as ImagePicker from "expo-image-picker";
import * as jpeg from "jpeg-js";
import Button from "./Button";

const ImageClassifier = () => {
  const [predictions, setPredictions] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
      await tf.ready(); // Initialize TensorFlow.js
      await tf.setBackend("rn-webgl");
    })();
  }, []);

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
        aspect: [4, 3],
      });

      if (!result.cancelled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error selecting image:", error);
    }
  };

  const classifyImage = async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }
    try {
      const model = await mobilenet.load();
      console.log("Model loaded successfully");
      const response = await fetch(selectedImage);
      const rawImageData = await response.arrayBuffer();
      const imageTensor = convertImageToTensor(rawImageData);
      if (imageTensor) {
        const predictions = await model.classify(imageTensor);
        setPredictions(predictions);
        console.log("Prediction is : ", predictions);
      } else {
        console.error("Error converting image to tensor.");
      }
    } catch (error) {
      console.error("Error classifying image:", error);
    }
  };

  const convertImageToTensor = (rawImageData) => {
    try {
      const TO_UINT8ARRAY = true;
      const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);

      // Downscale the image
      const scaleFactor = 0.5; // You can adjust this value
      const scaledWidth = Math.floor(width * scaleFactor);
      const scaledHeight = Math.floor(height * scaleFactor);

      // Create a smaller buffer
      const buffer = new Uint8Array(scaledWidth * scaledHeight * 3);
      let offset = 0;

      // Copy pixel data from the original image to the smaller buffer
      for (let y = 0; y < scaledHeight; y++) {
        for (let x = 0; x < scaledWidth; x++) {
          const originalX = Math.floor(x / scaleFactor);
          const originalY = Math.floor(y / scaleFactor);
          const originalOffset = (originalY * width + originalX) * 4;

          buffer[offset] = data[originalOffset]; // copies the red component of the pixel
          buffer[offset + 1] = data[originalOffset + 1]; //copies the red component of the pixel
          buffer[offset + 2] = data[originalOffset + 2]; //copies the red component of the pixel

          offset += 3;
        }
      }
      console.log("Buffer Length", buffer.length);
      console.log("Buffer entries", buffer.slice(0, 1000));

      return tf.tensor3d(buffer, [scaledHeight, scaledWidth, 3]);
    } catch (error) {
      console.error("Error converting image to tensor:", error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={{ width: 300, height: 300, marginBottom: 20 }}
        />
      )}
      {/* <Button title="Select Image" onPress={selectImage} /> */}
      <Button
        title="Select Image"
        onPress={selectImage}
        width={150}
        height={40}
      />
      <Button
        title="Classify Image"
        onPress={classifyImage}
        width={150}
        height={40}
      />
      {/* <Button
        title="Classify Image"
        onPress={classifyImage}
        disabled={!selectedImage}
      /> */}
      {predictions.map((prediction, index) => (
        <Text key={index}>
          {prediction.className}: {prediction.probability.toFixed(3)}
        </Text>
      ))}
    </View>
  );
};

export default ImageClassifier;
