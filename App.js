import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignUpScreen from "./components/signUpScreen";
import SignInScreen from "./components/signInScreen";
import MainScreen from "./components/mainScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{ title: "Main Screen" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
