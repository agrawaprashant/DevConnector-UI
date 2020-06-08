import * as actionTypes from "./actionTypes";
import { setAuthorizationToken } from "../../shared/utility";
import io from "socket.io-client";
import axios from "axios";
import config from "../../config/app-config.json";

const registrationStart = () => {
  return {
    type: actionTypes.REGISTRATION_START,
  };
};

const registrationSuccess = (token) => {
  return {
    type: actionTypes.REGISTRATION_SUCCESS,
    payload: {
      token: token,
    },
  };
};

const registrationFailed = (error) => {
  return {
    type: actionTypes.REGISTRATION_FAILED,
    payload: {
      error: error,
    },
  };
};

export const register = (name, email, password) => {
  return async (dispatch) => {
    try {
      dispatch(registrationStart());
      const registrationdata = {
        name: name,
        email: email,
        password: password,
      };

      const result = await axios.post(
        `${config.api.baseURL}/${config.api.endPoints.users}`,
        registrationdata
      );
      localStorage.setItem("jwtToken", result.data.token);
      dispatch(registrationSuccess(result.data.token));
      dispatch(fetchUser(result.data.token));
    } catch (err) {
      console.log(err.response.data.errors[0].msg);
      dispatch(registrationFailed(err.response.data.errors[0].msg));
    }
  };
};

const fetchUserDetailsStart = () => {
  return {
    type: actionTypes.FETCH_USER_DETAILS_START,
  };
};
const fetchUserDetailsSuccess = (userData, socket) => {
  socket.emit("CONNECTED_USER", userData._id);
  return {
    type: actionTypes.FETCH_USER_DETAILS_SUCCESS,
    payload: {
      name: userData.name,
      id: userData._id,
      email: userData.email,
      avatar: userData.avatar,
      following: userData.following,
      followers: userData.followers,
      chats: userData.chats,
    },
  };
};
const fetchUserDetailsFailed = (error) => {
  return {
    type: actionTypes.FETCH_USER_DETAILS_FAILED,
    payload: {
      error: error,
    },
  };
};

export const fetchUser = (token, socket) => {
  return async (dispatch) => {
    try {
      dispatch(fetchUserDetailsStart());
      setAuthorizationToken(token);
      const result = await axios.get(
        `${config.api.baseURL}/${config.api.endPoints.auth}`
      );
      dispatch(fetchUserDetailsSuccess(result.data, socket));
    } catch (err) {
      console.log(err.response.data.errors[0].msg);
      dispatch(fetchUserDetailsFailed(err.response.data.errors[0].msg));
    }
  };
};

const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};
const authSuccess = (token, socket) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload: {
      token: token,
      socket: socket,
    },
  };
};
const authFailed = (error) => {
  return {
    type: actionTypes.AUTH_FAILED,
    payload: {
      error: error,
    },
  };
};

export const login = (email, password, setError) => {
  return async (dispatch) => {
    try {
      dispatch(authStart());
      setAuthorizationToken();
      const loginData = {
        email: email,
        password: password,
      };
      const result = await axios.post(
        `${config.api.baseURL}/${config.api.endPoints.auth}/`,
        loginData
      );
      const socket = io(`${config.socket}`, {
        transports: ["websocket"],
      });
      dispatch(authSuccess(result.data.token, socket));
      dispatch(fetchUser(result.data.token, socket));
      setError(null);
    } catch (err) {
      console.log(err.response.data.errors[0].msg);
      dispatch(authFailed(err.response.data.errors[0].msg));
      setError(err.response.data.errors[0].msg);
    }
  };
};

const authLogout = () => {
  localStorage.removeItem("jwtToken");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const logout = () => {
  return (dispatch) => {
    dispatch(authLogout());
  };
};
