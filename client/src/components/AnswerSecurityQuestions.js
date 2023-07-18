import { useState, useEffect } from "react";
import {
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardActions,
  Icon,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";

import { checkEmail } from "../api/user-api";
import { compareAnswers } from "../api/answers-api";
import { readTwoQuestions } from "../api/questions-api";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  error: {
    marginTop: theme.spacing(5),
    verticalAlign: "middle",
  },
  title: {
    marginTop: theme.spacing(3),
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

const AnswerSecurityQuestions = ({ findEmail, setFindEmail }) => {
  const classes = useStyles();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChangeEmail = (e) => {
    setFindEmail({ ...findEmail, email: e.target.value });
  };

  const handleSubmitEmail = () => {
    if (!findEmail.email)
      return setFindEmail({
        ...findEmail,
        error: "Insert an email address!",
        correct: false,
      });

    checkEmail(findEmail)
      .then((data) => {
        if (data.error) {
          setFindEmail({
            ...findEmail,
            redirect: false,
            error: data.error,
          });
        } else {
          setFindEmail({ ...findEmail, correct: true, error: "" });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (questions.length === 0) {
      const fetchData = async () => {
        try {
          const data = await readTwoQuestions();
          setQuestions(data);
          const dataAnswers = data.map((question) => ({
            questionId: question._id,
            answer: "",
          }));
          setAnswers(dataAnswers);
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }
  }, [questions]);

  const handleChangeAnswers = (question) => (e) => {
    let tempAnswers = answers;
    let tempObj = answers.find((obj) => obj.questionId === question);
    tempObj.answer = e.target.value;
    tempAnswers = tempAnswers.filter(
      (obj) => obj.questionId !== tempObj.questionId
    );
    tempAnswers.push(tempObj);

    setAnswers(tempAnswers);
  };

  const handleSubmitAnswers = async () => {
    try {
      const data = await compareAnswers({ email: findEmail.email, answers });
      if (data.error) {
        setError(data.error);
      } else {
        setError("");
        navigate("/resetPassword");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {!findEmail.correct ? (
        <Card className={classes.card}>
          <CardContent>
            <Typography
              variant="h4"
              component="div"
              gutterBottom
              className={classes.title}
            >
              Insert Email
            </Typography>
            <TextField
              id="email"
              label="Email"
              value={findEmail.email}
              variant="standard"
              className={classes.textField}
              onChange={handleChangeEmail}
              margin="normal"
            />
            <br />

            {findEmail.error && (
              <Typography component="p" color="error">
                <Icon color="error" className={classes.error} />
                {findEmail.error}
              </Typography>
            )}
          </CardContent>
          <CardActions className={classes.actions}>
            <Button
              variant="contained"
              className={classes.submit}
              color="primary"
              onClick={handleSubmitEmail}
            >
              Submit
            </Button>
          </CardActions>
        </Card>
      ) : (
        <Card className={classes.card}>
          <CardContent>
            <Typography
              variant="h4"
              component="div"
              gutterBottom
              className={classes.title}
            >
              Your Security Questions
            </Typography>
            {questions.map((item, index) => {
              return (
                <Box key={index}>
                  <Typography
                    sx={{ marginTop: "1.5rem", fontSize: "22px" }}
                    component="p"
                  >
                    {item.question}
                  </Typography>
                  <TextField
                    className={classes.textField}
                    sx={{ marginTop: "1rem" }}
                    variant="outlined"
                    label="Answer"
                    value={
                      answers.find((answer) => answer.questionId === item._id)
                        ?.answer || ""
                    }
                    onChange={handleChangeAnswers(item._id)}
                  />
                </Box>
              );
            })}
            {error && (
              <Typography component="p" color="error">
                <Icon color="error" className={classes.error} /> {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmitAnswers}
              sx={{ marginTop: "30px" }}
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AnswerSecurityQuestions;
