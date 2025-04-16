"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

const categories = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller", "Animation", "Documentary"]
const translators = ["Rocky", "Gaheza", "Savimbi", "Sankara", "B The Great", "Junior Giti", "Senior", "Dylan"]

interface CategoryFilterProps {
  onCategoryChange?: (categories: string[]) => void
}

export default function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]

    setSelectedCategories(newCategories)

    if (onCategoryChange) {
      onCategoryChange(newCategories)
    }
  }

  return (
    <div className="space-y-3">
      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleCategory(category)}
              className="text-xs sm:text-sm h-8"
            >
              {category}
            </Button>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8">
                Translators <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Translators</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {translators.map((translator) => (
                <DropdownMenuItem
                  key={translator}
                  className={selectedCategories.includes(translator) ? "bg-primary text-primary-foreground" : ""}
                  onClick={() => toggleCategory(translator)}
                >
                  {translator}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ScrollArea>
    </div>
  )
}
