import React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ingredients = [
  { id: 1, name: "Lettuce", assetUrl: "path/to/lettuce-3d-model" },
  { id: 2, name: "Tomato", assetUrl: "path/to/tomato-3d-model" },
  { id: 3, name: "Cheese", assetUrl: "path/to/cheese-3d-model" },
  { id: 4, name: "Patty", assetUrl: "path/to/patty-3d-model" },
  // Add more ingredients as needed
]

interface IngredientSelectionPanelProps {
  onIngredientAdd: (ingredient: {
    id: number
    name: string
    assetUrl: string
  }) => void
}

const IngredientSelectionPanel: React.FC<IngredientSelectionPanelProps> = ({
  onIngredientAdd,
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Ingredient Selection</CardTitle>
          <CardDescription>
            Click on the ingredients to add/remove them from the burger stack{" "}
          </CardDescription>
        </CardHeader>
        <CardContent >
          <div className="">
          {ingredients.map((ingredient) => (
            <Button
            key={ingredient.id}
            onClick={() => onIngredientAdd(ingredient)}
            color="primary"
            // variant="destructive"
            className="w-24 m-2"
            >
              {ingredient.name}
            </Button>
          ))}
          </div>
        </CardContent>
        <CardFooter>
          <p>
            Once your done, download your perfect burger and Share on Social
            media!
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"  className="flex content-center items-center justify-center w-full mt-2"><polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline></svg>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default IngredientSelectionPanel
