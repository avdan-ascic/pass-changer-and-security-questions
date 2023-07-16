import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  Icon,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import { resetPassword } from "../api/user-api";

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

const ResetPassword = ({ findEmail }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    email: "",
    newPassword: "",
    confPassword: "",
    error: "",
    redirect: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!findEmail.email) return navigate("/answerQuestions");
    else setValues({ ...values, email: findEmail.email });
    // eslint-disable-next-line
  }, []);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmitPassword = () => {
    if (values.newPassword !== values.confPassword) {
      setValues({
        ...values,
        error: "Passwords do not match!",
        redirect: false,
      });
      return;
    }

    resetPassword(values)
      .then((data) => {
        if (data.error) {
          setValues({
            ...values,
            redirect: false,
            error: data.error,
          });
        } else {
          setValues({ ...values, redirect: true, error: "" });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (values.redirect) {
      return navigate("/login");
    }
    // eslint-disable-next-line
  }, [values.redirect]);

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h4" className={classes.title}>
          Reset Password
        </Typography>
        <TextField
          id="newPassword"
          label="New Password"
          type="password"
          className={classes.textField}
          value={values.newPassword}
          onChange={handleChange("newPassword")}
          margin="normal"
        />
        <br />
        <TextField
          id="confPassword"
          label="Confirm Password"
          type="password"
          className={classes.textField}
          value={values.confPassword}
          onChange={handleChange("confPassword")}
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
          color="primary"
          variant="contained"
          onClick={handleSubmitPassword}
        >
          Submit
        </Button>
      </CardActions>
    </Card>
  );
};

export default ResetPassword;
