
import { useState, useEffect } from "react";
import { toast } from "sonner";

export type Transaction = {
  id: string;
  amount: number;
  date: string;
  description: string;
  categoryId: string;
  type: "income" | "expense";
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
    toast.success("Transaction ajoutée avec succès");
    return newTransaction;
  };

  const updateTransaction = (id: string, data: Partial<Omit<Transaction, "id">>) => {
    const updatedTransactions = transactions.map(transaction => 
      transaction.id === id ? { ...transaction, ...data } : transaction
    );
    
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    toast.success("Transaction mise à jour");
  };

  const deleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    toast.success("Transaction supprimée");
  };

  return { 
    transactions, 
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
};
