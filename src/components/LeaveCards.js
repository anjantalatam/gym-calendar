import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import LeaveCard from "./LeaveCard";
import { getDocs } from "@firebase/firestore";
import { Typography } from "@mui/material";
import { get } from "lodash";

export default function LeaveCards({ statsRef }) {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const getStats = async () => {
      const data = await getDocs(statsRef);
      setStats(
        data.docs
          .map((doc) => ({ [doc.id]: doc.data() }))
          .reduce((o, e) => {
            const key = Object.keys(e)[0];
            o[key] = e[key];
            return o;
          }, {})
      );
    };
    getStats();
  }, [statsRef]);

  return (
    <Box maxWidth={300}>
      <Typography
        mt={5}
        mb={3}
        py={1}
        variant="h5"
        style={{
          textAlign: "center",
          backgroundColor: "grey",
          color: "white",
          borderRadius: "20px",
        }}
      >
        Arnold - STATS
      </Typography>
      {
        <LeaveCard
          key={"isGymOpen"}
          name={"Gym"}
          value={get(stats, ["isGymOpen", "dates"], [])}
        />
      }
      <Typography
        mt={5}
        mb={3}
        py={0.25}
        variant="h6"
        style={{
          textAlign: "center",
          backgroundColor: "grey",
          color: "white",
          borderRadius: "20px",
        }}
      >
        Gym Day-Off
      </Typography>
      {Object.keys(stats).map((key) => {
        if (key !== "isGymOpen") {
          return (
            <LeaveCard key={key} name={key} value={stats[key]["leaveDates"]} />
          );
        }
        return null;
      })}
    </Box>
  );
}
