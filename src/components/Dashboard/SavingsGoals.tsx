// Fix for the Progress component props error
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
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

  const getColorScheme = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-amber-500";
    return "bg-green-500";
  };

  if (isLoading) {
    return <p>Chargement des objectifs d'épargne...</p>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {savingsGoals.map((goal) => {
        const progress = calculateProgress(goal);
        const colorScheme = getColorScheme(progress);

        return (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{goal.title}</CardTitle>
                <Sparkles className="h-5 w-5 text-amber-500" />
              </div>
              <CardDescription>
                Deadline: {formatDate(goal.deadline)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Objectif:</span>
                  <span>{formatCurrency(goal.targetAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Épargné:</span>
                  <span>{formatCurrency(goal.currentAmount)}</span>
                </div>
                <Progress 
                  value={progress} 
                  max={100} 
                  className={`${colorScheme}30`}
                  // Remove indicatorClassName and indicatorStyle props
                />
                <div className="text-right text-sm">{Math.round(progress)}%</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SavingsGoals;
