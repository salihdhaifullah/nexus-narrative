import { GET_SAMPLE, SAMPLE_ERROR } from "../actionsTypes";
export interface Action<T, P> {
  readonly type: T;
  readonly payload?: P;
}
const initialState = {
  sample: [],
  loading: true,
};

const sampleReducer = (state = initialState, action: Action<string, number | string>) => {
  switch (action.type) {
    case GET_SAMPLE:
      return {
        ...state,
        sample: action.payload,
        loading: false,
      };

    case SAMPLE_ERROR:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default sampleReducer;
