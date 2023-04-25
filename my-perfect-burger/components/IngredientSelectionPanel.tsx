import React from "react";



import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast"

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
    <div className="flex flex-wrap gap-4 max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Ingredient Selection</CardTitle>
          <CardDescription>
            Click on the ingredients to add/remove them from the burger stack{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 ">
            {ingredients.map((ingredient) => (
              <Button
                key={ingredient.id}
                onClick={() => onIngredientAdd(ingredient)}
                color="primary"
                variant="default"
              // className="w-full"
              >
                {ingredient.name}
              </Button>
            ))}
          </div>
        </CardContent>
        
      </Card>
    </div>
  )
};

export default IngredientSelectionPanel