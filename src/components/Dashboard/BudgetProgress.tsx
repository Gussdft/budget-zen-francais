
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useBudgets } from "@/hooks/use-budgets";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Plus, PieChart, BarChart4, ArrowUpRight, AlertCircle } from "lucide-react";
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function BudgetProgress() {
  const { budgets, calculateBudgetProgress, updateBudget } = useBudgets();
  const { getCategoryName } = useCategories();
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [contribution, setContribution] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("list");

  // Filtrer pour n'avoir que les budgets actifs
  const activeBudgets = budgets.filter(budget => budget.isActive);
  
  // Formater le montant avec le symbole €
  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2).replace('.', ',')} €`;
  };

  const handleAddContribution = (budgetId: string) => {
    const budget = budgets.find(b => b.id === budgetId);
    if (budget) {
      // Mettre à jour le montant du budget
      updateBudget(budgetId, { 
        amount: budget.amount + contribution 
      });
      setSelectedBudget(null);
      setContribution(0);
    }
  };

  // Données pour le graphique
  const chartData = activeBudgets.map(budget => {
    const progress = calculateBudgetProgress(budget.id);
    return {
      name: budget.name,
      alloué: budget.amount,
      dépensé: progress.spent,
      restant: progress.remaining,
    };
  });

  return (
    <Card className="col-span-1 md:col-span-2 animate-fade-in [animation-delay:500ms]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart4 className="h-5 w-5 text-muted-foreground" /> 
            Suivi des budgets
          </CardTitle>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
            <TabsList>
              <TabsTrigger value="list">Liste</TabsTrigger>
              <TabsTrigger value="chart">Graphique</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {activeBudgets.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <div className="mb-2 flex justify-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <p>Aucun budget actif</p>
            <p className="text-sm mt-1">Créez un budget dans l'onglet "Budgets & Projets"</p>
          </div>
        ) : (
          <TabsContent value="list" className="mt-0">
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-3 mb-2">
                <p className="text-sm">
                  Les budgets vous permettent de suivre et contrôler vos dépenses par catégorie. 
                  Ils vous aident à rester dans les limites que vous vous êtes fixées.
                </p>
              </div>
              {activeBudgets.slice(0, 4).map((budget) => {
                const progress = calculateBudgetProgress(budget.id);
                const statusColorClass = 
                  progress.percentage > 100 ? "bg-budget-danger" : 
                  progress.percentage > 80 ? "bg-yellow-500" : 
                  "bg-budget-success";

                return (
                  <div key={budget.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <div className="font-medium">
                        {budget.name}
                        <span className="text-xs ml-2 text-muted-foreground">
                          ({budget.categories.map(getCategoryName).join(', ')})
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2">
                        <span>{formatAmount(progress.spent)} / {formatAmount(budget.amount)}</span>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-4 w-4 rounded-full"
                          onClick={() => setSelectedBudget(budget.id)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Progress 
                      value={progress.percentage} 
                      max={100} 
                      className={`${statusColorClass}`}
                    />
                    {progress.percentage > 100 && (
                      <div className="text-xs text-budget-danger">
                        Budget dépassé de {(progress.percentage - 100).toFixed(0)}%
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
                      <span>Prévu: {formatAmount(budget.amount)}</span>
                      <span>Restant: {formatAmount(progress.remaining)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        )}

        <TabsContent value="chart" className="mt-0">
          {activeBudgets.length > 0 ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => `${value} €`}
                    labelFormatter={(label) => `Budget: ${label}`}
                  />
                  <Bar dataKey="alloué" fill="#9b87f5" name="Montant alloué" />
                  <Bar dataKey="dépensé" fill="#FC8181" name="Montant dépensé" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Aucun budget à afficher
            </div>
          )}
        </TabsContent>

        <Dialog
          open={selectedBudget !== null}
          onOpenChange={(open) => !open && setSelectedBudget(null)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ajouter au budget</DialogTitle>
              <DialogDescription>
                Augmentez le montant alloué à ce budget.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contribution" className="text-right">
                  Montant
                </Label>
                <Input
                  id="contribution"
                  type="number"
                  step="0.01"
                  min="0"
                  value={contribution}
                  onChange={(e) => setContribution(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedBudget(null)}>
                Annuler
              </Button>
              <Button type="submit" onClick={() => selectedBudget && handleAddContribution(selectedBudget)}>
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
