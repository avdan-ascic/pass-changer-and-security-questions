import { useState, useEffect } from "react";
import {
  CardContent,
  Typography,
  Button,
  Card,
  CardActions,
  TextField,
  Icon,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { create } from "../api/user-api";

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

const Register = () => {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
    redirect: false,
  });
  const navigate = useNavigate();

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = () => {
    if (values.password !== values.confirmPassword) {
      setValues({
        ...values,
        error: "Passwords do not match!",
        redirect: false,
      });
      return;
    }

    create(values)
      .then((data) => {
        if (data.errors && data.errors.length > 0) {
          const errorMessage = data.errors.map((error) => error.msg).join(", ");
          setValues({ ...values, error: errorMessage });
        } else {
          setValues({ ...values, redirect: true });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (values.redirect) navigate("/login");
    // eslint-disable-next-line
  }, [values.redirect]);

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h4" className={classes.title}>
            Register
          </Typography>
          <TextField
            id="name"
            label="Name"
            className={classes.textField}
            value={values.name}
            onChange={handleChange("name")}
            margin="normal"
            variant="standard"
          />
          <br />
          <TextField
            id="email"
            label="Email"
            type="email"
            className={classes.textField}
            value={values.email}
            onChange={handleChange("email")}
            margin="normal"
            variant="standard"
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
            variant="standard"
          />
          <br />
          <TextField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            className={classes.textField}
            value={values.confirmPassword}
            onChange={handleChange("confirmPassword")}
            margin="normal"
            variant="standard"
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
            color="primary"
            variant="contained"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default Register;
