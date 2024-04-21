import { StyleSheet } from "react-native";

const stylesHome = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#b8c6d6",
  },
});

const stylesCamera = StyleSheet.create({
  container: {
    flex: 0,
    width: "100%",
    height: "100%",
  },
  cameraContainer: {
    flex: 1,
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

const stylesImageScreen = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    flex: 1,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

// since similar styling was to be applied, so updated code to avoid duplication
const stylesSignInAndUp = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#E5E4E2",
  },
  input: {
    width: "80%",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginBottom: 35,
  },
  button: {
    backgroundColor: "#1D4C85",
    paddingHorizontal: 23,
    paddingVertical: 13,
    borderRadius: 40,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 20,
  },
  footer: {
    marginTop: 20,
  },
  footertext: {
    color: "#E5E4E2",
  },
  link: {
    color: "#6082B6",
  },
});

export { stylesHome, stylesCamera, stylesImageScreen, stylesSignInAndUp };
