import { createContext, useReducer } from "react";
import LichessReducer from "./LichessReducer";
import * as d3 from 'd3-hierarchy';
const LichessContext = createContext();

const LICHESS_URL = process.env.REACT_APP_LICHESS_URL

export const LichessProvider = ({ children }) => {
  const initialState = {
    games: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(LichessReducer, initialState);

  //const objGames = [];
  const groupedArray = []; // grouped array of all moves from all games with double or more removed

  var opTree = {}// object of nested objects of all moves from all games with double or more removed


  const readStream = (processLine) => (response) => { // split stream in objects 
    const stream = response.body.getReader();
    const matcher = /\r?\n/;
    const decoder = new TextDecoder();
    let buf = "";

    const loop = () =>
      stream.read().then(({ done, value }) => {
        if (done) {
          if (buf.length > 0) processLine(JSON.parse(buf));
        } else {
          const chunk = decoder.decode(value, {
            stream: true,
          });
          buf += chunk;

          const parts = buf.split(matcher);
          buf = parts.pop();
          for (const i of parts.filter((p) => p)) processLine(JSON.parse(i));
          return loop();
        }
      });

    return loop();
  };

  const stream = async (text) => { // get all user games 
    setLoading();

    const user = text;

    const response = await fetch(
      `${LICHESS_URL}/api/games/user/${user}?max=100&color=white&perfType="bullet","blitz","rapid","classical"`,
      { headers: { Accept: "application/x-ndjson" } }
    );
    return response;
  };

  const onMessage = (obj) => { // transformation of the object game and construction of the object needed for the graph

    if(obj.winner === undefined)obj.winner = "draw";

    let arrayMoves = obj.moves.split(" ");

    const nbOfMoves = 6; // number of moves used for analysis

    arrayMoves.length = nbOfMoves;

    let arrayMovesNumber = [{"name": '0 start',   "parent": "", "attributes": {"white": 0, "black": 0, "draw": 0}}]; // organisation array to prepare hierachisation with starting object inside
    let temp = ""

    for(let i = 0; i <= arrayMoves.length; i++){ // loop into the object.moves to name move properly for hierarchisation
      if(i === 0){
        let moveNumber = {"name": i+1 + ' ' + arrayMoves[i] + ' 0 start',   "parent": "0 start", "attributes": {"white": 0, "black": 0, "draw": 0}}
        arrayMovesNumber.push(moveNumber)
        temp = i+1 + ' ' + arrayMoves[i] + ' 0 start'
      }
      if(i > 0 && i < arrayMoves.length){
        let moveNumber = {"name": i+1 + ' ' + arrayMoves[i] + ' ' + temp ,   "parent": temp, "attributes": {"white": 0, "black": 0, "draw": 0}}
        arrayMovesNumber.push(moveNumber)
        let temp2 = temp
        temp = i+1 + ' ' + arrayMoves[i] + ' ' + temp2
      }

      if(i === arrayMoves.length){ // add a final object with game result white/move/draw
        let moveNumber = {"name": obj.winner ,   "parent": temp, "attributes": {"white": 0, "black": 0, "draw": 0}}
        arrayMovesNumber.push(moveNumber)
      }
      
    }

    for(let i = 0; i < arrayMovesNumber.length; i ++){
      if(obj.winner === "white"){
        arrayMovesNumber[i].attributes.white =+ 1;
      }
      if(obj.winner === "black"){
        arrayMovesNumber[i].attributes.black =+ 1;
      }
      if(obj.winner === "draw"){
        arrayMovesNumber[i].attributes.draw =+ 1;
      }
    }

    // console.log(obj.winner)
    // console.log(arrayMovesNumber[nbOfMoves + 1].parent)
    
    if(groupedArray.findIndex(element => arrayMovesNumber[nbOfMoves + 1] === "white" && element.parent === arrayMovesNumber[nbOfMoves + 1].parent) > -1){
      //arrayMovesNumber[i].name = arrayMovesNumber[i].name + " +1"
      console.log(arrayMovesNumber[nbOfMoves + 1].parent + ' white')
    }
    if(groupedArray.findIndex(element => arrayMovesNumber[nbOfMoves + 1] === "black" && element.parent === arrayMovesNumber[nbOfMoves + 1].parent) > -1){
      arrayMovesNumber[7].name = arrayMovesNumber[7].name + " +1";
      console.log(arrayMovesNumber[7].parent + ' black ' + arrayMovesNumber[7].count)
    }
    if(groupedArray.findIndex(element => arrayMovesNumber[nbOfMoves + 1].name === "draw" && element.parent === arrayMovesNumber[nbOfMoves + 1].parent) > -1){
      //arrayMovesNumber[i].name = arrayMovesNumber[i].name + " +1"
    }
      
    //console.log(arrayMovesNumber)
    
    for(let i=0; i < arrayMovesNumber.length; i++){ // remove doublon or more in arrayMoveNumber and update white black draw results
      const exists = groupedArray.findIndex(element => element.name === arrayMovesNumber[i].name && element.parent === arrayMovesNumber[i].parent) > -1;
      if(exists) {
        
        let index = groupedArray.findIndex(element => element.name === arrayMovesNumber[i].name && element.parent === arrayMovesNumber[i].parent)
        groupedArray[index].attributes.white = groupedArray[index].attributes.white + arrayMovesNumber[i].attributes.white;
        groupedArray[index].attributes.black = groupedArray[index].attributes.black + arrayMovesNumber[i].attributes.black;
        groupedArray[index].attributes.draw = groupedArray[index].attributes.draw + arrayMovesNumber[i].attributes.draw;
      
      }

      if (!exists) {
          groupedArray.push(arrayMovesNumber[i])
      }
    }
    

    //objGames.push(obj);
  };

  const onComplete = () => {
    console.log(groupedArray)
    
    opTree = d3.stratify() // transformation of the array of objects in a hierarchical object of nested object
    .id(function(d) { return d.name; })
    .parentId(function(d) { return d.parent; })
    (groupedArray);
    
    console.log(opTree)

    console.log("The stream has completed");
    dispatch({
      type: "GET_GAMES",
      payload: opTree,
    });
  };

  //clear user games from state
  const clearUserGames = () => dispatch({type: 'CLEAR_GAMES'})

  //setLoading
  const setLoading = () => dispatch({ type: "SET_LOADING" });

  return (
    <LichessContext.Provider
      value={{
        games: state.games,
        loading: state.loading,
        stream,
        readStream,
        onMessage,
        onComplete,
        clearUserGames,
      }}
    >
      {children}
    </LichessContext.Provider>
  );
};

export default LichessContext;
