
import { useState, useEffect } from "react";
import { toast } from "sonner";

export type Investment = {
  id: string;
  name: string;
  type: "action" | "crypto" | "immobilier" | "autre";
  amount: number; // Montant investi
  quantity?: number; // Nombre d'unités (actions, crypto)
  purchaseDate: string;
  currentValue: number; // Valeur actuelle
  lastUpdate: string; // Date de la dernière mise à jour
  notes: string;
};

export const useInvestments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupération des investissements depuis le localStorage
    const loadInvestments = () => {
      setIsLoading(true);
      try {
        const storedInvestments = localStorage.getItem("investments");
        if (storedInvestments) {
          setInvestments(JSON.parse(storedInvestments));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des investissements:", error);
        toast.error("Impossible de charger les investissements");
      } finally {
        setIsLoading(false);
      }
    };

    loadInvestments();
  }, []);

  const addInvestment = (investment: Omit<Investment, "id">) => {
    const newInvestment = {
      ...investment,
      id: `inv-${Date.now()}`
    };

    const updatedInvestments = [...investments, newInvestment];
    setInvestments(updatedInvestments);
    localStorage.setItem("investments", JSON.stringify(updatedInvestments));
    toast.success("Investissement ajouté avec succès");
    return newInvestment;
  };

  const updateInvestment = (id: string, data: Partial<Omit<Investment, "id">>) => {
    const updatedInvestments = investments.map(investment => 
      investment.id === id ? { ...investment, ...data } : investment
    );
    
    setInvestments(updatedInvestments);
    localStorage.setItem("investments", JSON.stringify(updatedInvestments));
    toast.success("Investissement mis à jour");
  };

  const deleteInvestment = (id: string) => {
    const updatedInvestments = investments.filter(investment => investment.id !== id);
    setInvestments(updatedInvestments);
    localStorage.setItem("investments", JSON.stringify(updatedInvestments));
    toast.success("Investissement supprimé");
  };

  const getPerformanceData = (id: string) => {
    const investment = investments.find(inv => inv.id === id);
    
    if (!investment) {
      return { 
        profitLoss: 0, 
        profitLossPercentage: 0, 
        isProfit: false,
        performanceClass: ""
      };
    }

    const profitLoss = investment.currentValue - investment.amount;
    const profitLossPercentage = (profitLoss / investment.amount) * 100;
    const isProfit = profitLoss >= 0;
    
    let performanceClass = "";
    if (isProfit) {
      performanceClass = "text-green-600";
    } else {
      performanceClass = "text-red-600";
    }

    return { 
      profitLoss, 
      profitLossPercentage, 
      isProfit,
      performanceClass
    };
  };

  return { 
    investments, 
    isLoading,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    getPerformanceData
  };
};
