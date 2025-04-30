
// Ce fichier ne peut pas être édité car il est en lecture seule.
// Nous allons créer un wrapper pour corriger l'erreur

import { Budget, useBudgets } from "@/hooks/use-budgets";

// Type pour les valeurs requises du formulaire
export type BudgetFormValues = Omit<Budget, "id">;

// Fonction pour créer des valeurs de formulaire par défaut complètes
export const getDefaultBudgetValues = (existingBudget?: Budget): BudgetFormValues => {
  return {
    name: existingBudget?.name || "",
    type: existingBudget?.type || "monthly",
    amount: existingBudget?.amount || 0,
    categories: existingBudget?.categories || [],
    startDate: existingBudget?.startDate || new Date().toISOString().split('T')[0],
    endDate: existingBudget?.endDate || "",
    isActive: existingBudget?.isActive ?? true,
  };
};

// Fonction pour garantir que toutes les propriétés requises sont présentes
export const ensureRequiredBudgetValues = (formValues: Partial<BudgetFormValues>): BudgetFormValues => {
  return {
    name: formValues.name || "",
    type: formValues.type || "monthly",
    amount: formValues.amount || 0,
    categories: formValues.categories || [],
    startDate: formValues.startDate || new Date().toISOString().split('T')[0],
    endDate: formValues.endDate || "",
    isActive: formValues.isActive ?? true,
  };
};
