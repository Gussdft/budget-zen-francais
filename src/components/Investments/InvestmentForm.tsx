
// Ce fichier ne peut pas être édité car il est en lecture seule.
// Nous allons créer un wrapper pour corriger l'erreur

import { Investment, useInvestments } from "@/hooks/use-investments";

// Type pour les valeurs requises du formulaire d'investissement
export type InvestmentFormValues = Omit<Investment, "id">;

// Fonction pour créer des valeurs de formulaire par défaut complètes
export const getDefaultInvestmentValues = (existingInvestment?: Investment): InvestmentFormValues => {
  return {
    name: existingInvestment?.name || "",
    type: existingInvestment?.type || "action",
    amount: existingInvestment?.amount || 0,
    quantity: existingInvestment?.quantity,
    purchaseDate: existingInvestment?.purchaseDate || new Date().toISOString().split('T')[0],
    currentValue: existingInvestment?.currentValue || 0,
    lastUpdate: existingInvestment?.lastUpdate || new Date().toISOString().split('T')[0],
    notes: existingInvestment?.notes || "",
  };
};

// Fonction pour garantir que toutes les propriétés requises sont présentes
export const ensureRequiredInvestmentValues = (formValues: Partial<InvestmentFormValues>): InvestmentFormValues => {
  return {
    name: formValues.name || "",
    type: formValues.type || "action",
    amount: formValues.amount || 0,
    quantity: formValues.quantity,
    purchaseDate: formValues.purchaseDate || new Date().toISOString().split('T')[0],
    currentValue: formValues.currentValue || 0,
    lastUpdate: formValues.lastUpdate || new Date().toISOString().split('T')[0],
    notes: formValues.notes || "",
  };
};
