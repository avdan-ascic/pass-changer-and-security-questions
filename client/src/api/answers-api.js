import axios from "axios";

import baseUrl from "../config";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  withCredentials: true,
  credentials: "include",
};
export const readAnswer = async (data) => {
  try {
    const response = await axios.post(
      `${baseUrl.server}/api/answers/read`,
      data,
      { headers }
    );
    return response.data;
  } catch (err) {
    return err;
  }
};

export const updateAnswers = async (data) => {
  try {
    const response = await axios.post(
      `${baseUrl.server}/api/answers/update`,
      data,
      { headers }
    );
    return response.data;
  } catch (err) {
    return err;
  }
};

export const compareAnswers = async (data) => {
  try {
    const response = await axios.post(
      `${baseUrl.server}/api/answers/compare`,
      data,
      { headers }
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};
