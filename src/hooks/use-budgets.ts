
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTransactions, Transaction } from "@/hooks/use-transactions";

export type Budget = {
  id: string;
  name: string;
  amount: number;
  categories: string[];
  type: "monthly" | "yearly" | "project";
  startDate: string;
  endDate?: string;
  isActive: boolean;
};

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { transactions } = useTransactions();

  useEffect(() => {
    // Récupération des budgets depuis le localStorage
    const loadBudgets = () => {
      setIsLoading(true);
      try {
        const storedBudgets = localStorage.getItem("budgets");
        if (storedBudgets) {
          setBudgets(JSON.parse(storedBudgets));
        } else {
          // Budgets par défaut pour la démonstration
          const defaultBudgets: Budget[] = [
            {
              id: "budget-1",
              name: "Budget alimentaire",
              amount: 500,
              categories: ["cat-3"],
              type: "monthly",
              startDate: "2025-04-01",
              isActive: true
            },
            {
              id: "budget-2",
              name: "Budget loisirs",
              amount: 200,
              categories: ["cat-5"],
              type: "monthly",
              startDate: "2025-04-01",
              isActive: true
            }
          ];
          setBudgets(defaultBudgets);
          localStorage.setItem("budgets", JSON.stringify(defaultBudgets));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des budgets:", error);
        toast.error("Impossible de charger les budgets");
      } finally {
        setIsLoading(false);
      }
    };

    loadBudgets();
  }, []);

  const addBudget = (budget: Omit<Budget, "id">) => {
    const newBudget = {
      ...budget,
      id: `budget-${Date.now()}`
    };

    const updatedBudgets = [...budgets, newBudget];
    setBudgets(updatedBudgets);
    localStorage.setItem("budgets", JSON.stringify(updatedBudgets));
    toast.success("Budget ajouté avec succès");
    return newBudget;
  };

  const updateBudget = (id: string, data: Partial<Omit<Budget, "id">>) => {
    const updatedBudgets = budgets.map(budget => 
      budget.id === id ? { ...budget, ...data } : budget
    );
    
    setBudgets(updatedBudgets);
    localStorage.setItem("budgets", JSON.stringify(updatedBudgets));
    toast.success("Budget mis à jour");
  };

  const deleteBudget = (id: string) => {
    const updatedBudgets = budgets.filter(budget => budget.id !== id);
    setBudgets(updatedBudgets);
    localStorage.setItem("budgets", JSON.stringify(updatedBudgets));
    toast.success("Budget supprimé");
  };

  const calculateBudgetProgress = (budgetId: string): { spent: number, remaining: number, percentage: number } => {
    const budget = budgets.find(b => b.id === budgetId);
    
    if (!budget) {
      return { spent: 0, remaining: 0, percentage: 0 };
    }

    // Filtrer les transactions appartenant aux catégories du budget
    // et dans la période du budget (pour les budgets mensuels/annuels)
    const relevantTransactions = transactions.filter(transaction => {
      const isInCategory = budget.categories.includes(transaction.categoryId);
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(budget.startDate);
      const endDate = budget.endDate ? new Date(budget.endDate) : new Date();
      
      const isInDateRange = transactionDate >= startDate && transactionDate <= endDate;
      const isExpense = transaction.type === 'expense';
      
      return isInCategory && isInDateRange && isExpense;
    });
    
    // Calculer le total dépensé
    const spent = relevantTransactions.reduce((total, transaction) => total + transaction.amount, 0);
    
    // Calculer le restant et le pourcentage
    const remaining = budget.amount - spent;
    const percentage = (spent / budget.amount) * 100;
    
    return { 
      spent, 
      remaining: remaining < 0 ? 0 : remaining, 
      percentage: percentage > 100 ? 100 : percentage 
    };
  };

  return { 
    budgets, 
    isLoading,
    addBudget,
    updateBudget,
    deleteBudget,
    calculateBudgetProgress
  };
};
