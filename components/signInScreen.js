import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { stylesSignInAndUp } from "./style";
import Button from "./Button";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // const user = userCredential.user;
        navigation.reset({
          index: 0,
          routes: [{ name: "MainScreen" }],
        });
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
        <Text style={stylesSignInAndUp.title}>Sign In</Text>
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
        <Button
          title="Sign In"
          onPress={handleSignIn}
          width={150}
          height={40}
        />

        <View style={stylesSignInAndUp.footer}>
          <Text style={stylesSignInAndUp.footertext}>
            Don't have an account?
          </Text>

          <Pressable onPress={() => navigation.navigate("SignUp")}>
            <Text style={stylesSignInAndUp.link}>Sign up</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
};

export default SignInScreen;
