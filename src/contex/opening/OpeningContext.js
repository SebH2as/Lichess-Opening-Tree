import { createContext, useReducer } from "react";
import OpeningReducer from "./OpeningReducer";

const OpeningContext = createContext();

const OPENING_URL = process.env.REACT_APP_LICHESS_OPENING_URL

export const OpeningProvider = ({ children }) => {
  const initialState = {
    opening: {},
    loading: false,
  };

  const [state, dispatch] = useReducer(OpeningReducer, initialState);

  const fetchOpening = async (text) => {
    setLoading()

    const user = text

    const response = await fetch(`
    ${OPENING_URL}/player?player=${user}&color=white&moves=6`)
 
    const data = await response.json()

    console.log(data)

    dispatch({
      type: 'GET_OPEN',
      payload: data,
    })
 
  }

  //clear user games from state
  const clearUserOpening = () => dispatch({type: 'CLEAR_OPENING'})

  //setLoading
  const setLoading = () => dispatch({ type: "SET_LOADING" });

  return (
    <OpeningContext.Provider
      value={{
        opening: state.opening,
        loading: state.loading,
        fetchOpening,
        clearUserOpening,
      }}
    >
      {children}
    </OpeningContext.Provider>
  );
};

export default OpeningContext;
