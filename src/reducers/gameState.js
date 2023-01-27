export const initState = {
  initState: true,
  error: "",
  success: "",
  word: [],
  numberOfLetters: {},
  guessedWords: [],
  guessWordOk: false,
  points: 0,
  hint: [],
  hintButton: false,
  showOccurance: false,
};

export function reducer(state, action) {
  switch (action.type) {
    // INIT STATE
    case "INIT_STATE":
      return { ...state, initState: action.payload };

    // ERROR STATE
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "DELETE_ERROR":
      return { ...state, error: "" };

    // SUCCESS STATE
    case "SET_SUCCESS":
      return { ...state, success: action.payload };
    case "DELETE_SUCCESS":
      return { ...state, success: "" };

    // WORD STATE
    case "SET_WORD":
      return { ...state, word: action.payload };
    case "DELETE_WORD":
      return { ...state, word: [] };

    // NUMBER OF LETTERS STATE
    case "SET_NUM_LETTERS":
      return { ...state, numberOfLetters: action.payload };
    case "DELETE_NUM_LETTERS":
      return { ...state, numberOfLetters: {} };

    // GUESSED WORDS
    case "SET_GUESSED_WORDS":
      return { ...state, guessedWords: action.payload };
    case "DELETE_GUESSED_WORDS":
      return { ...state, guessedWords: [] };

    // GUESS WORD OK
    case "GUESS_WORD_OK":
      return { ...state, guessWordOk: action.payload };

    // POINTS
    case "SET_POINTS":
      return { ...state, points: action.payload };
    case "ADD_POINT":
      return { ...state, points: state.points + 1 };

    // HINT
    case "SET_HINT":
      return { ...state, hint: action.payload };
    case "DELETE_HINT":
      return { ...state, hint: [] };

    // HINT BUTTON
    case "HINT_BUTTON":
      return { ...state, hintButton: action.payload };

    // SHOW OCCURANCE
    case "SHOW_OCCURANCE":
      return { ...state, showOccurance: action.payload };

    // RESET GAME
    case "RESET_GAME":
      return {
        ...state,
        word: [],
        numberOfLetters: {},
        guessedWords: [],
        guessWordOk: false,
        error: "",
        success: "",
        hintButton: false,
      };

    // RESET ALL
    case "RESET_ALL":
      return { initState };

    case "GET_SAVE":
      return { state };

    case "SET_SAVE":
      return action.payload;

    default:
      return { state };
  }
}
