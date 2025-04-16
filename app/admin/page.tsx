"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"
import { AlertCircle, Plus, Trash2, Film, ThumbsUp, ThumbsDown, Search, Edit } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMovies } from "@/hooks/use-movies"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import EditRecommendationDialog from "@/components/edit-recommendation-dialog"
import EditMovieDialog from "@/components/edit-movie-dialog"

const categories = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller", "Animation", "Documentary"]

const moods = ["Happy", "Sad", "Excited", "Relaxed", "Thoughtful", "Inspired", "Nostalgic", "Adventurous"]

export default function AdminPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { movies, addMovie, removeMovie, translatorCategories, getRecommendedMovie } = useMovies()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"title" | "likes" | "dislikes">("title")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    trailerUrl: "",
    categories: [] as string[],
    moods: [] as string[],
  })
  const [movieToDelete, setMovieToDelete] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("movies")
  const [editCategoryName, setEditCategoryName] = useState<string>("")
  const [showEditRecommendationDialog, setShowEditRecommendationDialog] = useState(false)
  const [showEditMovieDialog, setShowEditMovieDialog] = useState(false)
  const [movieToEdit, setMovieToEdit] = useState<string | null>(null)

  // Check authentication status and redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // We'll show an unauthorized message instead of redirecting immediately
      // This gives the user context about why they can't access this page
      const redirectTimer = setTimeout(() => {
        router.push("/login")
      }, 3000)

      return () => clearTimeout(redirectTimer)
    }
  }, [isAuthenticated, router])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You must be logged in as a developer to perform this action",
        variant: "destructive",
      })
      return
    }

    if (!formData.title || !formData.description || !formData.imageUrl || !formData.trailerUrl) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (formData.categories.length === 0 || formData.moods.length === 0) {
      toast({
        title: "Missing selections",
        description: "Please select at least one category and mood",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Add the movie to our state
      addMovie({
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        trailerUrl: formData.trailerUrl,
        categories: formData.categories,
        moods: formData.moods,
        likes: 0,
        dislikes: 0,
      })

      toast({
        title: "Movie added!",
        description: "The movie has been added to the database.",
      })

      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        trailerUrl: "",
        categories: [],
        moods: [],
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add movie",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteMovie = (id: string) => {
    setMovieToDelete(id)
    setShowDeleteDialog(true)
  }

  const confirmDeleteMovie = () => {
    if (movieToDelete) {
      removeMovie(movieToDelete)
      toast({
        title: "Movie deleted",
        description: "The movie has been removed from the database",
      })
      setShowDeleteDialog(false)
      setMovieToDelete(null)
    }
  }

  const handleViewDetails = (id: string) => {
    setSelectedMovie(id)
    setShowDetailsDialog(true)
  }

  const handleEditRecommendation = (categoryName: string) => {
    setEditCategoryName(categoryName)
    setShowEditRecommendationDialog(true)
  }

  const handleEditMovie = (id: string) => {
    setMovieToEdit(id)
    setShowEditMovieDialog(true)
  }

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === "title") {
      return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    } else if (sortBy === "likes") {
      return sortOrder === "asc" ? a.likes - b.likes : b.likes - a.likes
    } else {
      return sortOrder === "asc" ? a.dislikes - b.dislikes : b.dislikes - a.dislikes
    }
  })

  const toggleSort = (column: "title" | "likes" | "dislikes") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  // Get the selected movie details
  const selectedMovieDetails = selectedMovie ? movies.find((movie) => movie.id === selectedMovie) : null

  // If not authenticated, show unauthorized message
  if (!isAuthenticated) {
    return (
      <div className="container max-w-3xl py-8 md:py-12 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unauthorized Access</AlertTitle>
          <AlertDescription>
            You must be logged in as a developer to access this page. Redirecting to login...
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12 px-4 sm:px-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="movies" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 w-full justify-start overflow-x-auto">
          <TabsTrigger value="movies" className="text-sm">
            Movie Management
          </TabsTrigger>
          <TabsTrigger value="add" className="text-sm">
            Add New Movie
          </TabsTrigger>
        </TabsList>

        <TabsContent value="movies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Movie Database</CardTitle>
              <CardDescription className="text-sm">
                Manage all movies and view user interaction statistics
              </CardDescription>
              <div className="flex items-center gap-2 mt-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm text-sm"
                  name="max-w-sm text-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => toggleSort("title")}>
                          Title {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead className="hidden md:table-cell">Categories</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => toggleSort("likes")}>
                          Likes {sortBy === "likes" && (sortOrder === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => toggleSort("dislikes")}>
                          Dislikes {sortBy === "dislikes" && (sortOrder === "asc" ? "↑" : "↓")}
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedMovies.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No movies found
                          </TableCell>
                        </TableRow>
                      ) : (
                        sortedMovies.map((movie) => (
                          <TableRow key={movie.id}>
                            <TableCell>
                              <div className="h-12 w-12 relative rounded-md overflow-hidden">
                                <Image
                                  src={movie.imageUrl || "/placeholder.svg"}
                                  alt={movie.title}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-sm">{movie.title}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex flex-wrap gap-1">
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
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <ThumbsUp className="h-4 w-4 mr-1 text-green-500" />
                                <span className="text-sm">{movie.likes}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <ThumbsDown className="h-4 w-4 mr-1 text-red-500" />
                                <span className="text-sm">{movie.dislikes}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <span className="sr-only">Open menu</span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="h-4 w-4"
                                    >
                                      <circle cx="12" cy="12" r="1" />
                                      <circle cx="12" cy="5" r="1" />
                                      <circle cx="12" cy="19" r="1" />
                                    </svg>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleViewDetails(movie.id)}>
                                    <Film className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditMovie(movie.id)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Movie
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDeleteMovie(movie.id)}>
                                    <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                    Delete Movie
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Add New Movie</CardTitle>
              <CardDescription className="text-sm">Add a new movie to the recommendation database.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="text-sm">
                      Movie Title
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter movie title"
                      required
                      className="text-sm"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description" className="text-sm">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter movie description"
                      required
                      className="min-h-[100px] text-sm"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="imageUrl" className="text-sm">
                      Cover Image URL
                    </Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="Enter image URL"
                      required
                      className="text-sm"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="trailerUrl" className="text-sm">
                      Trailer URL (YouTube Embed)
                    </Label>
                    <Input
                      id="trailerUrl"
                      name="trailerUrl"
                      value={formData.trailerUrl}
                      onChange={handleChange}
                      placeholder="Enter YouTube embed URL"
                      required
                      className="text-sm"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-sm">Categories</Label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={formData.categories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-sm">Translator Categories</Label>
                    <div className="flex flex-wrap gap-2">
                      {translatorCategories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`translator-${category}`}
                            checked={formData.categories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <label
                            htmlFor={`translator-${category}`}
                            className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-sm">Moods</Label>
                    <div className="flex flex-wrap gap-2">
                      {moods.map((mood) => (
                        <div key={mood} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mood-${mood}`}
                            checked={formData.moods.includes(mood)}
                            onCheckedChange={() => toggleMood(mood)}
                          />
                          <label
                            htmlFor={`mood-${mood}`}
                            className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {mood}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Adding Movie..."
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" /> Add Movie
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px] w-[95vw]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this movie? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="sm:mr-2">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteMovie}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Movie Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
          {selectedMovieDetails && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMovieDetails.title}</DialogTitle>
                <DialogDescription>Movie details and statistics</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4">
                <div className="aspect-[2/3] relative rounded-md overflow-hidden">
                  <Image
                    src={selectedMovieDetails.imageUrl || "/placeholder.svg"}
                    alt={selectedMovieDetails.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 200px"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedMovieDetails.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium">Categories</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedMovieDetails.categories.map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium">Moods</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedMovieDetails.moods.map((mood) => (
                        <Badge key={mood} variant="outline" className="text-xs">
                          {mood}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium">User Interactions</h4>
                    <div className="flex gap-4 mt-1">
                      <div className="flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-1 text-green-500" />
                        <span className="text-sm">{selectedMovieDetails.likes} likes</span>
                      </div>
                      <div className="flex items-center">
                        <ThumbsDown className="h-4 w-4 mr-1 text-red-500" />
                        <span className="text-sm">{selectedMovieDetails.dislikes} dislikes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Recommendation Dialog */}
      <EditRecommendationDialog
        open={showEditRecommendationDialog}
        onOpenChange={setShowEditRecommendationDialog}
        categoryName={editCategoryName}
      />

      {/* Edit Movie Dialog */}
      <EditMovieDialog open={showEditMovieDialog} onOpenChange={setShowEditMovieDialog} movieId={movieToEdit || ""} />
    </div>
  )
}
