import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { stylesSignInAndUp } from "./style";
import Button from "./Button";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((auth) => {
        if (auth) {
          navigation.reset({
            index: 0,
            routes: [{ name: "CameraScreen" }],
          });
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <View style={stylesSignInAndUp.container}>
      <ImageBackground
        source={require("../assets/background.png")}
        style={stylesSignInAndUp.backgroundImage}
      >
        <Text style={stylesSignInAndUp.title}>Sign Up</Text>
        {error ? <Text style={stylesSignInAndUp.error}>{error}</Text> : null}
        <TextInput
          placeholder="Email"
          placeholderTextColor={"white"}
          value={email}
          onChangeText={setEmail}
          style={stylesSignInAndUp.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={"white"}
          value={password}
          onChangeText={setPassword}
          style={stylesSignInAndUp.input}
          secureTextEntry={true}
        />
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor={"white"}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={stylesSignInAndUp.input}
          secureTextEntry={true}
        />
        <Button
          title="Sign Up"
          onPress={handleSignUp}
          width={150}
          height={40}
        />

        <View style={stylesSignInAndUp.footer}>
          <Text style={stylesSignInAndUp.footertext}>
            Already have an account?
          </Text>
          <Pressable onPress={() => navigation.navigate("SignIn")}>
            <Text style={stylesSignInAndUp.link}>Sign in</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
};

export default SignUpScreen;
