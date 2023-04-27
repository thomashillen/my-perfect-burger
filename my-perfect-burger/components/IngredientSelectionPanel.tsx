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
import { Icons } from "@/components/icons"

const ingredients = [
  { id: 1, name: "Lettuce", assetUrl: "path/to/lettuce-3d-model", icon: <Icons.lettuce/> },
  { id: 2, name: "Tomato", assetUrl: "path/to/tomato-3d-model" , icon: <Icons.tomato/>},
  { id: 3, name: "Cheese", assetUrl: "path/to/cheese-3d-model" , icon: <Icons.cheese/>},
  { id: 4, name: "Patty", assetUrl: "path/to/patty-3d-model" , icon: <Icons.patty/>},
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
    <div >
      <Card className="w-100">
        <CardHeader>
          <CardTitle>Ingredient Selection</CardTitle>
          <CardDescription>
            Click on the ingredients to add/remove them from the burger stack{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {ingredients.map((ingredient) => (
              <Button
                key={ingredient.id}
                onClick={() => onIngredientAdd(ingredient)}
                color="primary"
                variant="default"
                // className="w-full"
              >
                {ingredient.icon}
                {ingredient.name}

              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default IngredientSelectionPanel
