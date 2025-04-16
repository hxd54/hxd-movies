"use client"

import type React from "react"

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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useMovies } from "@/hooks/use-movies"
import { Check } from "lucide-react"
import type { Movie } from "@/types/movie"

interface EditMovieDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  movieId: string
}

export default function EditMovieDialog({ open, onOpenChange, movieId }: EditMovieDialogProps) {
  const { movies, updateMovie } = useMovies()
  const [formData, setFormData] = useState<Omit<Movie, "id" | "likes" | "dislikes">>({
    title: "",
    description: "",
    imageUrl: "",
    trailerUrl: "",
    categories: [],
    moods: [],
  })
  const [isSaving, setIsSaving] = useState(false)

  const categories = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Sci-Fi",
    "Romance",
    "Thriller",
    "Animation",
    "Documentary",
  ]
  const moods = ["Happy", "Sad", "Excited", "Relaxed", "Thoughtful", "Inspired", "Nostalgic", "Adventurous"]
  const translatorCategories = [
    "Rocky",
    "Gaheza",
    "Savimbi",
    "Sankara",
    "B The Great",
    "Junior Giti",
    "Senior",
    "Dylan",
  ]

  // Load movie data when dialog opens
  useEffect(() => {
    if (open && movieId) {
      const movie = movies.find((m) => m.id === movieId)
      if (movie) {
        setFormData({
          title: movie.title,
          description: movie.description,
          imageUrl: movie.imageUrl,
          trailerUrl: movie.trailerUrl,
          categories: [...movie.categories],
          moods: [...movie.moods],
        })
      }
    }
  }, [open, movieId, movies])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleCategory = (category: string) => {
    setFormData((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category]
      return { ...prev, categories }
    })
  }

  const toggleMood = (mood: string) => {
    setFormData((prev) => {
      const moods = prev.moods.includes(mood) ? prev.moods.filter((m) => m !== mood) : [...prev.moods, mood]
      return { ...prev, moods }
    })
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // Update the movie
      updateMovie(movieId, {
        ...formData,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      onOpenChange(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Movie</DialogTitle>
          <DialogDescription>Update the movie details and recommendations.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Movie Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter movie title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter movie description"
              className="min-h-[100px]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="imageUrl">Cover Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="trailerUrl">Trailer URL (YouTube Embed)</Label>
            <Input
              id="trailerUrl"
              name="trailerUrl"
              value={formData.trailerUrl}
              onChange={handleChange}
              placeholder="Enter YouTube embed URL"
            />
          </div>

          <div className="grid gap-2">
            <Label>Categories</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-category-${category}`}
                    checked={formData.categories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <label
                    htmlFor={`edit-category-${category}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Translator Categories</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {translatorCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-translator-${category}`}
                    checked={formData.categories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <label
                    htmlFor={`edit-translator-${category}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Moods</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {moods.map((mood) => (
                <div key={mood} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-mood-${mood}`}
                    checked={formData.moods.includes(mood)}
                    onCheckedChange={() => toggleMood(mood)}
                  />
                  <label
                    htmlFor={`edit-mood-${mood}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {mood}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
