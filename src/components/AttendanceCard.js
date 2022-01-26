import { Box, Grid, Tooltip } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Switch } from "@mui/material";
import { Checkbox } from "@mui/material";
import { capitalize } from "lodash";

const people = ["anjan", "gokul", "gangadhar", "trainer"];

export default function AttendanceCard({
  datedData,
  handleCardChanges,
  enableServerButton,
  updateData,
}) {
  const { isGymOpen } = datedData;

  return (
    <Box maxWidth={250} my={3}>
      <Card>
        <CardContent>
          <Typography>
            Is Gym Open{"  "}
            <Switch
              checked={isGymOpen}
              id={"isGymOpen"}
              onChange={handleCardChanges}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Typography>
          {isGymOpen && (
            <Box>
              {people.map((person) => (
                <Box key={person}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item xs={9}>
                      {capitalize(person)}
                    </Grid>
                    <Grid item xs={3}>
                      <Checkbox
                        id={person}
                        checked={datedData[person]}
                        onChange={handleCardChanges}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>

        <CardActions>
          <Tooltip title="Read-Only: Writing to Database is Restricted">
            <span>
              <Button
                variant="contained"
                onClick={updateData}
                // disabled={!enableServerButton}
                disabled
              >
                Update in Server
              </Button>
            </span>
          </Tooltip>
        </CardActions>
      </Card>
    </Box>
  );
}
