
import { useState, useEffect } from "react";
import { toast } from "sonner";

export type Transaction = {
  id: string;
  amount: number;
  date: string;
  description: string;
  categoryId: string;
  type: "income" | "expense";
  savingsGoalId?: string; // Ajout de l'ID de l'objectif d'épargne
};

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupération des transactions depuis le localStorage
    const loadTransactions = () => {
      setIsLoading(true);
      try {
        const storedTransactions = localStorage.getItem("transactions");
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        } else {
          // Transactions par défaut pour démonstration
          const defaultTransactions: Transaction[] = [
            {
              id: "tx-1",
              amount: 2500,
              date: "2025-04-10",
              description: "Salaire",
              categoryId: "cat-1",
              type: "income"
            },
            {
              id: "tx-2",
              amount: 800,
              date: "2025-04-05",
              description: "Loyer",
              categoryId: "cat-2",
              type: "expense"
            },
            {
              id: "tx-3",
              amount: 120,
              date: "2025-04-15",
              description: "Courses hebdomadaires",
              categoryId: "cat-3",
              type: "expense"
            }
          ];
          setTransactions(defaultTransactions);
          localStorage.setItem("transactions", JSON.stringify(defaultTransactions));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des transactions:", error);
        toast.error("Impossible de charger les transactions");
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID()
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

    // Mettre à jour l'objectif d'épargne si applicable
    if (transaction.savingsGoalId) {
      updateSavingsGoal(transaction.savingsGoalId, transaction.amount, transaction.type);
    }

    toast.success("Transaction ajoutée avec succès");
    return newTransaction;
  };

  const updateTransaction = (id: string, data: Partial<Omit<Transaction, "id">>) => {
    // Obtenir l'ancienne transaction pour vérifier si l'objectif d'épargne doit être mis à jour
    const oldTransaction = transactions.find(t => t.id === id);
    
    const updatedTransactions = transactions.map(transaction => 
      transaction.id === id ? { ...transaction, ...data } : transaction
    );
    
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

    // Si la transaction est liée à un objectif d'épargne, mettre à jour les montants
    if (oldTransaction?.savingsGoalId && data.savingsGoalId === undefined) {
      // L'objectif d'épargne est retiré de la transaction, annuler son effet
      updateSavingsGoal(oldTransaction.savingsGoalId, oldTransaction.amount, oldTransaction.type === 'income' ? 'expense' : 'income');
    } else if (data.savingsGoalId) {
      // Nouvelle association ou modification d'un objectif d'épargne existant
      if (oldTransaction?.savingsGoalId && oldTransaction.savingsGoalId !== data.savingsGoalId) {
        // Annuler l'effet sur l'ancien objectif
        updateSavingsGoal(oldTransaction.savingsGoalId, oldTransaction.amount, oldTransaction.type === 'income' ? 'expense' : 'income');
      }
      
      // Appliquer l'effet sur le nouvel objectif
      const amount = data.amount !== undefined ? data.amount : (oldTransaction?.amount || 0);
      const type = data.type !== undefined ? data.type : (oldTransaction?.type || 'expense');
      updateSavingsGoal(data.savingsGoalId, amount, type);
    }

    toast.success("Transaction mise à jour");
  };

  const deleteTransaction = (id: string) => {
    // Vérifier si la transaction était liée à un objectif d'épargne
    const transaction = transactions.find(t => t.id === id);
    
    if (transaction?.savingsGoalId) {
      // Annuler l'effet de cette transaction sur l'objectif d'épargne
      updateSavingsGoal(
        transaction.savingsGoalId, 
        transaction.amount, 
        transaction.type === 'income' ? 'expense' : 'income'
      );
    }
    
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    toast.success("Transaction supprimée");
  };

  // Fonction pour mettre à jour le montant d'un objectif d'épargne
  const updateSavingsGoal = (goalId: string, amount: number, type: "income" | "expense") => {
    try {
      const storedGoals = localStorage.getItem("savingsGoals");
      if (storedGoals) {
        const goals = JSON.parse(storedGoals);
        const updatedGoals = goals.map((goal: any) => {
          if (goal.id === goalId) {
            // Pour un revenu, on ajoute au montant actuel, pour une dépense, on soustrait
            const adjustment = type === "income" ? amount : -amount;
            return {
              ...goal,
              currentAmount: Math.max(0, goal.currentAmount + adjustment)
            };
          }
          return goal;
        });
        localStorage.setItem("savingsGoals", JSON.stringify(updatedGoals));
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'objectif d'épargne:", error);
    }
  };

  return { 
    transactions, 
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
};
