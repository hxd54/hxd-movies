"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Film, ThumbsUp, ThumbsDown } from "lucide-react"
import type { Movie } from "@/types/movie"
import { useMovies } from "@/hooks/use-movies"
import { cn } from "@/lib/utils"

interface MovieCardProps {
  movie: Movie
  className?: string
}

export default function MovieCard({ movie, className }: MovieCardProps) {
  const [open, setOpen] = useState(false)
  const { likeMovie, dislikeMovie, getUserInteraction } = useMovies()
  const [isLikeAnimating, setIsLikeAnimating] = useState(false)
  const [isDislikeAnimating, setIsDislikeAnimating] = useState(false)
  const likeButtonRef = useRef<HTMLButtonElement>(null)
  const dislikeButtonRef = useRef<HTMLButtonElement>(null)

  // Get user's previous interaction with this movie
  const userInteraction = getUserInteraction(movie.id)
  const hasLiked = userInteraction?.liked === true
  const hasDisliked = userInteraction?.liked === false

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()

    // Attempt to like the movie
    const success = await likeMovie(movie.id)

    // If successful (user hadn't already liked), show animation
    if (success) {
      setIsLikeAnimating(true)
      setTimeout(() => setIsLikeAnimating(false), 500)
    }
  }

  const handleDislike = async (e: React.MouseEvent) => {
    e.stopPropagation()

    // Attempt to dislike the movie
    const success = await dislikeMovie(movie.id)

    // If successful (user hadn't already disliked), show animation
    if (success) {
      setIsDislikeAnimating(true)
      setTimeout(() => setIsDislikeAnimating(false), 500)
    }
  }

  return (
    <>
      <Card className={cn("overflow-hidden h-full flex flex-col", className)}>
        <div className="aspect-[2/3] relative">
          <Image
            src={movie.imageUrl || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={false}
            loading="lazy"
          />
        </div>
        <CardHeader className="p-4">
          <CardTitle className="line-clamp-1 text-base sm:text-lg">{movie.title}</CardTitle>
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.categories.slice(0, 2).map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
            {movie.categories.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{movie.categories.length - 2}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          <CardDescription className="line-clamp-3 text-xs sm:text-sm">{movie.description}</CardDescription>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col gap-2">
          <Button onClick={() => setOpen(true)} className="w-full text-sm" size="sm">
            <Film className="mr-2 h-4 w-4" />
            Watch Trailer
          </Button>
          <div className="flex w-full gap-2 mt-2">
            <Button
              ref={likeButtonRef}
              variant={hasLiked ? "default" : "outline"}
              size="sm"
              className={cn(
                "flex-1 gap-1 text-xs sm:text-sm relative overflow-hidden",
                isLikeAnimating && "animate-pulse",
                hasLiked && "bg-green-500 hover:bg-green-600 text-white",
              )}
              onClick={handleLike}
            >
              <ThumbsUp className={cn("h-3 w-3 sm:h-4 sm:w-4", isLikeAnimating && "animate-bounce")} />
              <span>{movie.likes}</span>
              {isLikeAnimating && (
                <span className="absolute inset-0 flex items-center justify-center bg-green-500/20 animate-ping rounded-md" />
              )}
            </Button>
            <Button
              ref={dislikeButtonRef}
              variant={hasDisliked ? "default" : "outline"}
              size="sm"
              className={cn(
                "flex-1 gap-1 text-xs sm:text-sm relative overflow-hidden",
                isDislikeAnimating && "animate-pulse",
                hasDisliked && "bg-red-500 hover:bg-red-600 text-white",
              )}
              onClick={handleDislike}
            >
              <ThumbsDown className={cn("h-3 w-3 sm:h-4 sm:w-4", isDislikeAnimating && "animate-bounce")} />
              <span>{movie.dislikes}</span>
              {isDislikeAnimating && (
                <span className="absolute inset-0 flex items-center justify-center bg-red-500/20 animate-ping rounded-md" />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{movie.title}</DialogTitle>
            <DialogDescription className="text-sm">{movie.description}</DialogDescription>
          </DialogHeader>
          <div className="aspect-video w-full overflow-hidden rounded-md">
            <iframe
              width="100%"
              height="100%"
              src={movie.trailerUrl}
              title={`${movie.title} trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="aspect-video"
            ></iframe>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.categories.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-sm">{movie.likes} likes</span>
            </div>
            <div className="flex items-center">
              <ThumbsDown className="h-4 w-4 mr-1 text-red-500" />
              <span className="text-sm">{movie.dislikes} dislikes</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
