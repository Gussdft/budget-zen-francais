
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Simulated budget data
const budgetItems = [
  {
    id: 1,
    name: "Alimentation",
    current: 350,
    limit: 500,
    percentage: 70
  },
  {
    id: 2,
    name: "Loisirs",
    current: 150,
    limit: 200,
    percentage: 75
  },
  {
    id: 3,
    name: "Transport",
    current: 200,
    limit: 200,
    percentage: 100
  },
  {
    id: 4,
    name: "Shopping",
    current: 230,
    limit: 150,
    percentage: 153
  }
];

export function BudgetProgress() {
  return (
    <Card className="col-span-1 md:col-span-2 animate-fade-in [animation-delay:500ms]">
      <CardHeader className="pb-2">
        <CardTitle>Suivi des budgets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgetItems.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <div className="font-medium">{item.name}</div>
                <div className="text-muted-foreground">
                  {item.current.toFixed(2).replace('.', ',')} € / {item.limit.toFixed(2).replace('.', ',')} €
                </div>
              </div>
              <Progress 
                value={item.percentage} 
                max={100} 
                className={item.percentage > 100 ? "bg-muted" : ""}
              />
              {item.percentage > 100 && (
                <div className="text-xs text-budget-danger">
                  Budget dépassé de {(item.percentage - 100).toFixed(0)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
