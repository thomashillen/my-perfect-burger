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
  { id: 1, name: "Lettuce", entryID: "82361576-6ac4-45c8-9a25-9bca0867ab13", icon: <Icons.lettuce/> },
  { id: 2, name: "Tomato", entryID: "7858a907-64aa-4397-95ff-e24bdebdbcbe" , icon: <Icons.tomato/>},
  { id: 3, name: "Cheese", entryID: "b42018c2-61ef-4bed-b622-60e15bb2f356" , icon: <Icons.cheese/>},
  { id: 4, name: "Patty", entryID: "3fbb6d3e-2621-403e-a391-d9c5ae918015" , icon: <Icons.patty/>},
  // Add more ingredients as needed
]

interface IngredientSelectionPanelProps {
  onIngredientAdd: (ingredient: {
    id: number
    name: string
    entryID: string
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
