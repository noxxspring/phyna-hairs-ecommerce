import api, { API_BASE_URL } from '../../../config/api';
import {
  ADD_ITEM_TO_CART_REQUEST,
  ADD_ITEM_TO_CART_SUCCESS,
  ADD_ITEM_TO_CART_FAILURE,
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  GET_CART_FAILURE,
  REMOVE_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_SUCCESS,
  REMOVE_CART_ITEM_FAILURE,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
} from './ActionType';

// 1. ADD ITEM TO CART
export const addItemToCart = (reqData) => async (dispatch) => {
  dispatch({ type: ADD_ITEM_TO_CART_REQUEST });
  try {
    const token = localStorage.getItem('jwt');
    const { data } = await api.put('/api/cart/add', reqData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({ type: ADD_ITEM_TO_CART_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ADD_ITEM_TO_CART_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 2. GET USER CART
export const getCart = () => async (dispatch) => {
  dispatch({ type: GET_CART_REQUEST });
  try {
    const token = localStorage.getItem('jwt');
    const { data } = await api.get('/api/cart/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({ type: GET_CART_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_CART_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 3. REMOVE CART ITEM
export const removeCartItem = (cartItemId) => async (dispatch) => {
  dispatch({ type: REMOVE_CART_ITEM_REQUEST });
  try {
    const token = localStorage.getItem('jwt');
    const { data } = await api.delete(`/api/cart_items/${cartItemId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({ type: REMOVE_CART_ITEM_SUCCESS, payload: cartItemId });
  } catch (error) {
    dispatch({
      type: REMOVE_CART_ITEM_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 4. UPDATE CART ITEM
export const updateCartItem = (reqData) => async (dispatch) => {
  dispatch({ type: UPDATE_CART_ITEM_REQUEST });
  try {
    const token = localStorage.getItem('jwt');
    const { data } = await api.put(`/api/cart_items/${reqData.cartItemId}`, reqData.data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: UPDATE_CART_ITEM_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};