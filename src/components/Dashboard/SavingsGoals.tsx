
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Car, Plane, Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Simulated savings goals data
const initialGoals = [
  {
    id: 1,
    name: "Vacances en Italie",
    current: 1200,
    target: 3000,
    percentage: 40,
    icon: Plane,
    deadline: "Août 2025"
  },
  {
    id: 2,
    name: "Achat voiture",
    current: 5000,
    target: 15000,
    percentage: 33,
    icon: Car,
    deadline: "Décembre 2025"
  },
  {
    id: 3,
    name: "Apport immobilier",
    current: 20000,
    target: 50000,
    percentage: 40,
    icon: Home,
    deadline: "Juin 2026"
  }
];

export function SavingsGoals() {
  const [goals, setGoals] = useState(initialGoals);
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const [contribution, setContribution] = useState<number>(0);

  const handleAddContribution = (goalId: number) => {
    setGoals(currentGoals => 
      currentGoals.map(goal => {
        if (goal.id === goalId) {
          const newCurrent = goal.current + contribution;
          const newPercentage = Math.min(Math.round((newCurrent / goal.target) * 100), 100);
          
          return {
            ...goal,
            current: newCurrent,
            percentage: newPercentage
          };
        }
        return goal;
      })
    );

    toast.success("Contribution ajoutée avec succès !");
    setSelectedGoal(null);
    setContribution(0);
  };

  return (
    <Card className="animate-fade-in [animation-delay:600ms]">
      <CardHeader className="pb-2">
        <CardTitle>Objectifs d'épargne</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {goals.map((goal) => (
            <div 
              key={goal.id} 
              className="p-4 border-b border-border last:border-0"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <goal.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{goal.name}</div>
                    <div className="text-xs text-muted-foreground">Échéance: {goal.deadline}</div>
                  </div>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6"
                  onClick={() => setSelectedGoal(goal.id)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <div className="text-muted-foreground text-xs">
                    {goal.current.toLocaleString('fr-FR')} € / {goal.target.toLocaleString('fr-FR')} €
                  </div>
                  <div className="text-xs font-medium">{goal.percentage}%</div>
                </div>
                <Progress value={goal.percentage} max={100} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog
        open={selectedGoal !== null}
        onOpenChange={(open) => !open && setSelectedGoal(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter à l'objectif d'épargne</DialogTitle>
            <DialogDescription>
              Contribuez à votre objectif pour vous rapprocher de votre but.
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
            <Button variant="outline" onClick={() => setSelectedGoal(null)}>
              Annuler
            </Button>
            <Button type="submit" onClick={() => selectedGoal && handleAddContribution(selectedGoal)}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
