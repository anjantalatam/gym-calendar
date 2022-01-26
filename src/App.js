import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import DateAdapter from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import moment from "moment";
import AttendanceCard from "./components/AttendanceCard";
import { Typography, Snackbar, Alert } from "@mui/material";
import lodash from "lodash";
import "./App.css";
// import SyncFirebase from "./firebase/SyncFirebase";

import {
  // getDocs,
  doc,
  // addDoc,
  collection,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase/firebase-config";
import LeaveCards from "./components/LeaveCards";

const defaultData = {
  anjan: false,
  gangadhar: false,
  gokul: false,
  isGymOpen: false,
  trainer: false,
};

export default function App() {
  const [date, setDate] = useState(moment());
  const [datedData, setDatedData] = useState(defaultData);
  const [initialData, setInitialData] = useState(defaultData);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [isServerUpdated, setIsServerUpdated] = useState("");

  const gymCollectionRef = useMemo(() => collection(db, "gym"), []);
  const statsCollectionRef = useMemo(() => collection(db, "stats"), []);

  const today = moment().format("DD-MM-YYYY");

  useEffect(() => {
    const getDatedData = async () => {
      const selectedDate = date?.format("DD-MM-YYYY") || today;
      const docRef = doc(gymCollectionRef, selectedDate);
      const datedDoc = await getDoc(docRef);

      if (datedDoc.exists()) {
        setDatedData(datedDoc.data());
        setInitialData(datedDoc.data());
      } else {
        setDatedData(defaultData);
      }
    };
    console.log("ß");
    getDatedData();
    setInitialData(defaultData);
  }, [date, gymCollectionRef, today]);

  useEffect(() => {
    setIsDataChanged(!lodash.isEqual(initialData, datedData));
  }, [initialData, datedData]);

  const handleDatePickerChange = (newValue) => {
    setDate(newValue);
  };

  const handleCardChanges = ({ target }) => {
    const clonedData = lodash.cloneDeep(datedData);
    Object.keys(clonedData).forEach((key) => {
      if (target.id === "isGymOpen" && !target.checked) {
        clonedData[key] = target.checked;
      } else if (key === target.id) {
        clonedData[key] = target.checked;
      }
    });
    setDatedData(clonedData);
  };

  const updateStats = async (selectedDate) => {
    const statsDocs = Object.keys(defaultData);

    for (let i = 0; i < statsDocs.length; i++) {
      const docRef = doc(statsCollectionRef, statsDocs[i]);
      const docs = await getDoc(docRef);

      if (docs.exists()) {
        const currentData = docs.data();

        if (statsDocs[i] === "isGymOpen") {
          const index = currentData.dates.findIndex(
            (item) => item === selectedDate
          );
          if (datedData[statsDocs[i]] && index === -1) {
            currentData.dates.push(selectedDate);
          } else if (!datedData[statsDocs[i]] && index !== -1) {
            currentData.dates.splice(index, 1);
          }
        } else {
          const index = currentData.leaveDates.findIndex(
            (item) => item === selectedDate
          );
          console.log(index, statsDocs[i]);
          if (!datedData[statsDocs[i]] && index === -1 && datedData.isGymOpen) {
            currentData.leaveDates.push(selectedDate);
          } else if (datedData[statsDocs[i]] && index !== -1) {
            currentData.leaveDates.splice(index, 1);
          } else if (index !== -1 && !datedData.isGymOpen) {
            currentData.leaveDates.splice(index, 1);
          }
        }
        await updateDoc(docRef, currentData);
      } else {
        console.log("Updating Stats Failed");
      }
    }
  };

  const handleUpdateData = async () => {
    try {
      const selectedDate = date.format("DD-MM-YYYY").toString();
      const docRef = doc(gymCollectionRef, selectedDate);
      const datedDoc = await getDoc(docRef);
      if (datedDoc.exists()) {
        await updateDoc(docRef, datedData);
      } else {
        await setDoc(docRef, datedData);
      }
      await updateStats(selectedDate);
      setSnackBarOpen(true);
      setIsServerUpdated(true);
      setInitialData(datedData);
    } catch (e) {
      console.log(e);
      setSnackBarOpen(true);
      setIsServerUpdated(false);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        my={5}
        // style={{ backgroundColor: "grey" }}
      >
        <Box my={3}>
          <Typography
            variant="h3"
            className="header"
            align="center"
            style={{
              backgroundColor: "#4f4e4c",
              color: "white",
              borderRadius: 20,
            }}
            p={2}
          >
            Gym Sons 🏋️‍♂️
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            style={{
              fontStyle: "italic",
            }}
          >
            version 1.1.5
          </Typography>
        </Box>

        <Box my={2}>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DesktopDatePicker
              label="Date"
              inputFormat="DD/MM/yyyy"
              value={date}
              onChange={handleDatePickerChange}
              // disabled
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
        <AttendanceCard
          datedData={datedData}
          handleCardChanges={handleCardChanges}
          enableServerButton={isDataChanged}
          updateData={handleUpdateData}
        />

        <LeaveCards statsRef={statsCollectionRef} />
        {/* <SyncFirebase /> */}
        {/* <Button onClick={updateStats}>Update Stats</Button> */}
        <Snackbar
          open={snackBarOpen}
          onClose={() => setSnackBarOpen(false)}
          autoHideDuration={5000}
        >
          <Alert
            severity={isServerUpdated ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {isServerUpdated
              ? "Data Updated in Server"
              : "Data fetch/ update failed"}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
