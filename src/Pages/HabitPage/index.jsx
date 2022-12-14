import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import SelectHabit from "../../Components/Common/HabitPage/SelectHabit";
import SelectFrequency from "../../Components/Common/HabitPage/SelectFrequency";
import Notification from "../../Components/Common/HabitPage/Notification";
import TimeDatePicker from "../../Components/Common/HabitPage/TimeDataPicker";
import UpdateExcludeButtons from "../../Components/Common/HabitPage/UpdateExcludeButtons";
import DefaultButton from "../../Components/Common/DefaultButton";
import HabitsService from "../../Service/HabitService";

export default function HabitPage({ route }) {
  const navigation = useNavigation();
  const [habitInput, setHabitInput] = useState();
  const [frequencyInput, setFrequencyInput] = useState();
  const [notificationToggle, setNotificationToggle] = useState();
  const [dayNotification, setDayNotification] = useState();
  const [timeNotification, setTimeNotification] = useState();

  const { create, habit } = route.params;

  const habitCreated = new Date();
  const formatDate = `${habitCreated.getFullYear()}-${
    habitCreated.getMonth() + 1
  }-${habitCreated.getDate()}`;

  function handleCreateHabit() {
    if (habitInput === undefined || frequencyInput === undefined) {
      Alert.alert(
        "Você precisa selecionar um hábito e frequência para continuar"
      );
    } else if (
      notificationToggle === true &&
      frequencyInput === "Diário" &&
      timeNotification === undefined
    ) {
      Alert.alert("Você precisa dizer o horário da notificação!");
    } else if (
      notificationToggle === true &&
      frequencyInput === "Diário" &&
      dayNotification === undefined &&
      timeNotification === undefined
    ) {
      Alert.alert(
        "Você precisa dizer a frequência e o horário da notificação!"
      );
    } else {
      navigation.navigate("Home", {
        createdHabit: `Created in ${habit?.habitArea}`,
      });
    }
  }

  function handleUpdateHabit() {
    if (notificationToggle === true && !dayNotification && !timeNotification) {
      Alert.alert("Você precisa colocar a frequência e horário da notificação");
    } else {
      HabitsService.createHabit({
        habitArea: habit?.habitArea,
        habitName: habitInput,
        habitFrequency: frequencyInput,
        habitHasNotification: notificationToggle,
        habitNotificationFrequency: dayNotification,
        habitNotificationTime: timeNotification,
        lastCheck: formatDate,
        daysWithoutChecks: 0,
        habitIsChecked: 0,
        progressBar: 1,
      }).then(() => {
        Alert.alert("Sucesso na criação do hábito!");

        navigation.navigate("Home", {
          createdHabit: `Created in ${habit?.habitArea}`,
        });
      });
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <TouchableOpacity
            style={styles.bakcPageBtn}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require("../../../assets/icons/arrowBack.png")}
              style={styles.arrowBack}
            />
          </TouchableOpacity>

          <View style={styles.mainContent}>
            <Text style={styles.title}>Configurações {"\n"} de hábito</Text>
            <Text style={styles.inputText}>Área</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.area}>{habit?.habitArea}</Text>
            </View>
          </View>

          <Text style={styles.inputText}>Hábito</Text>
          <SelectHabit habit={habit} habitInput={setHabitInput} />

          <Text style={styles.inputText}>Frequência</Text>
          <SelectFrequency
            habitFrequency={habit?.habitFrequency}
            frequencyInput={setFrequencyInput}
          />

          {frequencyInput === "Mensal" ? null : (
            <Notification
              notificationToggle={notificationToggle}
              setNotificationToggle={setNotificationToggle}
            />
          )}

          {notificationToggle ? (
            frequencyInput === "Mensal" ? null : (
              <TimeDatePicker
                frequency={frequencyInput}
                dayNotification={dayNotification}
                timeNotification={timeNotification}
                setDayNotification={setDayNotification}
                setTimeNotification={setTimeNotification}
              />
            )
          ) : null}

          {create === false ? (
            <UpdateExcludeButtons
              handleUpdate={handleUpdateHabit}
              habitArea={habitArea}
              habitInput={habitInput}
            />
          ) : (
            <View style={styles.configButton}>
              <DefaultButton
                buttonText={"Criar"}
                handlePress={handleCreateHabit}
                width={250}
                height={50}
              />
            </View>
          )}

          
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(21, 21, 21, 0.98)",
  },
  bakcPageBtn: {
    width: 40,
    height: 40,
    margin: 25,
  },
  arrowBack: {
    width: 40,
    height: 40,
  },
  mainContent: {
    width: 250,
    alignSelf: "center",
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    fontSize: 30,
  },
  inputText: {
    color: "white",
    fontSize: 16,
    marginTop: 35,
    marginBottom: 10,
    marginLeft: 5,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  area: {
    color: "#BBBBBB",
    fontSize: 15,
  },
});
