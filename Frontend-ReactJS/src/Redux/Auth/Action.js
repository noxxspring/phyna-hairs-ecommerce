import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import {
  REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE,
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE,
  LOGOUT
} from './ActionTypes';

// Robust Error Message Extractor
const extractErrorMessage = (error) => {
  if (error.response) {
    const data = error.response.data;
    if (typeof data === 'string' && data.length > 0) return data;
    if (data?.message) return data.message;
    if (data?.error && typeof data.error === 'string') return data.error;
    if (error.response.status === 401 || error.response.status === 400) {
      return "Invalid email address or password. Please try again.";
    }
  }
  return error.message || "Invalid email address or password.";
};

// 1. REGISTER USER
export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    const user = response.data;

    if (user.jwt) {
      localStorage.setItem('jwt', user.jwt);
    }
    dispatch({ type: REGISTER_SUCCESS, payload: user.jwt });
  } catch (error) {
    dispatch({
      type: REGISTER_FAILURE,
      payload: extractErrorMessage(error),
    });
  }
};

// 2. LOGIN USER
export const login = (userData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, userData);
    const user = response.data;

    if (user.jwt) {
      localStorage.setItem('jwt', user.jwt);
    }
    dispatch({ type: LOGIN_SUCCESS, payload: user.jwt });
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: extractErrorMessage(error),
    });
  }
};

// 3. FETCH USER PROFILE
export const getUser = (jwt) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const user = response.data;
    dispatch({ type: GET_USER_SUCCESS, payload: user });
  } catch (error) {
    dispatch({
      type: GET_USER_FAILURE,
      payload: extractErrorMessage(error),
    });
  }
};

// 4. LOGOUT USER
export const logout = () => (dispatch) => {
  localStorage.removeItem('jwt');
  dispatch({ type: LOGOUT, payload: null });
};