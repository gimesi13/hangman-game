import { useCallback, useEffect, useState } from "react";
import { HangmanDrawing } from "./HangmanDrawing";
import { Keyboard } from "./Keyboard";
import { HangmanWord } from "./HangmanWord";
import words from "./wordList.json";

function getWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function App() {
  /* chooses a random word from the wordList json */
  const [wordToGuess, setWordToGuess] = useState(() => {
    return words[Math.floor(Math.random() * words.length)];
  });
  /* the letters we type */
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  /* the letters that dont match the letters of the word */
  const incorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );

  const isLoser: boolean = incorrectLetters.length >= 6; //bc there are 6 bodyparts
  const isWinner: boolean = wordToGuess
    .split("")
    .every((letter) => guessedLetters.includes(letter)); //see "every" array method (if all letters are in the guessed array return true)

  /* FUNCTIONS */
  /* useCallback to only render when things in its dependency change */
  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return;

      setGuessedLetters((currentLetters) => [...currentLetters, letter]);
    },
    [guessedLetters, isWinner, isLoser]
  );

  /* KEYBOARD EVENTLISTENER/handler */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessedLetter(key);
    };

    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessedLetters]);

  /* enter to play again func */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (key !== "Enter") return;

      e.preventDefault();
      setGuessedLetters([]);
      setWordToGuess(getWord());
    };

    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, []);

  return (
    <div
      className="App"
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: " 0 auto",
        alignItems: "center",
      }}
    >
      <div>
        {isWinner && "Your Won! - press Enter to play again"}
        {isLoser && "Nice Try - press Enter to play again"}
      </div>
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={wordToGuess}
      />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter((letter) =>
            wordToGuess.includes(letter)
          )}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  );
}

export default App;
