
import React, { useState } from "react";
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Checkbox
} from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { useBudgets, Budget } from "@/hooks/use-budgets";
import { useCategories } from "@/hooks/use-categories";
import { getDefaultBudgetValues, BudgetFormValues, ensureRequiredBudgetValues } from "./BudgetForm";
import { X } from "lucide-react";

interface BudgetFormProps {
  budgetId?: string;
  onClose: () => void;
}

// Export with the name BudgetFormWrapper to match the import in other files
export function BudgetFormWrapper({ budgetId, onClose }: BudgetFormProps) {
  const { addBudget, updateBudget, budgets } = useBudgets();
  const { categories } = useCategories();
  
  // Si un ID est fourni, charger les données du budget existant, sinon utiliser les valeurs par défaut
  const existingBudget = budgetId ? budgets.find(b => b.id === budgetId) : undefined;
  
  const [formValues, setFormValues] = useState<BudgetFormValues>(
    getDefaultBudgetValues(existingBudget)
  );
  
  const [startDate, setStartDate] = useState<Date | undefined>(
    formValues.startDate ? new Date(formValues.startDate) : new Date()
  );
  
  const [endDate, setEndDate] = useState<Date | undefined>(
    formValues.endDate ? new Date(formValues.endDate) : undefined
  );

  // Catégories filtrées pour montrer uniquement les dépenses
  const expenseCategories = categories.filter(cat => 
    cat.type === "expense" || cat.type === "both"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mise à jour des dates à partir des états React
    const updatedValues = {
      ...formValues,
      startDate: startDate ? startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      endDate: endDate ? endDate.toISOString().split('T')[0] : "",
    };
    
    // Assurer que toutes les valeurs requises sont présentes
    const completeValues = ensureRequiredBudgetValues(updatedValues);
    
    if (budgetId) {
      updateBudget(budgetId, completeValues);
    } else {
      addBudget(completeValues);
    }
    
    onClose();
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormValues(prev => {
      const categories = [...prev.categories];
      
      if (categories.includes(categoryId)) {
        // Retirer la catégorie si elle est déjà sélectionnée
        return { ...prev, categories: categories.filter(id => id !== categoryId) };
      } else {
        // Ajouter la catégorie
        return { ...prev, categories: [...categories, categoryId] };
      }
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>{budgetId ? "Modifier le budget" : "Nouveau budget"}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nom du budget */}
            <div className="space-y-2">
              <Label htmlFor="name">Nom du budget</Label>
              <Input 
                id="name" 
                value={formValues.name} 
                onChange={(e) => setFormValues({...formValues, name: e.target.value})}
                required
              />
            </div>
            
            {/* Type de budget */}
            <div className="space-y-2">
              <Label htmlFor="type">Type de budget</Label>
              <Select 
                value={formValues.type} 
                onValueChange={(value) => setFormValues({...formValues, type: value as "monthly" | "yearly" | "project"})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                    <SelectItem value="yearly">Annuel</SelectItem>
                    <SelectItem value="project">Projet</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Montant du budget */}
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (€)</Label>
              <Input 
                id="amount" 
                type="number" 
                min="0" 
                step="0.01"
                value={formValues.amount} 
                onChange={(e) => setFormValues({...formValues, amount: parseFloat(e.target.value) || 0})}
                required
              />
            </div>
            
            {/* Statut (actif/inactif) */}
            <div className="flex items-center space-x-2 pt-8">
              <Checkbox 
                id="isActive" 
                checked={formValues.isActive}
                onCheckedChange={(checked) => 
                  setFormValues({...formValues, isActive: checked === true})}
              />
              <Label htmlFor="isActive">Budget actif</Label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date de début */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <DatePicker
                date={startDate}
                setDate={setStartDate}
                label="Sélectionner une date de début"
              />
            </div>
            
            {/* Date de fin (optionnel) */}
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin (optionnel)</Label>
              <DatePicker
                date={endDate}
                setDate={setEndDate}
                label="Sélectionner une date de fin"
              />
            </div>
          </div>
          
          {/* Catégories */}
          <div className="space-y-2">
            <Label>Catégories de dépenses</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-1">
              {expenseCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cat-${category.id}`}
                    checked={formValues.categories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <Label htmlFor={`cat-${category.id}`} className="cursor-pointer">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
            {formValues.categories.length === 0 && (
              <p className="text-sm text-red-500 mt-1">
                Sélectionnez au moins une catégorie
              </p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={formValues.name === "" || formValues.amount <= 0 || formValues.categories.length === 0}
          >
            {budgetId ? "Mettre à jour" : "Créer"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
