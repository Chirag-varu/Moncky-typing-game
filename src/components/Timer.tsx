
interface TimerProps {
  timeLeft: number
}

export default function Timer({ timeLeft }: TimerProps) {
  return (
    <div className="text-xl font-bold">
      Time: {timeLeft}s
    </div>
  )
}

