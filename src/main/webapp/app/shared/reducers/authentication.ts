import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  LOGIN: 'authentication/LOGIN',
  GET_SESSION: 'authentication/GET_SESSION',
  LOGOUT: 'authentication/LOGOUT',
  CLEAR_AUTH: 'authentication/CLEAR_AUTH',
  ERROR_MESSAGE: 'authentication/ERROR_MESSAGE'
};

const initialState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false, // Errors returned from server side
  showModalLogin: false,
  account: {} as any,
  errorMessage: null as string, // Errors returned from server side
  redirectMessage: null as string
};

export type AuthenticationState = Readonly<typeof initialState>;

// Reducer

export default (state: AuthenticationState = initialState, action): AuthenticationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.LOGIN):
    case REQUEST(ACTION_TYPES.GET_SESSION):
      return {
        ...state,
        loading: true
      };
    case FAILURE(ACTION_TYPES.LOGIN):
      return {
        ...initialState,
        errorMessage: action.payload,
        showModalLogin: true,
        loginError: true
      };
    case FAILURE(ACTION_TYPES.GET_SESSION):
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        showModalLogin: true,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.LOGIN):
      return {
        ...state,
        loading: false,
        loginError: false,
        showModalLogin: false,
        loginSuccess: true
      };
    case ACTION_TYPES.LOGOUT:
      return {
        ...initialState,
        showModalLogin: true
      };
    case SUCCESS(ACTION_TYPES.GET_SESSION): {
      const isAuthenticated = action.payload && action.payload.data && action.payload.data.activated;
      return {
        ...state,
        isAuthenticated,
        loading: false,
        account: action.payload.data
      };
    }
    case ACTION_TYPES.ERROR_MESSAGE:
      return {
        ...initialState,
        showModalLogin: true,
        redirectMessage: action.message
      };
    case ACTION_TYPES.CLEAR_AUTH:
      return {
        ...state,
        loading: false,
        showModalLogin: true,
        isAuthenticated: false
      };
    default:
      return state;
  }
};

export const displayAuthError = message => ({ type: ACTION_TYPES.ERROR_MESSAGE, message });

export const getSession = () => dispatch =>
  dispatch({
    type: ACTION_TYPES.GET_SESSION,
    payload: axios.get('api/account')
  });

export const login = (username, password, rememberMe = false) => async (dispatch, getState) => {
  const data = `j_username=${encodeURIComponent(username)}&j_password=${encodeURIComponent(
    password
  )}&remember-me=${rememberMe}&submit=Login`;
  await dispatch({
    type: ACTION_TYPES.LOGIN,
    payload: axios.post('api/authentication', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
  });
  dispatch(getSession());
};

export const logout = () => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.LOGOUT,
    payload: axios.post('api/logout', {})
  });
  dispatch(getSession());
};

export const clearAuthentication = messageKey => (dispatch, getState) => {
  dispatch(displayAuthError(messageKey));
  dispatch({
    type: ACTION_TYPES.CLEAR_AUTH
  });
};
