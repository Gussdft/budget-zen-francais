
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";
import { useState, useEffect } from "react";

export function BalanceSummary() {
  const { transactions, getMonthlyStats } = useTransactions();
  const [stats, setStats] = useState({
    currentMonth: { income: 0, expense: 0, balance: 0 },
    previousMonth: { income: 0, expense: 0 },
    percentChange: { income: 0, expense: 0 }
  });

  useEffect(() => {
    if (transactions.length > 0) {
      const monthlyStats = getMonthlyStats();
      setStats(monthlyStats);
    }
  }, [transactions, getMonthlyStats]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const formattedValue = Math.abs(value).toFixed(1);
    return value > 0 ? `+${formattedValue}%` : `${formattedValue}%`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-3 animate-fade-in">
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Solde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">
              {formatCurrency(stats.currentMonth.balance)}
            </div>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-budget-primary" />
      </Card>
      
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Revenus ce mois-ci
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">
              {formatCurrency(stats.currentMonth.income)}
            </div>
            <div className="flex items-center text-xs">
              {stats.percentChange.income !== 0 && (
                <span className={stats.percentChange.income > 0 ? "text-budget-success flex items-center" : "text-budget-danger flex items-center"}>
                  {stats.percentChange.income > 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {formatPercentage(stats.percentChange.income)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-budget-success" />
      </Card>
      
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Dépenses ce mois-ci
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">
              {formatCurrency(stats.currentMonth.expense)}
            </div>
            <div className="flex items-center text-xs">
              {stats.percentChange.expense !== 0 && (
                <span className={stats.percentChange.expense < 0 ? "text-budget-success flex items-center" : "text-budget-danger flex items-center"}>
                  {stats.percentChange.expense < 0 ? (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  )}
                  {formatPercentage(stats.percentChange.expense)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-budget-danger" />
      </Card>
    </div>
  );
}
