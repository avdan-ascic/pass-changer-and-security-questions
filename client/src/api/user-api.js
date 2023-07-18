import axios from "axios";

import baseUrl from "../config";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  withCredentials: true,
  credentials: "include",
};

export const create = async (user) => {
  try {
    const response = await axios.post(
      `${baseUrl.server}/api/users/register`,
      user,
      { headers }
    );
    return response.data;
  } catch (err) {
    return err.response.data.errors ? err.response.data : err;
  }
};

export const login = async (user) => {
  try {
    const response = await axios.post(
      `${baseUrl.server}/api/users/login`,
      user,
      { headers }
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const logout = async () => {
  try {
    const response = await axios.get(`${baseUrl.server}/api/users/logout`, {
      headers,
    });
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const authenticate = async () => {
  try {
    const response = await axios.get(
      `${baseUrl.server}/api/users/authenticate`,
      { headers }
    );
    return response.data;
  } catch (err) {
    if (err?.response?.status !== 401) {
    }
  }
};

export const changePassword = async (user) => {
  try {
    const response = await axios.post(
      `${baseUrl.server}/api/users/updatePassword`,
      user,
      { headers }
    );
    return response.data;
  } catch (err) {
    console.log(err);
    return err.response.data;
  }
};

export const resetPassword = async (password) => {
  try {
    const response = await axios.post(
      `${baseUrl.server}/api/users/resetPassword`,
      password,
      { headers }
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const checkEmail = async (email) => {
  try {
    const response = await axios.post(
      `${baseUrl.server}/api/users/checkEmail`,
      email,
      { headers }
    );
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};
