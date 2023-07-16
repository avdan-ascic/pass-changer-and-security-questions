import axios from 'axios'

import baseUrl from "../config"

const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    withCredentials: true,
    credentials: "include",
  };

  export const readAllQuestions = async () => {
    try {
      const response = await axios.get(`${baseUrl.server}/api/questions/readAll`, { headers })
      return response.data
    } catch (err) {
      console.log(err)
      return err
    }
  }
  
  export const readTwoQuestions = async () => {
    try {
      const response = await axios.get(`${baseUrl.server}/api/questions/readTwo`, { headers })
      return response.data
    } catch (err) {
      console.log(err)
      return err
    }
  }