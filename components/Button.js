import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

const Button = ({ onPress, title, width, height }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { width: width, height: height }]}
        onPress={onPress}
      >
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center", // Center the button horizontally
    alignItems: "center", // Center the button vertically
  },
  button: {
    margin: 10,
    backgroundColor: "#1D4C85",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default Button;
