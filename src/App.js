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
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";

function App() {
  const guessWordRef = useRef("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [word, setWord] = useState([]);
  const [numberOfLetters, setNumberOfLetters] = useState({});
  const [guessedWords, setGuessedWords] = useState([]);
  const [guessWordOk, setGuessWordOk] = useState(false);
  const [points, setPoints] = useState(0);
  const [guessWordFade, setGuessWordFade] = useState(false);

  const handlePopulateWord = () => {
    const index = Math.floor(Math.random() * words.length);
    console.log(words[index]);
    let singleWord = [];
    for (let i = 0; i < words[index].length; i++) {
      singleWord.push(words[index][i].toUpperCase());
    }
    checkNumbersOfLetters(singleWord);
    setWord(singleWord);
  };

  const checkNumbersOfLetters = (singleWord) => {
    const count = {};
    singleWord.forEach((char) => {
      count[char] = count[char] ? count[char] + 1 : 1;
    });
    setNumberOfLetters(count);
  };

  const checkIsInWord = (letter) => {
    return word.includes(letter.toUpperCase());
  };

  const checkIsCorrectPlace = (letter, index) => {
    return word[index] === letter.toUpperCase();
  };

  const checkIsCorrect = (guessWordArray) => {
    const check = guessWordArray.filter(
      (letter) => letter.isCorrectPlace !== true
    );
    if (check.length > 0) return;
    setPoints(() => {
      localStorage.setItem("points", points + 1);
      return points + 1;
    });
    setSuccess(
      `Brawo! Udało Ci się. Naciśnij "Od nowa", by zacząć kolejną rundę`
    );
    setGuessWordOk(true);
  };

  const resetGame = () => {
    setWord([]);
    setNumberOfLetters({});
    setGuessedWords([]);
    setGuessWordOk(false);
    setError("");
    setSuccess("");
    guessWordRef.current.value = "";
    handlePopulateWord();
  };

  const showError = async (err) => {
    setError(err);
    await delay(5000);
    setError("");
  };

  const delay = (waitTime) => {
    return new Promise((resolve) => setTimeout(resolve, waitTime));
  };
  const handleGuessWord = (e) => {
    e.preventDefault();
    setError("");
    const guessWord = guessWordRef.current.value;
    if (guessWord.length !== word.length) {
      showError(`Wpisane słowo nie zawiera ${word.length} liter`);
      return;
    }
    if (!words.includes(guessWord.toUpperCase())) {
      showError("Słownik nie zawiera wpisanego słowa.");
      return;
    }
    let guessWordArray = [];
    for (let i = 0; i < guessWord.length; i++) {
      guessWordArray.push({
        letter: guessWord[i].toUpperCase(),
        isInWord: checkIsInWord(guessWord[i]),
        isCorrectPlace: checkIsCorrectPlace(guessWord[i], i),
        numOfOccurance: checkIsInWord(guessWord[i])
          ? numberOfLetters[guessWord[i].toUpperCase()]
          : null,
      });
    }
    setGuessedWords([...guessedWords, guessWordArray]);
    checkIsCorrect(guessWordArray);
    guessWordRef.current.value = "";
  };

  useEffect(() => {
    handlePopulateWord();
    const numPoints = localStorage.getItem("points");
    if (numPoints) setPoints(parseInt(numPoints));
  }, []);

  return (
    <div className="App">
      <Header points={points} />
      <Flex gap={2} flexDir="column" align="center" pl="1rem" pr="1rem">
        <FormControl as="form" onSubmit={handleGuessWord}>
          <Flex gap={2}>
            <Input
              placeholder={`Wpisz słowo ${word.length} literowe`}
              ref={guessWordRef}
            />
            <Button isDisabled={guessWordOk} type="submit" colorScheme="blue">
              Zgadnij
            </Button>
            <Button onClick={resetGame} colorScheme="blue">
              Od nowa
            </Button>
          </Flex>
        </FormControl>

        <Collapse in={error || success ? true : false} animateOpacity>
          <ScaleFade
            unmountOnExit
            initialScale={0.9}
            in={success ? true : false}
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
              {success}
            </Box>
          </ScaleFade>

          <ScaleFade unmountOnExit initialScale={0.9} in={error ? true : false}>
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
              {error}
            </Box>
          </ScaleFade>
        </Collapse>

        {guessedWords
          .map((wordArray, i) => {
            return (
              <Collapse in={true} animateOpacity>
                <ScaleFade key={i} unmountOnExit initialScale={0.9} in={true}>
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
                              : "gray.700"
                          }
                          borderWidth="0.2rem"
                          borderRadius="1rem"
                        >
                          <Square w="3rem" h="3rem" fontSize="xx-large">
                            {letter.letter}
                            <Box fontSize="sm">
                              {letter.numOfOccurance
                                ? `x${letter.numOfOccurance}`
                                : ""}
                            </Box>
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
