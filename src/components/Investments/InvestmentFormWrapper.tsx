
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useInvestments, Investment } from "@/hooks/use-investments";
import { getDefaultInvestmentValues, InvestmentFormValues, ensureRequiredInvestmentValues } from "./InvestmentForm";
import { X } from "lucide-react";

interface InvestmentFormProps {
  investmentId?: string;
  onClose: () => void;
}

export function InvestmentForm({ investmentId, onClose }: InvestmentFormProps) {
  const { addInvestment, updateInvestment, investments } = useInvestments();
  
  // Si un ID est fourni, charger les données de l'investissement existant, sinon utiliser les valeurs par défaut
  const existingInvestment = investmentId ? investments.find(i => i.id === investmentId) : undefined;
  
  const [formValues, setFormValues] = useState<InvestmentFormValues>(
    getDefaultInvestmentValues(existingInvestment)
  );
  
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(
    formValues.purchaseDate ? new Date(formValues.purchaseDate) : new Date()
  );
  
  const [lastUpdateDate, setLastUpdateDate] = useState<Date | undefined>(
    formValues.lastUpdate ? new Date(formValues.lastUpdate) : new Date()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mise à jour des dates à partir des états React
    const updatedValues = {
      ...formValues,
      purchaseDate: purchaseDate ? purchaseDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      lastUpdate: lastUpdateDate ? lastUpdateDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    };
    
    // Assurer que toutes les valeurs requises sont présentes
    const completeValues = ensureRequiredInvestmentValues(updatedValues);
    
    if (investmentId) {
      updateInvestment(investmentId, completeValues);
    } else {
      addInvestment(completeValues);
    }
    
    onClose();
  };

  const showQuantityField = formValues.type === "action" || formValues.type === "crypto";

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>{investmentId ? "Modifier l'investissement" : "Nouvel investissement"}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nom de l'investissement */}
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'investissement</Label>
              <Input 
                id="name" 
                value={formValues.name} 
                onChange={(e) => setFormValues({...formValues, name: e.target.value})}
                required
              />
            </div>
            
            {/* Type d'investissement */}
            <div className="space-y-2">
              <Label htmlFor="type">Type d'investissement</Label>
              <Select 
                value={formValues.type} 
                onValueChange={(value) => setFormValues({...formValues, type: value as "action" | "crypto" | "immobilier" | "autre"})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="action">Action</SelectItem>
                    <SelectItem value="crypto">Crypto-monnaie</SelectItem>
                    <SelectItem value="immobilier">Immobilier</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Montant investi */}
            <div className="space-y-2">
              <Label htmlFor="amount">Montant investi (€)</Label>
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
            
            {/* Quantité (uniquement pour actions et crypto) */}
            {showQuantityField && (
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  min="0" 
                  step="0.0001"
                  value={formValues.quantity || ""} 
                  onChange={(e) => setFormValues({...formValues, quantity: e.target.value ? parseFloat(e.target.value) : undefined})}
                />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date d'achat */}
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Date d'achat</Label>
              <DatePicker
                date={purchaseDate}
                setDate={setPurchaseDate}
                label="Sélectionner une date d'achat"
              />
            </div>
            
            {/* Valeur actuelle */}
            <div className="space-y-2">
              <Label htmlFor="currentValue">Valeur actuelle (€)</Label>
              <Input 
                id="currentValue" 
                type="number" 
                min="0" 
                step="0.01"
                value={formValues.currentValue} 
                onChange={(e) => setFormValues({...formValues, currentValue: parseFloat(e.target.value) || 0})}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dernière mise à jour */}
            <div className="space-y-2">
              <Label htmlFor="lastUpdate">Dernière mise à jour</Label>
              <DatePicker
                date={lastUpdateDate}
                setDate={setLastUpdateDate}
                label="Sélectionner une date"
              />
            </div>
          </div>
          
          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea 
              id="notes" 
              value={formValues.notes} 
              onChange={(e) => setFormValues({...formValues, notes: e.target.value})}
              rows={3}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={formValues.name === "" || formValues.amount <= 0}
          >
            {investmentId ? "Mettre à jour" : "Créer"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
