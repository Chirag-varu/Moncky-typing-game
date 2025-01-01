
interface MonkeyAnimationProps {
  mood: 'happy' | 'sad' | 'neutral'
}

export default function MonkeyAnimation({ mood }: MonkeyAnimationProps) {
  const emojis = {
    happy: '🐵',
    sad: '🙈',
    neutral: '🐒',
  }

  return (
    <div className="text-center mb-4">
      <span className="text-6xl">{emojis[mood]}</span>
    </div>
  )
}

