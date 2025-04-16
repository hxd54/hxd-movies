"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import MovieList from "@/components/movie-list"
import CategoryFilter from "@/components/category-filter"
import MoodFilter from "@/components/mood-filter"

export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const recommendationsRef = useRef<HTMLElement>(null)

  const scrollToRecommendations = () => {
    recommendationsRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Hero Section */}
      <section className="w-full py-8 md:py-16 lg:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
                Find Your Perfect Movie Based on Your Mood
              </h1>
              <p className="mx-auto max-w-[700px] text-sm sm:text-base text-muted-foreground md:text-lg">
                Discover films that match exactly how you feel. Select your mood and preferences to get personalized
                recommendations.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
              <Button onClick={scrollToRecommendations} size="sm" className="sm:size-md">
                Get Started
              </Button>
              <Button variant="outline" asChild size="sm" className="sm:size-md">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section id="filters" className="container px-4 md:px-6">
        <div className="flex flex-col gap-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Find Your Movie</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-medium">Select Category</h3>
              <CategoryFilter onCategoryChange={setSelectedCategories} />
            </div>
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-medium">Select Mood</h3>
              <MoodFilter onMoodChange={setSelectedMood} />
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section ref={recommendationsRef} id="recommendations" className="container px-4 md:px-6">
        <div className="flex flex-col gap-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Recommended Movies</h2>
          <MovieList selectedCategories={selectedCategories} selectedMood={selectedMood} />
        </div>
      </section>
    </div>
  )
}
