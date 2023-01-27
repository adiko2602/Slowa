import { useReducer } from "react";
import { initState, reducer } from "../reducers/gameState";

export default function useGameState() {
  const [gameState, updateGameState] = useReducer(reducer, initState);
  return [gameState, updateGameState];
}
