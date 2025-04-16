"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMovies } from "@/hooks/use-movies"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"

interface EditRecommendationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryName: string
}

export default function EditRecommendationDialog({ open, onOpenChange, categoryName }: EditRecommendationDialogProps) {
  const { movies, getRecommendedMovie, updateCategoryRecommendation } = useMovies()
  const [selectedMovieId, setSelectedMovieId] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  // Set the initial selected movie when the dialog opens
  useEffect(() => {
    if (open) {
      const currentRecommendation = getRecommendedMovie(categoryName)
      setSelectedMovieId(currentRecommendation?.id || "")
    }
  }, [open, categoryName, getRecommendedMovie])

  const handleSave = async () => {
    setIsSaving(true)

    // Update the recommendation
    updateCategoryRecommendation(categoryName, selectedMovieId)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setIsSaving(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95vw]">
        <DialogHeader>
          <DialogTitle>Edit Recommended Movie</DialogTitle>
          <DialogDescription>Choose a movie to recommend for the "{categoryName}" category.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="movie-select">Select Movie</Label>
            <Select value={selectedMovieId} onValueChange={setSelectedMovieId}>
              <SelectTrigger id="movie-select">
                <SelectValue placeholder="Select a movie" />
              </SelectTrigger>
              <SelectContent>
                {movies.map((movie) => (
                  <SelectItem key={movie.id} value={movie.id}>
                    {movie.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !selectedMovieId}>
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" /> Save
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
