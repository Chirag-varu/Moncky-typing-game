
interface TypingAreaProps {
  currentText: string
  userInput: string
  onInputChange: (input: string) => void
  isGameActive: boolean
}

export default function TypingArea({ currentText, userInput, onInputChange, isGameActive }: TypingAreaProps) {
  return (
    <div className="mb-4">
      <p className="text-lg mb-2 font-mono">
        {currentText.split('').map((char, index) => (
          <span
            key={index}
            className={
              userInput[index] === undefined
                ? ''
                : userInput[index] === char
                ? 'bg-green-300'
                : 'bg-red-300'
            }
          >
            {char}
          </span>
        ))}
      </p>
      <input
        type="text"
        value={userInput}
        onChange={(e) => onInputChange(e.target.value)}
        disabled={!isGameActive}
        className="w-full p-2 border rounded"
        autoFocus
      />
    </div>
  )
}

