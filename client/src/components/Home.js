import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Box,
  Typography,
  Card,
  CardActions,
  CardContent,
} from "@mui/material";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { logout } from "../api/user-api";
import { readAllQuestions } from "../api/questions-api";
import { readAnswer } from "../api/answers-api";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 800,
    margin: "auto",
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
  },
  media: {
    minHeight: 400,
  },
  credit: {
    padding: 10,
    textAlign: "right",
    backgroundColor: "#ededed",
    borderBottom: "1px solid #d0d0d0",
    "& a": {
      color: "#3f4771",
    },
  },
  error: {
    verticalAlign: "middle",
    marginLeft: "1.5em",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
  },
  box: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const Home = ({ setIsLoggedin, isLoggedIn, username }) => {
  const classes = useStyles();
  const [logoutMsg, setLogoutMsg] = useState({
    text: "",
    flag: false,
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    logout()
      .then((data) => {
        if (data) {
          setLogoutMsg({ text: data.message, flag: true });
          setTimeout(() => setLogoutMsg({ text: "", flag: false }), 5000);
        }
      })
      .catch((err) => console.log(err));
    setIsLoggedin(false);
  };

  let sessionTimer;

  const startSessionTimer = () => {
    sessionTimer = setTimeout(handleLogout, 10 * 60 * 1000);
  };
  const resetSessionTimer = () => {
    clearTimeout(sessionTimer);
    startSessionTimer();
  };
  document.addEventListener("click", resetSessionTimer);
  document.addEventListener("keydown", resetSessionTimer);

  useEffect(() => {
    if (isLoggedIn) {
      if (!sessionTimer) startSessionTimer();
      else resetSessionTimer();
    }
    // eslint-disable-next-line
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      (async function () {
        try {
          const questions = await readAllQuestions();
          let flag = false;

          for (const question of questions) {
            const answer = await readAnswer({ questionId: question._id });
            if (!answer.answer) flag = true;
          }

          if (flag) return navigate("/yourSecurityQuestions");
        } catch (err) {
          console.log(err);
        }
      })();
    }
  });

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h4" className={classes.title}>
          Password Changer and Security Questions
        </Typography>
        <Box sx={{display: "flex", justifyContent: "center"}}>
          {logoutMsg && !isLoggedIn && (
            <Typography
              component="p"
              color="error"
              sx={{ marginTop: "1rem", fontSize: "22px" }}
            >
              {logoutMsg.text}
            </Typography>
          )}
        </Box>
      </CardContent>
      <CardActions className={classes.actions}>
        {!isLoggedIn ? (
          <Box>
            <Link to="/login">
              <Button variant="contained" sx={{ marginRight: "10px" }}>
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="contained">Register</Button>
            </Link>
          </Box>
        ) : (
          <>
            <Typography variant="h6">Welcome {username}!</Typography>
            <br />
            <Box>
              <Link to="/updatePassword">
                <Button sx={{ marginRight: "10px" }} variant="contained">
                  Change Password
                </Button>
              </Link>
              <Link to="/yourSecurityQuestions">
                <Button sx={{ marginRight: "10px" }} variant="contained">
                  Your Security Questions
                </Button>
              </Link>
              <Button variant="contained" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default Home;
