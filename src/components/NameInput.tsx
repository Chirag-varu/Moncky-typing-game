import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface NameInputProps {
  onNameSubmit: (name: string) => void
}

export default function NameInput({ onNameSubmit }: NameInputProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      return onNameSubmit(name.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="max-w-xs"
      />
      <Button type="submit" disabled={!name.trim()}>
        Start Game
      </Button>
    </form>
  )
}

