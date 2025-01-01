
interface ScoreBoardProps {
  score: number
  accuracy: number
  wpm: number
}

export default function ScoreBoard({ score, accuracy, wpm }: ScoreBoardProps) {
  return (
    <div className="text-right">
      <p className="text-xl font-bold">Score: {score}</p>
      <p className="text-lg">Accuracy: {accuracy}%</p>
      <p className="text-lg">WPM: {wpm}</p>
    </div>
  )
}

