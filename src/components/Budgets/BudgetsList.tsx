
import { useState } from "react";
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Edit, Trash2 } from "lucide-react";
import { Budget, useBudgets } from "@/hooks/use-budgets";
import { BudgetForm } from "./BudgetFormWrapper";
import { useCategories } from "@/hooks/use-categories";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface BudgetsListProps {
  budgets: Budget[];
}

export function BudgetsList({ budgets }: BudgetsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const { deleteBudget, calculateBudgetProgress } = useBudgets();
  const { getCategoryName } = useCategories();

  if (budgets.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">Aucun budget enregistré</p>
      </div>
    );
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'monthly': return 'Mensuel';
      case 'yearly': return 'Annuel';
      case 'project': return 'Projet';
      default: return type;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-6">
      {editingId && (
        <BudgetForm 
          budgetId={editingId} 
          onClose={() => setEditingId(null)} 
        />
      )}
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          const progress = calculateBudgetProgress(budget.id);
          let statusColor = "bg-green-500";
          if (progress.percentage > 80) {
            statusColor = "bg-yellow-500";
          }
          if (progress.percentage >= 100) {
            statusColor = "bg-red-500";
          }
          
          return (
            <Card key={budget.id} className={budget.isActive ? "" : "opacity-60"}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{budget.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setEditingId(budget.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer le budget</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce budget ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteBudget(budget.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <p className="flex justify-between">
                    <span>Type:</span>
                    <span>{getTypeLabel(budget.type)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Période:</span>
                    <span>
                      {formatDate(budget.startDate)} 
                      {budget.endDate && ` - ${formatDate(budget.endDate)}`}
                    </span>
                  </p>
                  <p>
                    <span>Catégories: </span>
                    <span className="font-medium">
                      {budget.categories.map(getCategoryName).join(", ")}
                    </span>
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Budget total:</span>
                    <span className="font-bold">{formatAmount(budget.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dépensé:</span>
                    <span className={progress.percentage >= 100 ? "text-red-500 font-medium" : ""}>
                      {formatAmount(progress.spent)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Restant:</span>
                    <span className="font-medium">
                      {formatAmount(progress.remaining)}
                    </span>
                  </div>
                  <Progress value={progress.percentage} className={statusColor} />
                  <div className="text-right text-sm">
                    {Math.round(progress.percentage)}%
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full text-xs text-muted-foreground">
                  {!budget.isActive && <p className="text-center">Ce budget est inactif</p>}
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
