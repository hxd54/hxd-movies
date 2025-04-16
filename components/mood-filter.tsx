"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const moods = ["Happy", "Sad", "Excited", "Relaxed", "Thoughtful", "Inspired", "Nostalgic", "Adventurous"]

interface MoodFilterProps {
  onMoodChange?: (mood: string | null) => void
}

export default function MoodFilter({ onMoodChange }: MoodFilterProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)

  const handleMoodSelect = (mood: string) => {
    const newMood = mood === selectedMood ? null : mood
    setSelectedMood(newMood)

    if (onMoodChange) {
      onMoodChange(newMood)
    }
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap pb-2">
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => (
          <Button
            key={mood}
            variant={selectedMood === mood ? "default" : "outline"}
            size="sm"
            onClick={() => handleMoodSelect(mood)}
            className="text-xs sm:text-sm h-8"
          >
            {mood}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}
