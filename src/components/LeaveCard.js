import { useState } from "react";
import { Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { capitalize } from "lodash";

export default function LeaveCard({ name, value }) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <Accordion
      expanded={expanded === "panel1"}
      onChange={handleChange("panel1")}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography sx={{ width: "60%", flexShrink: 0 }}>
          {capitalize(name)}
        </Typography>
        <Typography
          sx={{ color: "text.secondary" }}
          style={{ fontWeight: "bold" }}
        >
          {value.length}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>{value.join("  ::  ")}</Typography>
      </AccordionDetails>
    </Accordion>
  );
}
