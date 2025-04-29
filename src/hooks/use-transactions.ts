
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
