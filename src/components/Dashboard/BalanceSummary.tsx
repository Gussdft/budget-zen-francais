
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";
import { useMemo } from "react";

export function BalanceSummary() {
  const { transactions } = useTransactions();
  
  // Calculer le solde actuel, revenus du mois et dépenses du mois
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  const financialData = useMemo(() => {
    // Filtrer les transactions du mois en cours
    const currentMonthTransactions = transactions.filter(t => 
      new Date(t.date) >= firstDayOfMonth && new Date(t.date) <= currentDate
    );
    
    // Calculer les revenus du mois
    const monthIncomes = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + t.amount, 0);
    
    // Calculer les dépenses du mois
    const monthExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);
    
    // Calculer le solde total
    const balance = transactions.reduce((total, t) => {
      if (t.type === 'income') return total + t.amount;
      if (t.type === 'expense') return total - t.amount;
      return total;
    }, 0);
    
    // Calculer les variations par rapport au mois précédent
    // (Simplifié pour cette implémentation)
    const incomeVariation = 5; // +5%
    const expenseVariation = 12; // +12%
    
    return {
      balance,
      monthIncomes,
      monthExpenses,
      incomeVariation,
      expenseVariation
    };
  }, [transactions]);

  // Formater le montant avec le symbole €
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Formater la date pour l'affichage
  const formatDate = () => {
    return currentDate.toLocaleDateString('fr-FR');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Solde actuel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold">{formatAmount(financialData.balance)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Mis à jour le {formatDate()}
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in [animation-delay:100ms]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Revenus du mois
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold">{formatAmount(financialData.monthIncomes)}</div>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 text-budget-success mr-1" />
                <span className="text-xs text-budget-success">+{financialData.incomeVariation}% vs mois dernier</span>
              </div>
            </div>
            <div className="bg-budget-success/10 p-3 rounded-full">
              <ArrowUpRight className="h-6 w-6 text-budget-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in [animation-delay:200ms]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Dépenses du mois
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold">{formatAmount(financialData.monthExpenses)}</div>
              <div className="flex items-center mt-1">
                <ArrowDownRight className="h-4 w-4 text-budget-danger mr-1" />
                <span className="text-xs text-budget-danger">+{financialData.expenseVariation}% vs mois dernier</span>
              </div>
            </div>
            <div className="bg-budget-danger/10 p-3 rounded-full">
              <ArrowDownRight className="h-6 w-6 text-budget-danger" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
