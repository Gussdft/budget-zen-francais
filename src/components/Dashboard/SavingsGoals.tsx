
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, PiggyBank } from "lucide-react";
import { useEffect, useState } from "react";

interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

const SavingsGoals = () => {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load savings goals from local storage
    const loadSavingsGoals = () => {
      setIsLoading(true);
      try {
        const storedGoals = localStorage.getItem("savingsGoals");
        if (storedGoals) {
          setSavingsGoals(JSON.parse(storedGoals));
        } else {
          // Set default savings goals for demonstration
          const defaultGoals: SavingsGoal[] = [
            {
              id: "goal-1",
              title: "Nouvel ordinateur portable",
              targetAmount: 1500,
              currentAmount: 750,
              deadline: "2024-12-31",
            },
            {
              id: "goal-2",
              title: "Vacances d'été",
              targetAmount: 3000,
              currentAmount: 1200,
              deadline: "2025-06-30",
            },
            {
              id: "goal-3",
              title: "Acompte voiture",
              targetAmount: 5000,
              currentAmount: 2500,
              deadline: "2025-12-31",
            },
          ];
          setSavingsGoals(defaultGoals);
          localStorage.setItem("savingsGoals", JSON.stringify(defaultGoals));
        }
      } catch (error) {
        console.error("Error loading savings goals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavingsGoals();
  }, []);

  const calculateProgress = (goal: SavingsGoal) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    return Math.min(progress, 100); // Ensure progress doesn't exceed 100%
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const getColorClass = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-amber-500";
    return "bg-green-500";
  };

  if (isLoading) {
    return <p>Chargement des objectifs d'épargne...</p>;
  }

  // Added card wrapper for consistent styling
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5" />
          Objectifs d'épargne
        </CardTitle>
        <CardDescription>Suivez vos progrès vers vos objectifs financiers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {savingsGoals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucun objectif d'épargne défini</p>
          ) : (
            savingsGoals.map((goal) => {
              const progress = calculateProgress(goal);
              const colorClass = getColorClass(progress);

              return (
                <div key={goal.id} className="border rounded-md p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{goal.title}</h3>
                    <Sparkles className="h-4 w-4 text-amber-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Échéance: {formatDate(goal.deadline)}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>Progression:</span>
                    <span>
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-2"
                  />
                  <div className="text-right text-xs">{Math.round(progress)}%</div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsGoals;
