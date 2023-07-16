import { useState, useEffect } from "react";
import {
  CardContent,
  Typography,
  Button,
  Card,
  CardActions,
  TextField,
  Icon,
} from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { login } from "../api/user-api";
import { readAllQuestions } from "../api/questions-api";
import { readAnswer } from "../api/answers-api";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  error: {
    verticalAlign: "middle",
  },
  title: {
    marginTop: theme.spacing(2),

    color: theme.palette.openTitle,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
  actions: {
    display: "flex",
    justifyContent: "center",
  },
}));

const Login = ({ setIsLoggedin, setUsername }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    redirect: false,
  });
  const [locked, setLocked] = useState(false);
  const navigate = useNavigate();

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = () => {
    const user = {
      email: values.email,
      password: values.password,
    };

    login(user)
      .then((data) => {
        if (data.error) {
          setValues({
            ...values,
            redirect: false,
            error: data.error,
          });
          if (data.locked === true) setLocked(true);
        } else {
          setIsLoggedin(true);
          setUsername(data.user.name);
          setValues({ ...values, redirect: true, error: "" });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const checkAnswersAndRedirect = async () => {
      if (values.redirect) {
        try {
          const questions = await readAllQuestions();
          let flag = false;

          for (const question of questions) {
            const answer = await readAnswer({ questionId: question._id });
            if (!answer.answer) {
              flag = true;
              break;
            }
          }

          if (flag) {
            navigate("/yourSecurityQuestions");
          } else {
            navigate("/");
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    checkAnswersAndRedirect();
    // eslint-disable-next-line
  }, [values.redirect]);

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h4" className={classes.title}>
          Login
        </Typography>
        <TextField
          id="email"
          label="Email"
          type="email"
          className={classes.textField}
          value={values.email}
          onChange={handleChange("email")}
          margin="normal"
        />
        <br />
        <TextField
          id="password"
          label="Password"
          type="password"
          className={classes.textField}
          value={values.password}
          onChange={handleChange("password")}
          margin="normal"
        />
        <br />

        {values.error && (
          <Typography component="p" color="error">
            <Icon color="error" className={classes.error} />
            {values.error}
          </Typography>
        )}
      </CardContent>
      <CardActions className={classes.actions}>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          disabled={locked}
          color="primary"
        >
          Login
        </Button>
        {locked ? (
          <Link to="/answerQuestions">
            <Button color="primary" variant="contained">
              Reset Password
            </Button>
          </Link>
        ) : (
          <Link to="/answerQuestions">
            <Button variant="contained" color="primary">
              Forgot Password
            </Button>
          </Link>
        )}
      </CardActions>
    </Card>
  );
};

export default Login;
