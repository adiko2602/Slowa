import { polish } from "./resources/polish";
import { polishSixLetters } from "./resources/polishSixLetters";
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
  RadioGroup,
  Stack,
  Radio,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import useLocalStorage from "./hooks/useLocalStorage";
import useGameState from "./hooks/useGameState";

let arrOfWords = [...polish, ...polishSixLetters];

function App() {
  const [gameState, updateGameState] = useGameState();
  const [modeState, setModeState] = useState(gameState.mode);
  const guessWordRef = useRef("");

  // HANDLE //
  // handlePopulateWord
  const handlePopulateWord = () => {
    let index = findIndex(arrOfWords);
    if (gameState.mode === "random") {
      while (arrOfWords[index].length < 4 || arrOfWords[index].length > 8) {
        index = findIndex(arrOfWords);
      }
    } else {
      while (arrOfWords[index].length !== parseInt(gameState.mode)) {
        index = findIndex(arrOfWords);
      }
    }
    let singleWord = [];
    let hintArr = [];

    [...arrOfWords[index]].forEach((char) => {
      singleWord.push(char.toUpperCase());
      hintArr.push({ letter: "*", correct: false });
    });

    checkNumbersOfLetters(singleWord);
    updateGameState({ type: "SET_WORD", payload: singleWord });
    updateGameState({ type: "SET_HINT", payload: hintArr });

    // ESTEREGG IN CONSOLE
    console.log(arrOfWords[index]);
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
    const w = arrOfWords.filter(
      (element) => element.toUpperCase() === guessWord.toUpperCase()
    );
    if (w.length < 1) {
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

  // handleSetMode
  const handleSetMode = (value) => {
    updateGameState({ type: "SET_MODE", payload: value });
    setModeState(value);
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

  // findIndex
  const findIndex = (arr) => {
    return Math.floor(Math.random() * arr.length);
  };

  useEffect(() => {
    resetGame();
    // eslint-disable-next-line
  }, [modeState]);
  useLocalStorage(gameState, updateGameState, resetGame);

  return (
    <div className="App">
      <Header points={gameState.points} />
      <Flex flexDir="column" align="center" mb="1rem">
        <FormLabel as="legend">Ilość liter w słowie: </FormLabel>
        <RadioGroup onChange={handleSetMode} value={gameState.mode}>
          <Stack
            gap={1}
            mb={"1rem"}
            // direction={{ base: "column", lg: "row" }}
            direction="row"
          >
            <Radio colorScheme="blue" value="4">
              4
            </Radio>
            <Radio colorScheme="blue" value="5">
              5
            </Radio>
            <Radio colorScheme="blue" value="6">
              6
            </Radio>
            <Radio colorScheme="blue" value="7">
              7
            </Radio>
            <Radio colorScheme="blue" value="8">
              8
            </Radio>
            <Radio colorScheme="blue" value="random">
              Losowo
            </Radio>
          </Stack>
        </RadioGroup>
      </Flex>
      <Flex gap={2} flexDir="column" align="center" pl="1rem" pr="1rem">
        <FormControl as="form" onSubmit={handleGuessWord}>
          <Flex gap={2}>
            <Input
              size={{ base: "sm", lg: "md" }}
              placeholder={`Wpisz słowo ${gameState.word.length} literowe`}
              ref={guessWordRef}
            />
            <Button
              size={{ base: "sm", lg: "md" }}
              isDisabled={gameState.guessWordOk}
              type="submit"
              colorScheme="blue"
            >
              <Text fontSize={{ base: "xs", lg: "sm" }}>Zgadnij</Text>
            </Button>
            <Button
              size={{ base: "sm", lg: "md" }}
              onClick={resetGame}
              colorScheme="blue"
            >
              <Text fontSize={{ base: "xs", lg: "sm" }}>Od nowa</Text>
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
                        w={{ base: "2rem", sm: "2rem", lg: "3rem" }}
                        h={{ base: "2rem", sm: "2rem", lg: "3rem" }}
                        fontSize={{
                          base: "large",
                          sm: "large",
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
                    size={{ base: "sm", lg: "md" }}
                    isDisabled={gameState.hintButton}
                    onClick={handleHint}
                    colorScheme="blue"
                  >
                    <Text fontSize={{ base: "xs", lg: "sm" }}>Podpowiedź</Text>
                  </Button>
                </Center>
              </div>
              <div>
                <Center>
                  <Button
                    size={{ base: "sm", lg: "md" }}
                    onClick={(e) => {
                      e.preventDefault();
                      updateGameState({
                        type: "SHOW_OCCURANCE",
                        payload: !gameState.showOccurance,
                      });
                    }}
                    colorScheme="blue"
                  >
                    <Text fontSize={{ base: "xs", lg: "sm" }}>
                      {gameState.showOccurance
                        ? "Showaj wystąpienia"
                        : "Pokaż wystąpienia"}
                    </Text>
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
                            w={{ base: "2rem", sm: "2rem", lg: "3rem" }}
                            h={{ base: "2rem", sm: "2rem", lg: "3rem" }}
                            fontSize={{
                              base: "large",
                              sm: "large",
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
