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
import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";

function App() {
  const guessWordRef = useRef("");
  const [initState, setInitState] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [word, setWord] = useState([]);
  const [numberOfLetters, setNumberOfLetters] = useState({});
  const [guessedWords, setGuessedWords] = useState([]);
  const [guessWordOk, setGuessWordOk] = useState(false);
  const [points, setPoints] = useState(0);
  const [hint, setHint] = useState([]);
  const [hintButton, setHintButton] = useState(false);
  const [showOccurance, setShowOccurance] = useState(false);

  const handlePopulateWord = () => {
    const index = Math.floor(Math.random() * words.length);
    console.log(words[index]);
    let singleWord = [];
    let hintArr = [];
    for (let i = 0; i < words[index].length; i++) {
      singleWord.push(words[index][i].toUpperCase());
      hintArr.push({ letter: "*", correct: false });
    }

    checkNumbersOfLetters(singleWord);
    setWord(singleWord);
    setHint(hintArr);
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

  const checkIfString = (string) => {
    return /^[A-Ża-ż]*$/.test(string);
  };

  const resetGame = () => {
    setWord([]);
    setNumberOfLetters({});
    setGuessedWords([]);
    setGuessWordOk(false);
    setError("");
    setSuccess("");
    setHintButton(false);
    guessWordRef.current.value = "";
    handlePopulateWord();
  };

  const handleHint = () => {
    let indexArr = [];
    let hintArr = [...hint];
    for (let i = 0; i < hint.length; i++) {
      if (hint[i].letter === "*") indexArr.push(i);
    }

    if (indexArr.length > 2) {
      const index = Math.floor(Math.random() * indexArr.length);
      hintArr[indexArr[index]].letter = word[indexArr[index]];
      setHint(hintArr);
      if (indexArr.length === 3) setHintButton(true);
    }
  };

  const handleSaveToLocal = () => {
    if (!initState) {
      const save = {
        word,
        numberOfLetters,
        guessedWords,
        guessWordOk,
        points,
        hint,
        hintButton,
        showOccurance,
      };

      localStorage.setItem("save", JSON.stringify(save));
    }
    setInitState(false);
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
    if (!checkIfString(guessWord)) {
      showError("Wpisane słowo zawiera niedozwolone znaki.");
      return;
    }
    if (guessWord.length !== word.length) {
      showError(`Wpisane słowo nie zawiera ${word.length} liter.`);
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
    showCorrectLetters(guessWordArray);
    setGuessedWords([...guessedWords, guessWordArray]);
    checkIsCorrect(guessWordArray);
    guessWordRef.current.value = "";
    handleSaveToLocal();
  };

  const showCorrectLetters = (guessWordArray) => {
    let hintArr = [...hint];
    for (let i = 0; i < guessWordArray.length; i++) {
      if (guessWordArray[i].isCorrectPlace) {
        hintArr[i].letter = guessWordArray[i].letter;
        hintArr[i].correct = true;
      }
    }
    setHint(hintArr);
  };

  useEffect(() => {
    handlePopulateWord();
    const numPoints = localStorage.getItem("points");
    const save = JSON.parse(localStorage.getItem("save"));
    if (numPoints) setPoints(parseInt(numPoints));
    if (save) {
      setWord(save.word);
      setNumberOfLetters(save.numberOfLetters);
      setGuessedWords(save.guessedWords);
      setGuessWordOk(save.guessWordOk);
      setHint(save.hint);
      setHintButton(save.hintButton);
      setShowOccurance(save.showOccurance);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    handleSaveToLocal();
    console.log("handleSave");
    // eslint-disable-next-line
  });
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

        <Collapse in={true} animateOpacity>
          <ScaleFade unmountOnExit initialScale={0.9} in={true}>
            <Flex direction="column" gap={2}>
              <HStack p={3}>
                {hint.map((letter, j) => {
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
                    isDisabled={hintButton}
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
                      setShowOccurance(!showOccurance);
                    }}
                    colorScheme="blue"
                  >
                    {showOccurance ? "Showaj wystąpienia" : "Pokaż wystąpienia"}
                  </Button>
                </Center>
              </div>
            </Flex>
          </ScaleFade>
        </Collapse>

        {guessedWords
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
                            {showOccurance && (
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
