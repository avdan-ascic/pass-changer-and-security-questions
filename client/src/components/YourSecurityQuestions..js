import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { readAnswer, updateAnswers } from "../api/answers-api";
import { readAllQuestions } from "../api/questions-api";
import { makeStyles } from "@material-ui/core/styles";

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
    marginTop: theme.spacing(2),
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

const YourSecurityQuestions = () => {
  const classes = useStyles();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (questions.length === 0) {
      readAllQuestions()
        .then((data) => {
          setQuestions(data);
          let tempAnswers = answers;
          for (const question of data) {
            tempAnswers.push({ questionId: question._id, answer: "" });
          }
          setAnswers(tempAnswers);
        })
        .then(() => {
          for (const answer of answers) {
            readAnswer({ questionId: answer.questionId })
              .then((data) => {
                let tempAnswers = answers;
                let tempObj = answers.find(
                  (obj) => obj.questionId === answer.questionId
                );
                tempObj.answer = data.answer;
                tempAnswers = tempAnswers.filter(
                  (obj) => obj.questionId !== tempObj.questionId
                );
                tempAnswers.push(tempObj);

                setAnswers(tempAnswers);
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line
  }, []);

  const handleChange = (question) => (e) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = prevAnswers.map((answer) => {
        if (answer.questionId === question) {
          return { ...answer, answer: e.target.value };
        }
        return answer;
      });
      return updatedAnswers;
    });
  };

  const handleSubmit = () => {
    updateAnswers(answers)
      .then(() => {
        return navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h4" className={classes.title}>
          Your Security Questions
        </Typography>
        {questions.length > 0 &&
          questions.map((item, index) => {
            return (
              <Box key={index}>
                <Typography
                  component="p"
                  sx={{ marginTop: "1.5rem", fontSize: "22px" }}
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
                  onChange={handleChange(item._id)}
                />
              </Box>
            );
          })}
      </CardContent>
      <CardActions className={classes.actions}>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </CardActions>
    </Card>
  );
};

export default YourSecurityQuestions;
