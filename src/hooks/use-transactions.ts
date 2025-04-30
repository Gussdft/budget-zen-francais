
import { useState, useEffect } from "react";
import { toast } from "sonner";

export type Transaction = {
  id: string;
  amount: number;
  date: string;
  description: string;
  categoryId: string;
  type: "income" | "expense";
  savingsGoalId?: string;
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
            // Pour une dépense (qui contribue à l'épargne), on ajoute au montant actuel
            // Pour un revenu (retrait de l'épargne), on soustrait
            const adjustment = type === "expense" ? amount : -amount;
            
            // S'assurer que le montant actuel ne dépasse pas le montant cible et ne devient pas négatif
            const newAmount = Math.max(0, Math.min(goal.targetAmount, goal.currentAmount + adjustment));
            
            return {
              ...goal,
              currentAmount: newAmount
            };
          }
          return goal;
        });
        localStorage.setItem("savingsGoals", JSON.stringify(updatedGoals));
        
        // Notification de mise à jour réussie
        const goalName = goals.find((g: any) => g.id === goalId)?.title;
        if (goalName) {
          toast.success(`Objectif "${goalName}" mis à jour avec succès`);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'objectif d'épargne:", error);
      toast.error("Impossible de mettre à jour l'objectif d'épargne");
    }
  };

  // Calcul des statistiques mensuelles pour le tableau de bord
  const getMonthlyStats = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    
    // Filtrer les transactions du mois en cours
    const monthlyTransactions = transactions.filter(t => 
      t.date >= startOfMonth && t.date <= endOfMonth
    );
    
    // Calculer les totaux
    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpense = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculer les pourcentages par rapport au mois précédent
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const startOfPrevMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1).toISOString().split('T')[0];
    const endOfPrevMonth = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0).toISOString().split('T')[0];
    
    const prevMonthTransactions = transactions.filter(t => 
      t.date >= startOfPrevMonth && t.date <= endOfPrevMonth
    );
    
    const prevMonthIncome = prevMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const prevMonthExpense = prevMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculer les variations en pourcentage
    const incomeChange = prevMonthIncome ? ((totalIncome - prevMonthIncome) / prevMonthIncome) * 100 : 0;
    const expenseChange = prevMonthExpense ? ((totalExpense - prevMonthExpense) / prevMonthExpense) * 100 : 0;
    
    return {
      currentMonth: {
        income: totalIncome,
        expense: totalExpense,
        balance: totalIncome - totalExpense
      },
      previousMonth: {
        income: prevMonthIncome,
        expense: prevMonthExpense
      },
      percentChange: {
        income: parseFloat(incomeChange.toFixed(1)),
        expense: parseFloat(expenseChange.toFixed(1))
      }
    };
  };

  return { 
    transactions, 
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getMonthlyStats
  };
};
