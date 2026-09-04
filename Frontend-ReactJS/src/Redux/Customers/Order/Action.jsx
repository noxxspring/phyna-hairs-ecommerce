import api from '../../../config/api';
import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  GET_ORDER_BY_ID_REQUEST,
  GET_ORDER_BY_ID_SUCCESS,
  GET_ORDER_BY_ID_FAILURE,
  GET_ORDER_HISTORY_REQUEST,
  GET_ORDER_HISTORY_SUCCESS,
  GET_ORDER_HISTORY_FAILURE,
} from './ActionType';

// 1. CREATE ORDER (POST /api/orders/)
export const createOrder = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_ORDER_REQUEST });
  try {
    const token = localStorage.getItem('jwt');
    const { data } = await api.post('/api/orders/', reqData.address, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });

    if (data.id) {
      reqData.navigate(`/checkout?step=3&order_id=${data.id}`);
    }
  } catch (error) {
    dispatch({
      type: CREATE_ORDER_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 2. GET ORDER BY ID (GET /api/orders/{orderId})
export const getOrderById = (orderId) => async (dispatch) => {
  dispatch({ type: GET_ORDER_BY_ID_REQUEST });
  try {
    const token = localStorage.getItem('jwt');
    const { data } = await api.get(`/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: GET_ORDER_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_ORDER_BY_ID_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 3. GET USER ORDER HISTORY (GET /api/orders/user)
export const getOrderHistory = () => async (dispatch) => {
  dispatch({ type: GET_ORDER_HISTORY_REQUEST });
  try {
    const token = localStorage.getItem('jwt');
    const { data } = await api.get('/api/orders/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: GET_ORDER_HISTORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_ORDER_HISTORY_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};