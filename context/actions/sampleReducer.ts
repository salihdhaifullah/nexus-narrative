import { GET_SAMPLE, SAMPLE_ERROR } from "../actionsTypes";
import { Dispatch } from 'redux';


export const getSampleData = () => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: GET_SAMPLE,
      payload: [1, 2, 3, 4, 5, 6],
    });
  } catch (error) {
    dispatch({
      type: SAMPLE_ERROR,
      payload: "error message",
    });
  }
};