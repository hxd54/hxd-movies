"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Movie, CategoryRecommendation, TranslatorCategory } from "@/types/movie"
import { TRANSLATOR_CATEGORIES } from "@/types/movie"

// Mock data - in a real app, this would come from an API or database
const initialMovies: Movie[] = [
  {
    id: "1",
    title: "Inception",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    imageUrl: "/placeholder.svg?height=400&width=300",
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
    categories: ["Sci-Fi", "Action", "Thriller"],
    moods: ["Thoughtful", "Excited"],
    likes: 124,
    dislikes: 18,
  },
  {
    id: "2",
    title: "The Shawshank Redemption",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    imageUrl: "/placeholder.svg?height=400&width=300",
    trailerUrl: "https://www.youtube.com/embed/6hB3S9bIaco",
    categories: ["Drama"],
    moods: ["Inspired", "Thoughtful"],
    likes: 256,
    dislikes: 5,
  },
  {
    id: "3",
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    imageUrl: "/placeholder.svg?height=400&width=300",
    trailerUrl: "https://www.youtube.com/embed/EXeTwQWrcwY",
    categories: ["Action", "Crime", "Drama"],
    moods: ["Excited", "Thoughtful"],
    likes: 198,
    dislikes: 22,
  },
  {
    id: "4",
    title: "Pulp Fiction",
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    imageUrl: "/placeholder.svg?height=400&width=300",
    trailerUrl: "https://www.youtube.com/embed/s7EdQ4FqbhY",
    categories: ["Crime", "Drama"],
    moods: ["Excited", "Thoughtful"],
    likes: 167,
    dislikes: 31,
  },
  {
    id: "5",
    title: "The Lord of the Rings: The Fellowship of the Ring",
    description:
      "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    imageUrl: "/placeholder.svg?height=400&width=300",
    trailerUrl: "https://www.youtube.com/embed/V75dMMIW2B4",
    categories: ["Adventure", "Drama", "Fantasy"],
    moods: ["Adventurous", "Excited"],
    likes: 231,
    dislikes: 12,
  },
  {
    id: "6",
    title: "Forrest Gump",
    description:
      "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
    imageUrl: "/placeholder.svg?height=400&width=300",
    trailerUrl: "https://www.youtube.com/embed/bLvqoHBptjg",
    categories: ["Drama", "Romance"],
    moods: ["Nostalgic", "Thoughtful", "Inspired"],
    likes: 245,
    dislikes: 8,
  },
]

// Initial recommended movies for translator categories
const initialRecommendations: CategoryRecommendation[] = [
  { categoryName: "Rocky", movieId: "1" },
  { categoryName: "Gaheza", movieId: "2" },
  { categoryName: "Savimbi", movieId: "3" },
  { categoryName: "Sankara", movieId: "4" },
  { categoryName: "B The Great", movieId: "5" },
  { categoryName: "Junior Giti", movieId: "6" },
  { categoryName: "Senior", movieId: "1" },
  { categoryName: "Dylan", movieId: "2" },
]

interface UserInteraction {
  movieId: string
  liked: boolean | null // true for like, false for dislike, null for no interaction
}

interface MoviesContextType {
  movies: Movie[]
  addMovie: (movie: Movie) => void
  removeMovie: (id: string) => void
  likeMovie: (id: string) => Promise<boolean>
  dislikeMovie: (id: string) => Promise<boolean>
  getUserInteraction: (id: string) => UserInteraction | undefined
  categoryRecommendations: CategoryRecommendation[]
  updateCategoryRecommendation: (categoryName: string, movieId: string) => void
  getRecommendedMovie: (categoryName: string) => Movie | undefined
  translatorCategories: TranslatorCategory[]
  updateMovie: (id: string, movieData: Partial<Omit<Movie, "id">>) => void
}

const MoviesContext = createContext<MoviesContextType | undefined>(undefined)

export function MoviesProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  const [userInteractions, setUserInteractions] = useState<UserInteraction[]>([])
  const [categoryRecommendations, setCategoryRecommendations] =
    useState<CategoryRecommendation[]>(initialRecommendations)
  const translatorCategories = TRANSLATOR_CATEGORIES

  // Load movies, user interactions, and recommendations from localStorage on mount
  useEffect(() => {
    const storedMovies = localStorage.getItem("movies")
    if (storedMovies) {
      try {
        setMovies(JSON.parse(storedMovies))
      } catch (error) {
        console.error("Failed to parse stored movies:", error)
      }
    }

    const storedInteractions = localStorage.getItem("userInteractions")
    if (storedInteractions) {
      try {
        setUserInteractions(JSON.parse(storedInteractions))
      } catch (error) {
        console.error("Failed to parse stored user interactions:", error)
      }
    }

    const storedRecommendations = localStorage.getItem("categoryRecommendations")
    if (storedRecommendations) {
      try {
        setCategoryRecommendations(JSON.parse(storedRecommendations))
      } catch (error) {
        console.error("Failed to parse stored category recommendations:", error)
      }
    }
  }, [])

  // Save movies, user interactions, and recommendations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("movies", JSON.stringify(movies))
  }, [movies])

  useEffect(() => {
    localStorage.setItem("userInteractions", JSON.stringify(userInteractions))
  }, [userInteractions])

  useEffect(() => {
    localStorage.setItem("categoryRecommendations", JSON.stringify(categoryRecommendations))
  }, [categoryRecommendations])

  const addMovie = (movie: Movie) => {
    setMovies((prevMovies) => [...prevMovies, movie])
  }

  const removeMovie = (id: string) => {
    setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id))
    // Also remove any user interactions with this movie
    setUserInteractions((prevInteractions) => prevInteractions.filter((interaction) => interaction.movieId !== id))
    // Update any category recommendations that used this movie
    setCategoryRecommendations((prevRecommendations) =>
      prevRecommendations.map((rec) => (rec.movieId === id ? { ...rec, movieId: "" } : rec)),
    )
  }

  const getUserInteraction = (id: string) => {
    return userInteractions.find((interaction) => interaction.movieId === id)
  }

  const updateCategoryRecommendation = (categoryName: string, movieId: string) => {
    setCategoryRecommendations((prev) => {
      const exists = prev.some((rec) => rec.categoryName === categoryName)
      if (exists) {
        return prev.map((rec) => (rec.categoryName === categoryName ? { ...rec, movieId } : rec))
      } else {
        return [...prev, { categoryName, movieId }]
      }
    })
  }

  const getRecommendedMovie = (categoryName: string) => {
    const recommendation = categoryRecommendations.find((rec) => rec.categoryName === categoryName)
    if (!recommendation) return undefined
    return movies.find((movie) => movie.id === recommendation.movieId)
  }

  const likeMovie = async (id: string): Promise<boolean> => {
    const existingInteraction = userInteractions.find((interaction) => interaction.movieId === id)

    // If user already liked this movie, do nothing
    if (existingInteraction?.liked === true) {
      return false
    }

    // Update movies state
    setMovies((prevMovies) =>
      prevMovies.map((movie) => {
        if (movie.id === id) {
          // If user previously disliked, decrement dislikes
          if (existingInteraction?.liked === false) {
            return {
              ...movie,
              likes: movie.likes + 1,
              dislikes: movie.dislikes - 1,
            }
          }
          // Otherwise just increment likes
          return { ...movie, likes: movie.likes + 1 }
        }
        return movie
      }),
    )

    // Update user interactions
    setUserInteractions((prevInteractions) => {
      const exists = prevInteractions.some((interaction) => interaction.movieId === id)
      if (exists) {
        return prevInteractions.map((interaction) =>
          interaction.movieId === id ? { ...interaction, liked: true } : interaction,
        )
      } else {
        return [...prevInteractions, { movieId: id, liked: true }]
      }
    })

    return true
  }

  const dislikeMovie = async (id: string): Promise<boolean> => {
    const existingInteraction = userInteractions.find((interaction) => interaction.movieId === id)

    // If user already disliked this movie, do nothing
    if (existingInteraction?.liked === false) {
      return false
    }

    // Update movies state
    setMovies((prevMovies) =>
      prevMovies.map((movie) => {
        if (movie.id === id) {
          // If user previously liked, decrement likes
          if (existingInteraction?.liked === true) {
            return {
              ...movie,
              likes: movie.likes - 1,
              dislikes: movie.dislikes + 1,
            }
          }
          // Otherwise just increment dislikes
          return { ...movie, dislikes: movie.dislikes + 1 }
        }
        return movie
      }),
    )

    // Update user interactions
    setUserInteractions((prevInteractions) => {
      const exists = prevInteractions.some((interaction) => interaction.movieId === id)
      if (exists) {
        return prevInteractions.map((interaction) =>
          interaction.movieId === id ? { ...interaction, liked: false } : interaction,
        )
      } else {
        return [...prevInteractions, { movieId: id, liked: false }]
      }
    })

    return true
  }

  const updateMovie = (id: string, movieData: Partial<Omit<Movie, "id">>) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) => {
        if (movie.id === id) {
          return {
            ...movie,
            ...movieData,
          }
        }
        return movie
      }),
    )
  }

  return (
    <MoviesContext.Provider
      value={{
        movies,
        addMovie,
        removeMovie,
        likeMovie,
        dislikeMovie,
        getUserInteraction,
        categoryRecommendations,
        updateCategoryRecommendation,
        getRecommendedMovie,
        translatorCategories,
        updateMovie,
      }}
    >
      {children}
    </MoviesContext.Provider>
  )
}

export function useMovies() {
  const context = useContext(MoviesContext)
  if (context === undefined) {
    throw new Error("useMovies must be used within a MoviesProvider")
  }
  return context
}
