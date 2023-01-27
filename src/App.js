import { words } from "./words";
import {
  Input,
  Button,
  HStack,
  Box,
  Square,
  Flex,
  FormControl,
  ScaleFade,
  Collapse,
  Center,
} from "@chakra-ui/react";
import { useRef } from "react";
import Header from "./components/Header";
import useLocalStorage from "./hooks/useLocalStorage";
import useGameState from "./hooks/useGameState";

function App() {
  const [gameState, updateGameState] = useGameState();
  useLocalStorage(gameState, updateGameState);
  const guessWordRef = useRef("");

  // HANDLE //
  // handlePopulateWord
  const handlePopulateWord = () => {
    const index = Math.floor(Math.random() * words.length);
    let singleWord = [];
    let hintArr = [];

    [...words[index]].forEach((char) => {
      singleWord.push(char.toUpperCase());
      hintArr.push({ letter: "*", correct: false });
    });

    checkNumbersOfLetters(singleWord);
    updateGameState({ type: "SET_WORD", payload: singleWord });
    updateGameState({ type: "SET_HINT", payload: hintArr });

    // ESTEREGG IN CONSOLE
    console.log(words[index]);
  };

  // handleHint
  const handleHint = () => {
    let indexArr = [];
    let hintArr = [...gameState.hint];

    hintArr.forEach((element, i) => {
      if (element.letter === "*") indexArr.push(i);
    });

    if (indexArr.length > 2) {
      const index = Math.floor(Math.random() * indexArr.length);
      hintArr[indexArr[index]].letter = gameState.word[indexArr[index]];
      updateGameState({ type: "SET_HINT", payload: hintArr });
      if (indexArr.length === 3)
        updateGameState({ type: "HINT_BUTTON", payload: true });
    }
  };

  // handleGuessWord
  const handleGuessWord = (e) => {
    e.preventDefault();
    updateGameState({ type: "DELETE_ERROR" });

    const guessWord = guessWordRef.current.value;
    if (!checkIfString(guessWord)) {
      showError("Wpisane słowo zawiera niedozwolone znaki.");
      return;
    }
    if (guessWord.length !== gameState.word.length) {
      showError(`Wpisane słowo nie zawiera ${gameState.word.length} liter.`);
      return;
    }
    if (!words.includes(guessWord.toUpperCase())) {
      showError("Słownik nie zawiera wpisanego słowa.");
      return;
    }
    let guessWordArray = [];

    [...guessWord].forEach((char, i) => {
      guessWordArray.push({
        letter: char.toUpperCase(),
        isInWord: checkIsInWord(char),
        isCorrectPlace: checkIsCorrectPlace(char, i),
        numOfOccurance: checkIsInWord(char)
          ? gameState.numberOfLetters[char.toUpperCase()]
          : null,
      });
    });

    updateGameState({
      type: "SET_GUESSED_WORDS",
      payload: [...gameState.guessedWords, guessWordArray],
    });

    showCorrectLetters(guessWordArray);
    checkIsCorrect(guessWordArray);
    guessWordRef.current.value = "";
  };
  //////////////////////////////////////////////////////////////////////////////////////

  // CHECK //
  // checkNumbersOfLetters
  const checkNumbersOfLetters = (singleWord) => {
    const count = {};
    singleWord.forEach((char) => {
      count[char] = count[char] ? count[char] + 1 : 1;
    });
    updateGameState({ type: "SET_NUM_LETTERS", payload: count });
  };

  // checkIsInWord
  const checkIsInWord = (letter) => {
    return gameState.word.includes(letter.toUpperCase());
  };

  // checkIsCorrectPlace
  const checkIsCorrectPlace = (letter, index) => {
    return gameState.word[index] === letter.toUpperCase();
  };

  // checkIsCorrect
  const checkIsCorrect = (guessWordArray) => {
    const check = guessWordArray.filter(
      (letter) => letter.isCorrectPlace !== true
    );
    if (check.length > 0) return;
    updateGameState({ type: "ADD_POINT" });

    updateGameState({
      type: "SET_SUCCESS",
      payload: `Brawo! Udało Ci się. Naciśnij "Od nowa", by zacząć kolejną rundę`,
    });
    updateGameState({
      type: "GUESS_WORD_OK",
      payload: true,
    });
  };

  // checkIfString
  const checkIfString = (string) => {
    return /^[A-Ża-ż]*$/.test(string);
  };
  //////////////////////////////////////////////////////////////////////////////////////

  // SHOW //
  // showError
  const showError = async (err) => {
    updateGameState({ type: "SET_ERROR", payload: err });
    await delay(5000);
    updateGameState({ type: "DELETE_ERROR" });
  };

  // showCorrectLetters
  const showCorrectLetters = (guessWordArray) => {
    let hintArr = [...gameState.hint];
    guessWordArray.forEach((element, i) => {
      if (element.isCorrectPlace) {
        hintArr[i].letter = element.letter;
        hintArr[i].correct = true;
      }
    });
    updateGameState({ type: "SET_HINT", payload: hintArr });
  };
  //////////////////////////////////////////////////////////////////////////////////////

  // DIFFRENT //
  // resetGame
  const resetGame = () => {
    updateGameState({ type: "RESET_GAME" });
    guessWordRef.current.value = "";
    handlePopulateWord();
  };

  // delay
  const delay = (waitTime) => {
    return new Promise((resolve) => setTimeout(resolve, waitTime));
  };

  return (
    <div className="App">
      <Header points={gameState.points} />
      <Flex gap={2} flexDir="column" align="center" pl="1rem" pr="1rem">
        <FormControl as="form" onSubmit={handleGuessWord}>
          <Flex gap={2}>
            <Input
              placeholder={`Wpisz słowo ${gameState.word.length} literowe`}
              ref={guessWordRef}
            />
            <Button
              isDisabled={gameState.guessWordOk}
              type="submit"
              colorScheme="blue"
            >
              Zgadnij
            </Button>
            <Button onClick={resetGame} colorScheme="blue">
              Od nowa
            </Button>
          </Flex>
        </FormControl>

        <Collapse
          in={gameState.error || gameState.success ? true : false}
          animateOpacity
        >
          <ScaleFade
            unmountOnExit
            initialScale={0.9}
            in={gameState.success ? true : false}
          >
            <Box
              border="2px"
              borderColor="green.700"
              p="1rem"
              mb="1rem"
              mt="1rem"
              borderRadius="1rem"
              bg="green.300"
              color="grenn.900"
            >
              {gameState.success}
            </Box>
          </ScaleFade>

          <ScaleFade
            unmountOnExit
            initialScale={0.9}
            in={gameState.error ? true : false}
          >
            <Box
              border="2px"
              borderColor="red.700"
              p="1rem"
              mb="1rem"
              mt="1rem"
              borderRadius="1rem"
              bg="red.300"
              color="red.900"
            >
              {gameState.error}
            </Box>
          </ScaleFade>
        </Collapse>

        <Collapse in={true} animateOpacity>
          <ScaleFade unmountOnExit initialScale={0.9} in={true}>
            <Flex direction="column" gap={2}>
              <HStack p={3}>
                {gameState.hint.map((letter, j) => {
                  return (
                    <Box
                      key={j}
                      borderColor={letter.correct ? "green.600" : "red.400"}
                      borderWidth="0.2rem"
                      borderRadius="1rem"
                    >
                      <Square
                        w={{ base: "2.5rem", sm: "2.5rem", lg: "3rem" }}
                        h={{ base: "2.5rem", sm: "2.5rem", lg: "3rem" }}
                        fontSize={{
                          base: "x-large",
                          sm: "x-large",
                          lg: "xx-large",
                        }}
                      >
                        {letter.letter}
                      </Square>
                    </Box>
                  );
                })}
              </HStack>

              <div>
                <Center>
                  <Button
                    isDisabled={gameState.hintButton}
                    onClick={handleHint}
                    colorScheme="blue"
                  >
                    Podpowiedź
                  </Button>
                </Center>
              </div>
              <div>
                <Center>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      updateGameState({
                        type: "SHOW_OCCURANCE",
                        payload: !gameState.showOccurance,
                      });
                    }}
                    colorScheme="blue"
                  >
                    {gameState.showOccurance
                      ? "Showaj wystąpienia"
                      : "Pokaż wystąpienia"}
                  </Button>
                </Center>
              </div>
            </Flex>
          </ScaleFade>
        </Collapse>

        {gameState.guessedWords
          .map((wordArray, i) => {
            return (
              <Collapse key={i} in={true} animateOpacity>
                <ScaleFade unmountOnExit initialScale={0.9} in={true}>
                  <HStack p={3}>
                    {wordArray.map((letter, j) => {
                      return (
                        <Box
                          key={j}
                          borderColor={
                            letter.isCorrectPlace
                              ? "green.600"
                              : letter.isInWord
                              ? "yellow.500"
                              : "gray.900"
                          }
                          borderWidth="0.2rem"
                          borderRadius="1rem"
                        >
                          <Square
                            w={{ base: "2.5rem", sm: "2.5rem", lg: "3rem" }}
                            h={{ base: "2.5rem", sm: "2.5rem", lg: "3rem" }}
                            fontSize={{
                              base: "x-large",
                              sm: "x-large",
                              lg: "xx-large",
                            }}
                          >
                            {letter.letter}
                            {gameState.showOccurance && (
                              <Box fontSize="sm">
                                {letter.numOfOccurance
                                  ? `x${letter.numOfOccurance}`
                                  : ""}
                              </Box>
                            )}
                          </Square>
                        </Box>
                      );
                    })}
                  </HStack>
                </ScaleFade>
              </Collapse>
            );
          })
          .reverse()}
      </Flex>
    </div>
  );
}

export default App;
