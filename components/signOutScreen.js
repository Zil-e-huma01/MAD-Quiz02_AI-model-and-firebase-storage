import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, View } from "react-native";
import { auth } from "../firebase";

const SignOutScreen = () => {
  const navigation = useNavigation();

  const HandleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "SignIn" }],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Sign Out" onPress={HandleSignOut} />
    </View>
  );
};

export default SignOutScreen;
