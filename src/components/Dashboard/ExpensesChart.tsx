
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { useCategories } from "@/hooks/use-categories";

// Couleurs pour le graphique
const COLORS = ["#4DC0B5", "#2C5282", "#68D391", "#F6AD55", "#FC8181", "#CBD5E0", "#9F7AEA", "#ED64A6", "#4299E1", "#48BB78"];

export function ExpensesChart() {
  const [period, setPeriod] = useState("month");
  const { transactions } = useTransactions();
  const { categories } = useCategories();

  const chartData = useMemo(() => {
    // Définir la période de filtrage
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "week":
        // Début de la semaine (lundi)
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
        startDate.setHours(0, 0, 0, 0);
        break;
      case "month":
        // Début du mois
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "quarter":
        // Début du trimestre
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case "year":
        // Début de l'année
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Filtrer les transactions par période et par type (dépenses)
    const filteredTransactions = transactions.filter(t => 
      new Date(t.date) >= startDate && 
      new Date(t.date) <= now &&
      t.type === "expense"
    );

    // Regrouper les dépenses par catégorie
    const expensesByCategory = filteredTransactions.reduce((acc, transaction) => {
      if (!acc[transaction.categoryId]) {
        acc[transaction.categoryId] = 0;
      }
      acc[transaction.categoryId] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    // Formatage des données pour le graphique
    return Object.keys(expensesByCategory).map((categoryId, index) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        name: category?.name || "Non catégorisé",
        value: expensesByCategory[categoryId],
        color: COLORS[index % COLORS.length]
      };
    });
  }, [transactions, categories, period]);

  return (
    <Card className="col-span-1 md:col-span-2 animate-fade-in [animation-delay:300ms]">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>Répartition des dépenses</CardTitle>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="quarter">Ce trimestre</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-2">
        {chartData.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            Aucune dépense pour cette période
          </div>
        ) : (
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  label={(entry) => `${entry.name}: ${entry.value.toFixed(0)}€`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
