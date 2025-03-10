import { View,Text,TextInput,TouchableOpacity,Image,StyleSheet,} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {widthPercentageToDP as wp,heightPercentageToDP as hp,} from "react-native-responsive-screen";

export default function RecipesFormScreen({ route, navigation }) {
  const { recipeToEdit, recipeIndex, onrecipeEdited } = route.params || {};
  const [title, setTitle] = useState(recipeToEdit ? recipeToEdit.title : "");
  const [ingredients, setIngredients] = useState(
    recipeToEdit && typeof recipeToEdit.ingredients === "string"
      ? recipeToEdit.ingredients.split(",").map(item => item.trim())
      : [""]
  );
  const [image, setImage] = useState(recipeToEdit ? recipeToEdit.image : "");
  const [description, setDescription] = useState(
    recipeToEdit ? recipeToEdit.description : ""
  );

  const saverecipe = async () => {
    const newRecipe = { title, image, description, ingredients };
    try{
      var existingRecipes = await AsyncStorage.getItem("customrecipes");
      const recipes = existingRecipes ? JSON.parse(existingRecipes) : [];

      if (recipeToEdit !== undefined) {
        recipes[recipeIndex] = newRecipe;
        await AsyncStorage.setItem("customrecipes", JSON.stringify(recipes));
        if (onrecipeEdited) onrecipeEdited();
      }else{
        recipes.push(newRecipe);
        await AsyncStorage.setItem("customrecipes", JSON.stringify(recipes));
      }

      navigation.goBack();
    }catch (e)
    { 
      console.error("Error saving the recipe:", e)
    }
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text>Go back</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.imagePlaceholder}>Upload Image URL</Text>
      )}
      <TextInput
        placeholder="Step by step instructions"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
        style={[styles.input, { height: hp(20), textAlignVertical: "top" }]}
      />
      <TextInput
        placeholder="Ingredients (comma seperated)"
        value={ingredients}
        onChangeText={setIngredients}
        style={styles.input}
      />
      <TouchableOpacity onPress={saverecipe} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save recipe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  input: {
    marginTop: hp(4),
    borderWidth: 1,
    borderColor: "#ddd",
    padding: wp(.5),
    marginVertical: hp(1),
  },
  image: {
    width: 300,
    height:200,
    margin: wp(2),
  },
  imagePlaceholder: {
    height: hp(20),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(1),
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    padding: wp(2),
  },
  saveButton: {
    backgroundColor: "#4F75FF",
    padding: wp(.5),
    alignItems: "center",
    borderRadius: 5,
    marginTop: hp(2),
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#b1c246",
    padding: wp(.5),
    alignItems: "center",
    borderRadius: 5,
    marginTop: hp(2),
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
