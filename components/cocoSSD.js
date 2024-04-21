import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import * as cocossd from "@tensorflow-models/coco-ssd";
import * as ImagePicker from "expo-image-picker";
import { fetch } from "@tensorflow/tfjs-react-native";

export default function CocoSSD() {
  const [isTfReady, setIsTfReady] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [imageToAnalyze, setImageToAnalyze] = useState(null);
  const model = useRef(null);

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
      setIsTfReady(true);
      model.current = await cocossd.load();
      setIsModelReady(true);
    })();
  }, []);

  const selectImageAsync = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
        aspect: [4, 3],
      });

      console.log("ImagePicker result:", result);

      if (
        !result.cancelled &&
        result.assets.length > 0 &&
        result.assets[0].uri
      ) {
        setImageToAnalyze(result.assets[0].uri);
        detectObjectsAsync(result.assets[0].uri);
      } else {
        console.log("Image selection cancelled or URI is missing");
      }
    } catch (error) {
      console.error("Error selecting image:", error);
    }
  };

  const detectObjectsAsync = async (uri) => {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Network request failed: ${response.status}`);
      }

      const imageData = await response.arrayBuffer();
      const imageTensor = await imageToTensor(imageData);
      const newPredictions = await model.current.detect(imageTensor);
      setPredictions(newPredictions);
      console.log("=== Detected objects predictions: ===");
      console.log(newPredictions);
    } catch (error) {
      console.error("Error detecting objects:", error);
    }
  };

  const imageToTensor = async (localUri) => {
    const response = await fetch(localUri);
    const imageData = await response.arrayBuffer();
    const imageTensor = tf.node.decodeImage(imageData);
    return imageTensor.expandDims(0);
  };

  const borderColors = ["blue", "green", "orange", "pink", "purple"];
  const scalingFactor = 280 / 900; // image display size / actual image size

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.welcomeContainer}>
          <Text style={styles.headerText}>COCO-SSD Object Detection</Text>

          <View style={styles.loadingContainer}>
            <View style={styles.loadingTfContainer}>
              <Text style={styles.text}>TensorFlow.js ready?</Text>
              {isTfReady ? (
                <Text style={styles.text}>✅</Text>
              ) : (
                <ActivityIndicator size="small" />
              )}
            </View>

            <View style={styles.loadingModelContainer}>
              <Text style={styles.text}>COCO-SSD model ready? </Text>
              {isModelReady ? (
                <Text style={styles.text}>✅</Text>
              ) : (
                <ActivityIndicator size="small" />
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.imageWrapper}
            onPress={isModelReady ? selectImageAsync : undefined}
          >
            {imageToAnalyze && (
              <Image
                source={{ uri: imageToAnalyze }}
                style={styles.imageContainer}
              />
            )}

            {predictions &&
              predictions.map((prediction, index) => {
                const { bbox } = prediction;
                const scaledBbox = [
                  bbox[0] * scalingFactor,
                  bbox[1] * scalingFactor,
                  bbox[2] * scalingFactor,
                  bbox[3] * scalingFactor,
                ];

                return (
                  <View
                    key={index}
                    style={{
                      position: "absolute",
                      borderColor: borderColors[index % 5],
                      borderWidth: 2,
                      left: scaledBbox[0],
                      top: scaledBbox[1],
                      width: scaledBbox[2],
                      height: scaledBbox[3],
                    }}
                  />
                );
              })}

            {!imageToAnalyze && (
              <Text style={styles.transparentText}>Tap to choose image</Text>
            )}
          </TouchableOpacity>
          <View style={styles.predictionWrapper}>
            {isModelReady && imageToAnalyze && (
              <Text style={styles.text}>
                Predictions: {predictions ? "" : "Predicting..."}
              </Text>
            )}
            {isModelReady &&
              predictions &&
              predictions.map((prediction, index) => {
                return (
                  <Text
                    key={index}
                    style={{ ...styles.text, color: borderColors[index % 5] }}
                  >
                    {prediction.class}: {prediction.score}{" "}
                    {/* prediction.bbox */}
                  </Text>
                );
              })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  contentContainer: {
    paddingTop: 30,
  },
  headerText: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "bold",
  },
  loadingContainer: {
    marginTop: 5,
  },
  text: {
    fontSize: 16,
  },
  loadingTfContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  loadingModelContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  imageWrapper: {
    width: 300,
    height: 300,
    borderColor: "#66c8cf",
    borderWidth: 3,
    borderStyle: "dashed",
    marginTop: 40,
    marginBottom: 10,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: 280,
    height: 280,
  },
  predictionWrapper: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  transparentText: {
    opacity: 0.8,
  },
});
