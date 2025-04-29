
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useBudgets } from "@/hooks/use-budgets";
import { useCategories } from "@/hooks/use-categories";

export function BudgetProgress() {
  const { budgets, calculateBudgetProgress } = useBudgets();
  const { getCategoryName } = useCategories();

  // Filtrer pour n'avoir que les budgets actifs
  const activeBudgets = budgets.filter(budget => budget.isActive);
  
  // Formater le montant avec le symbole €
  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2).replace('.', ',')} €`;
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
                    <div className="text-muted-foreground">
                      {formatAmount(progress.spent)} / {formatAmount(budget.amount)}
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
    </Card>
  );
}
