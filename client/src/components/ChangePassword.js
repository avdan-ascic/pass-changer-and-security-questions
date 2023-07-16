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
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";

import { changePassword } from "../api/user-api";

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
}));

const ChangePassword = () => {
  const classes = useStyles();
  const [values, setValues] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    error: "",
    redirect: false,
  });
  const navigate = useNavigate();

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = () => {
    if (values.newPassword !== values.confirmPassword) {
      setValues({
        ...values,
        error: "Passwords do not match!",
        redirect: false,
      });
      return;
    }

    changePassword(values)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, redirect: false, error: data.error });
        } else {
          setValues({ ...values, redirect: true, error: "" });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (values.redirect) {
      return navigate("/");
    }
    // eslint-disable-next-line
  }, [values.redirect]);

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h4" className={classes.title}>
          Change Password
        </Typography>
        <TextField
          id="oldPassword"
          label="Old Password"
          type="password"
          className={classes.textField}
          value={values.oldPassword}
          onChange={handleChange("oldPassword")}
          margin="normal"
        />
        <br />
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
          id="confrimPassword"
          label="Confirm Password"
          type="password"
          className={classes.textField}
          value={values.confirmPassword}
          onChange={handleChange("confirmPassword")}
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
      <CardActions>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          className={classes.submit}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </CardActions>
    </Card>
  );
};

export default ChangePassword;
