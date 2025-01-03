"use client";

import { useState, useEffect, useCallback } from "react";
import TypingArea from "./TypingArea";
import Timer from "./Timer";
import ScoreBoard from "./ScoreBoard";
import MonkeyAnimation from "./MonkeyAnimation";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
import NameInput from "./NameInput";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const difficulties = {
  beginner: ["the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog"],
  intermediate: ["The quick brown fox jumps over the lazy dog."],
  advanced: [
    "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!",
  ],
};

export default function Game() {
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [currentText, setCurrentText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [initialTime, setInitialTime] = useState(30);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isGameActive, setIsGameActive] = useState(false);
  const [monkeyMood, setMonkeyMood] = useState<"happy" | "sad" | "neutral">("neutral");
  const [playerName, setPlayerName] = useState("");
  const [wpm, setWpm] = useState(0);
  const [typewriterKey, setTypewriterKey] = useState(0);
  const [gameHistory, setGameHistory] = useState<
    { score: number; accuracy: number; wpm: number; difficulty: string }[]
  >([]);

  const startGame = useCallback(() => {
    setIsGameActive(true);
    setScore(0);
    setAccuracy(100);
    setWpm(0);
    setTimeLeft(initialTime);
    setUserInput("");
    setCurrentText(difficulties[difficulty][Math.floor(Math.random() * difficulties[difficulty].length)]);
    setTypewriterKey((prevKey) => prevKey + 1);
  }, [difficulty, initialTime]);

  const endGame = useCallback(() => {
    setIsGameActive(false);
    setMonkeyMood("neutral");

    // Add game details to history
    setGameHistory((prevHistory) => [
      ...prevHistory,
      { score, accuracy, wpm, difficulty },
    ]);

    alert(`Game Over! Your score: ${score}, Accuracy: ${accuracy}%, WPM: ${wpm}`);
  }, [score, accuracy, wpm, difficulty]);

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isGameActive) {
      endGame();
    }
  }, [timeLeft, isGameActive, endGame]);

  const handleInputChange = (input: string) => {
    setUserInput(input);
    const correctChars = input.split("").filter((char, index) => char === currentText[index]).length;
    const newAccuracy = Math.round((correctChars / input.length) * 100) || 100;
    setAccuracy(newAccuracy);
    setMonkeyMood(newAccuracy > 80 ? "happy" : "sad");

    if (input === currentText) {
      setScore((prevScore) => prevScore + currentText.length);
      setCurrentText(difficulties[difficulty][Math.floor(Math.random() * difficulties[difficulty].length)]);
      setUserInput("");

      // Calculate WPM
      const elapsedMinutes = (initialTime - timeLeft) / 60;
      const wordsTyped = score / 5; // Assuming an average word length of 5 characters
      const newWpm = Math.round(wordsTyped / elapsedMinutes) || 0;
      setWpm(newWpm);
    }
  };

  if (!playerName) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-300 p-4">
        <TypewriterEffectSmooth key={typewriterKey} words={[{ text: "Monkey" }, { text: "Typing" }, { text: "Game" }]} />
        <NameInput onNameSubmit={setPlayerName} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-300 p-4">
      <TypewriterEffectSmooth words={[{ text: "Monkey" }, { text: "Typing" }, { text: "Game" }]} />
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <span className="text-sm font-medium">Set difficulty:</span>
            <Select
              value={difficulty}
              onValueChange={(value: "beginner" | "intermediate" | "advanced") => setDifficulty(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={startGame} disabled={isGameActive} className="w-full sm:w-auto mt-4 sm:mt-0">
            Start Game
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <span className="text-sm font-medium">Set Timer:</span>
          <Select
            value={String(initialTime)}
            onValueChange={(value) => setInitialTime(parseInt(value))}
            disabled={isGameActive}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 seconds</SelectItem>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="60">1 minute</SelectItem>
              <SelectItem value="90">1.5 minutes</SelectItem>
              <SelectItem value="120">2 minutes</SelectItem>
              <SelectItem value="180">3 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <MonkeyAnimation mood={monkeyMood} />
        <TypingArea
          currentText={currentText}
          userInput={userInput}
          onInputChange={handleInputChange}
          isGameActive={isGameActive}
        />
        <div className="flex justify-between items-center mt-4">
          <Timer timeLeft={timeLeft} />
          <ScoreBoard score={score} accuracy={accuracy} wpm={wpm} />
        </div>
      </div>

      {/* Game History Section */}
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 mt-8">
        <h2 className="text-lg font-semibold mb-4">Game History</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Game</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Difficulty</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Score</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Accuracy</th>
                <th className="border border-gray-300 px-4 py-2 text-left">WPM</th>
              </tr>
            </thead>
            <tbody>
              {gameHistory.length > 0 ? (
                gameHistory.map((game, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{game.difficulty}</td>
                    <td className="border border-gray-300 px-4 py-2">{game.score}</td>
                    <td className="border border-gray-300 px-4 py-2">{game.accuracy}%</td>
                    <td className="border border-gray-300 px-4 py-2">{game.wpm}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="border border-gray-300 px-4 py-2 text-center">
                    No games played yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
