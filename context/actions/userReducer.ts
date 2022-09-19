import * as actions from "../actionsTypes";
import { Dispatch } from 'redux';
import * as api from '../../api'
import { ILogin, ISingUp } from "../../types/user";

export const singUp = (data: ISingUp) => async (dispatch: Dispatch) => {
  try {
    await api.singUp(data).then(({data}) => dispatch({type: actions.SING_UP_USER, payload: data})).catch((err) => dispatch({type: actions.ERROR, payload: err.massage}));
  } catch (error: any) {
    dispatch({type: actions.ERROR, payload: error.massage});
  }
};


export const login = (data: ILogin) => async (dispatch: Dispatch) => {
  try {
    await api.Login(data).then(({data}) => dispatch({type: actions.LOGIN_USER, payload: data})).catch((err) => dispatch({type: actions.ERROR, payload: err.massage}));
  } catch (error: any) {
    dispatch({type: actions.ERROR, payload: error.massage});
  }
};

export const logout = () => async (dispatch: Dispatch) => {
  try {
    await api.Logout().then(({data}) => dispatch({type: actions.LOGOUT_USER, payload: data})).catch((err) => dispatch({type: actions.ERROR, payload: err.massage}));
  } catch (error: any) {
    dispatch({type: actions.ERROR, payload: error.massage});
  }
};

