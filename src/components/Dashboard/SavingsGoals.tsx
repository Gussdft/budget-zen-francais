
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Car, Plane, Home } from "lucide-react";

// Simulated savings goals data
const goals = [
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
    </Card>
  );
}
