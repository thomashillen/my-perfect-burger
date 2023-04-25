import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


const ingredients = [
  { id: 1, name: 'Lettuce', assetUrl: 'path/to/lettuce-3d-model' },
  { id: 2, name: 'Tomato', assetUrl: 'path/to/tomato-3d-model' },
  { id: 3, name: 'Cheese', assetUrl: 'path/to/cheese-3d-model' },
  { id: 4, name: 'Patty', assetUrl: 'path/to/patty-3d-model' },
  // Add more ingredients as needed
];

interface IngredientSelectionPanelProps {
  onIngredientAdd: (ingredient: { id: number; name: string; assetUrl: string }) => void;
}

const IngredientSelectionPanel: React.FC<IngredientSelectionPanelProps> = ({ onIngredientAdd }) => {
  return (
    <div className="flex flex-wrap gap-4">
      
      <Card>
        <CardHeader>
          <CardTitle>Ingredient Selection</CardTitle>
          <CardDescription>Click on the ingredients to add/remove them from the burger stack </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
        <CardFooter>
          <p>Once your done, download your perfect burger and Share on Social media!</p>
          
        </CardFooter>
      </Card>

    </div>
    


  );
};

export default IngredientSelectionPanel;
