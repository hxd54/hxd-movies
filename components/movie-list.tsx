"use client"

import { useState, useEffect } from "react"
import MovieCard from "@/components/movie-card"
import { useMovies } from "@/hooks/use-movies"
import { Skeleton } from "@/components/ui/skeleton"

interface MovieListProps {
  selectedCategories: string[]
  selectedMood: string | null
}

export default function MovieList({ selectedCategories, selectedMood }: MovieListProps) {
  const { movies } = useMovies()
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter movies based on selected categories and mood
  const filteredMovies = movies.filter((movie) => {
    const matchesCategories =
      selectedCategories.length === 0 || selectedCategories.some((category) => movie.categories.includes(category))

    const matchesMood = !selectedMood || movie.moods.includes(selectedMood)

    return matchesCategories && matchesMood
  })

  if (isLoading) {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col h-full">
            <Skeleton className="aspect-[2/3] w-full" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredMovies.length === 0 ? (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          No movies match your selected filters. Try adjusting your criteria.
        </div>
      ) : (
        filteredMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
      )}
    </div>
  )
}
