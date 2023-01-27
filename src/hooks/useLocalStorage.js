import { useEffect } from "react";

export default function useLocalStorage(gameState, updateGameState) {
  const setSave = () => {
    if (gameState) localStorage.setItem("save", JSON.stringify(gameState));
  };

  const getSave = async () => {
    const saveData = await JSON.parse(localStorage.getItem("save"));
    if (saveData) updateGameState({ type: "SET_SAVE", payload: saveData });
    updateGameState({ type: "INIT_STATE", payload: false });
  };

  useEffect(() => {
    if (!gameState.initState) {
      setSave();
    }
  }, [gameState]);

  useEffect(() => {
    getSave();
  }, []);

  return [setSave, getSave];
}
