
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useBudgets } from "@/hooks/use-budgets";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

export function BudgetProgress() {
  const { budgets, calculateBudgetProgress, updateBudget } = useBudgets();
  const { getCategoryName } = useCategories();
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [contribution, setContribution] = useState<number>(0);

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

  return (
    <Card className="col-span-1 md:col-span-2 animate-fade-in [animation-delay:500ms]">
      <CardHeader className="pb-2">
        <CardTitle>Suivi des budgets</CardTitle>
      </CardHeader>
      <CardContent>
        {activeBudgets.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            Aucun budget actif
          </div>
        ) : (
          <div className="space-y-4">
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
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

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
    </Card>
  );
}
