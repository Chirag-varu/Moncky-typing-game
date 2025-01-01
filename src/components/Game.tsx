"use client"

import { useState, useEffect, useCallback } from 'react'
import TypingArea from './TypingArea'
import Timer from './Timer'
import ScoreBoard from './ScoreBoard'
import MonkeyAnimation from './MonkeyAnimation'
import NameInput from './NameInput'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const difficulties = {
  beginner: ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog'],
  intermediate: ['The quick brown fox jumps over the lazy dog.'],
  advanced: ['The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!'],
}

export default function Game() {
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [currentText, setCurrentText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [score, setScore] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [initialTime, setInitialTime] = useState(60)
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isGameActive, setIsGameActive] = useState(false)
  const [monkeyMood, setMonkeyMood] = useState<'happy' | 'sad' | 'neutral'>('neutral')
  const [playerName, setPlayerName] = useState('')

  const startGame = useCallback(() => {
    setIsGameActive(true)
    setScore(0)
    setAccuracy(100)
    setTimeLeft(initialTime)
    setUserInput('')
    setCurrentText(difficulties[difficulty][Math.floor(Math.random() * difficulties[difficulty].length)])
  }, [difficulty, initialTime])

  const endGame = useCallback(() => {
    setIsGameActive(false)
    setMonkeyMood('neutral')
    alert(`Game Over! Your score: ${score}, Accuracy: ${accuracy}%`)
  }, [score, accuracy])

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && isGameActive) {
      endGame()
    }
  }, [timeLeft, isGameActive, endGame])

  const handleInputChange = (input: string) => {
    setUserInput(input)
    const correctChars = input.split('').filter((char, index) => char === currentText[index]).length
    const newAccuracy = Math.round((correctChars / input.length) * 100) || 100
    setAccuracy(newAccuracy)
    setMonkeyMood(newAccuracy > 80 ? 'happy' : 'sad')

    if (input === currentText) {
      setScore(prevScore => prevScore + 1)
      setCurrentText(difficulties[difficulty][Math.floor(Math.random() * difficulties[difficulty].length)])
      setUserInput('')
    }
  }

  if (!playerName) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-300 p-4">
        <h1 className="text-4xl font-bold mb-8 text-brown-600">Monkey Typing Game</h1>
        <NameInput onNameSubmit={setPlayerName} />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-300 p-4">
      <h1 className="text-4xl font-bold mb-8 text-brown-600">Monkey Typing Game</h1>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex justify-between items-center">
            <Select onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setDifficulty(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={startGame} disabled={isGameActive}>
              Start Game
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Set Timer:</span>
            <Select onValueChange={(value) => setInitialTime(parseInt(value))} disabled={isGameActive}>
              <SelectTrigger className="w-[180px]">
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
          <ScoreBoard score={score} accuracy={accuracy} />
        </div>
      </div>
    </div>
  )
}

