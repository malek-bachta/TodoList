import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  FlatList,
  Button,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import Icon3 from "react-native-vector-icons/AntDesign";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function App() {
  const [entredToDoText, setEntredToDoText] = useState("");
  const [ToDosoutput, setToDos] = useState([]);
  const [checkboxState, setCheckboxState] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editItemId, setEditItemId] = useState("");
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    // Retrieve data from AsyncStorage during app initialization
    retrieveData();
  }, []);

  const retrieveData = async () => {
    try {
      const todos = await AsyncStorage.getItem("@list");
      if (todos) {
        setToDos(JSON.parse(todos));
      }
    } catch (error) {
      console.log("Error retrieving data:", error);
    }
  };

  const storeData = async (ToDosoutput) => {
    try {
      await AsyncStorage.setItem("@list", JSON.stringify(ToDosoutput));
    } catch (e) {
      console.log(e);
    }
  };

  function ToDoinputHandler(entredText) {
    setEntredToDoText(entredText);
  }

  function addToDoHandler() {
    if (entredToDoText.trim() !== "") {
      setToDos((currentToDos) => [
        ...currentToDos,
        { text: entredToDoText, id: Math.random().toString(), isChecked: false },
      ]);
      setEntredToDoText("");
    } else {
      console.log("Please write something!");
    }
  }

  function EditTask(itemId, newText) {
    setToDos((currentToDos) =>
      currentToDos.map((todo) =>
        todo.id === itemId ? { ...todo, text: newText } : todo
      )
    );
  }

  function DeleteTask(itemId) {
    setToDos((currentToDos) =>
      currentToDos.filter((todo) => todo.id !== itemId)
    );
  }

  function openEditModal(itemId, text) {
    setEditItemId(itemId);
    setEditedText(text);
    setModalVisible(true);
  }

  function closeEditModal() {
    setModalVisible(false);
  }

  function handleEdit() {
    if (editedText.trim() !== "") {
      EditTask(editItemId, editedText);
      setModalVisible(false);
    } else {
      console.log("Please write something!");
    }
  }

  useEffect(() => {
    // Store data in AsyncStorage whenever ToDosoutput changes
    storeData(ToDosoutput);
  }, [ToDosoutput]);

  return (
    <>
      <StatusBar style="#6D63FF" />
      <View style={styles.container}>
        <View style={styles.bg} />

        <View>
          <Text style={styles.Title}>Hello</Text>
          <Text style={{ marginBottom: 20, fontSize: 14, color: "#fff" }}>
            What are you going to do:
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={entredToDoText}
            onChangeText={ToDoinputHandler}
            placeholder="Enter To-Do"
          />
          <TouchableOpacity style={styles.addButton} onPress={addToDoHandler}>
            <Icon name="plus" size={20} color="#000" />
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={{
              marginBottom: 35,
              marginTop: 20,
              fontSize: 14,
              color: "#fff",
            }}
          >
            Your To-Do list:
          </Text>
        </View>
        <View style={styles.ToDosContainer}>
        <FlatList
          data={ToDosoutput}
          renderItem={(itemData) => {
            const { id, text, isChecked } = itemData.item;
            return (
              <View style={styles.ToDoItem}>
                <View style={styles.TitleTask}>
                  <BouncyCheckbox
                    isChecked={isChecked}
                    text={text}
                    disableBuiltInState
                    onPress={() => {
                      setToDos((currentToDos) =>
                        currentToDos.map((todo) =>
                          todo.id === id ? { ...todo, isChecked: !isChecked } : todo
                        )
                      );
                    }}
                  />
                </View>
                {!isChecked && (
                  <TouchableOpacity
                    style={styles.ButtonEdit}
                    onPress={() => openEditModal(id, text)}
                  >
                    <Icon2 name="edit" size={20} color="#000" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.ButtonDelete}
                  onPress={() => {
                    const itemId = id;
                    DeleteTask(itemId);
                  }}
                >
                  <Icon2 name="delete" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={(item, index) => item.id}
        />
      </View>
             

        <Modal visible={modalVisible} animationType="slide" transparent>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => {
            closeEditModal();
          }}
        >
            <View style={styles.modalContent}>
              <TextInput
                style={styles.modalInput}
                onChangeText={(text) => setEditedText(text)}
                value={editedText}
                placeholder="Edit To-Do"
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleEdit()}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalExit}
                onPress={() => {
                  closeEditModal();
                }}
              >
                <Icon3 name="closesquare" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "#FAFAFA",
  },

  //////////////////////////////

  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F5F7",
    borderRadius: 10,
  },
  input: {
    flex: 4,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingRight: 5,
  },
  addButton: {
    width: 50,
    height: 50,

    color: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  ////////////////////////////////////

  ToDosContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  ToDoItem: {
    flex: 1,
    borderRadius: 10,
    padding: 8,
    backgroundColor: "#F3F5F7",
    width: 360,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  Title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 11,
    marginTop: 30,
    color: "#fff",
  },

  TitleTask: {
    flex: 4,
  },
  ButtonDelete: {
    marginLeft: 8,
  },
  ButtonEdit: {
    marginLeft: 30,
  },

  ///////////////////////////////

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#6D63FF",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalExit: {
    position: "absolute",
    right: 0,
    top: 0,
  },

  ///////////////////////////////

  bg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 235,
    backgroundColor: "#6D63FF",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
});
