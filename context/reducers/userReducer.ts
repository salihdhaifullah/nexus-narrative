import { IUser } from "../../types/user";
import * as actions from "../actionsTypes";

interface Action<T, P> {
    readonly type: T;
    readonly payload?: P;
}

const initialState = { user: null, loading: true, error: null, massage: null };

const userReducer = (state = initialState, action: Action<string, IUser | string>) => {
    switch (action.type) {
        case actions.SING_UP_USER:
            return {
                ...state,
                user: action.payload,
                loading: false,
            };

        case actions.LOGIN_USER:
            return {
                ...state,
                user: action.payload,
                loading: false,
            };

        case actions.LOGOUT_USER:
            return {
                ...state,
                massage: action.payload,
                loading: false,
            };

        case actions.ERROR:
            return {
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }

};

export default userReducer;