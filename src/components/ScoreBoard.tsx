
interface ScoreBoardProps {
  score: number
  accuracy: number
}

export default function ScoreBoard({ score, accuracy }: ScoreBoardProps) {
  return (
    <div className="text-right">
      <p className="text-xl font-bold">Score: {score}</p>
      <p className="text-lg">Accuracy: {accuracy}%</p>
    </div>
  )
}

