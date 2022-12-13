import db from "../DataBase";

const createHabit = (obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO habits (habitArea, habitName, habitFrequency, habitHasNotification, habitNotificationFrequency, habitNotificationTime, lastCheck, daysWithoutChecks, progressBar, habitIsChecked, habitChecks) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [
          obj.habitArea,
          obj.habitName,
          obj.habitFrequency,
          obj.habitHasNotification,
          obj.habitNotificationFrequency,
          obj.habitNotificationTime,
          obj.lastCheck,
          obj.daysWithoutChecks,
          obj.progressBar,
          obj.habitIsChecked,
          obj.habitChecks,
        ],
        (_, { rowsAffected, insertId }) => {
          if (rowsAffected > 0) resolve(insertId);
          else reject("Error inserting obj: " + JSON.stringify(obj));
        },
        (_, error) => reject(error)
      );
    });
  });
};

const findByArea = (habitArea) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM habits WHERE habitArea LIKE ?;",
          [habitArea],
          (_, { rows }) => {
            if (rows.length > 0) resolve(rows._array);
          },
          (_, error) => reject(error)
        );
      });
    });
  };

export default {
  createHabit,
  findByArea
};