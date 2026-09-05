import api from '../../../config/api';
import {
  FIND_PRODUCTS_BY_CATEGORY_REQUEST,
  FIND_PRODUCTS_BY_CATEGORY_SUCCESS,
  FIND_PRODUCTS_BY_CATEGORY_FAILURE,
  FIND_PRODUCT_BY_ID_REQUEST,
  FIND_PRODUCT_BY_ID_SUCCESS,
  FIND_PRODUCT_BY_ID_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
} from './ActionType';

// 1. FETCH PRODUCTS BY CATEGORY
export const findProducts = (reqData) => async (dispatch) => {
  dispatch({ type: FIND_PRODUCTS_BY_CATEGORY_REQUEST });
  try {
    const { category, colors, sizes, minPrice, maxPrice, minDiscount, sort, stock, pageNumber, pageSize } = reqData || {};

    const cleanCategory = (category && category !== 'undefined') ? category : '';
    const cleanSort = (sort && sort !== 'undefined') ? sort : 'price_low';
    const cleanStock = (stock && stock !== 'undefined') ? stock : '';

    const { data } = await api.get(
      `/api/products?category=${cleanCategory}&minPrice=${minPrice || 0}&maxPrice=${maxPrice || 1000000}&minDiscount=${minDiscount || 0}&sort=${cleanSort}&stock=${cleanStock}&pageNumber=${pageNumber || 0}&pageSize=${pageSize || 10}`
    );

    dispatch({ type: FIND_PRODUCTS_BY_CATEGORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FIND_PRODUCTS_BY_CATEGORY_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 2. FETCH PRODUCT BY ID
export const findProductById = (reqData) => async (dispatch) => {
  dispatch({ type: FIND_PRODUCT_BY_ID_REQUEST });
  try {
    const { data } = await api.get(`/api/products/id/${reqData.productId}`);
    dispatch({ type: FIND_PRODUCT_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FIND_PRODUCT_BY_ID_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 3. CREATE PRODUCT (ADMIN)
export const createProduct = (product) => async (dispatch) => {
  dispatch({ type: CREATE_PRODUCT_REQUEST });
  try {
    const token = localStorage.getItem('jwt');
    const { data } = await api.post(`/api/admin/products/`, product, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: CREATE_PRODUCT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CREATE_PRODUCT_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 4. DELETE PRODUCT (ADMIN)
export const deleteProduct = (productId) => async (dispatch) => {
  dispatch({ type: DELETE_PRODUCT_REQUEST });
  try {
    const token = localStorage.getItem('jwt');
    const { data } = await api.delete(`/api/admin/products/${productId}/delete`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: productId });
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// 5. UPDATE PRODUCT (ADMIN)
export const updateProduct = (productId, reqData) => async (dispatch) => {
  dispatch({ type: UPDATE_PRODUCT_REQUEST });
  try {
    const token = localStorage.getItem('jwt');
    const { data } = await api.put(`/api/admin/products/${productId}/update`, reqData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};