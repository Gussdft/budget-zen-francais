
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Car, Plane, Home, Plus, Minus, X, PiggyBank, Target } from "lucide-react";
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
import { useTransactions } from "@/hooks/use-transactions";
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";

// Simulated savings goals data
const initialGoals = [
  {
    id: 1,
    name: "Vacances en Italie",
    current: 1200,
    target: 3000,
    percentage: 40,
    icon: Plane,
    deadline: "Août 2025",
    color: "#4DC0B5"
  },
  {
    id: 2,
    name: "Achat voiture",
    current: 5000,
    target: 15000,
    percentage: 33,
    icon: Car,
    deadline: "Décembre 2025",
    color: "#2C5282"
  },
  {
    id: 3,
    name: "Apport immobilier",
    current: 20000,
    target: 50000,
    percentage: 40,
    icon: Home,
    deadline: "Juin 2026",
    color: "#68D391"
  }
];

const COLORS = ["#4DC0B5", "#2C5282", "#68D391", "#F6AD55", "#FC8181"];

export function SavingsGoals() {
  const [goals, setGoals] = useState(initialGoals);
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const [contribution, setContribution] = useState<number>(0);
  const [withdrawal, setWithdrawal] = useState<number>(0);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    target: 0,
    deadline: ""
  });
  const { addTransaction } = useTransactions();

  const handleAddContribution = (goalId: number) => {
    if (contribution <= 0) {
      toast.error("Le montant doit être supérieur à zéro");
      return;
    }
    
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

    // Ajouter une transaction
    const goalData = goals.find(g => g.id === goalId);
    if (goalData) {
      addTransaction({
        amount: contribution,
        date: new Date().toISOString().split('T')[0],
        description: `Contribution à l'objectif: ${goalData.name}`,
        categoryId: "cat-6", // Catégorie "Épargne"
        type: "expense" 
      });
    }

    toast.success("Contribution ajoutée avec succès !");
    setSelectedGoal(null);
    setContribution(0);
  };
  
  const handleWithdrawFromGoal = (goalId: number) => {
    const goalData = goals.find(g => g.id === goalId);
    if (!goalData) return;
    
    if (withdrawal <= 0) {
      toast.error("Le montant doit être supérieur à zéro");
      return;
    }
    
    if (withdrawal > goalData.current) {
      toast.error("Vous ne pouvez pas retirer plus que le montant disponible");
      return;
    }
    
    setGoals(currentGoals => 
      currentGoals.map(goal => {
        if (goal.id === goalId) {
          const newCurrent = goal.current - withdrawal;
          const newPercentage = Math.round((newCurrent / goal.target) * 100);
          
          return {
            ...goal,
            current: newCurrent,
            percentage: newPercentage
          };
        }
        return goal;
      })
    );
    
    // Ajouter une transaction
    if (goalData) {
      addTransaction({
        amount: withdrawal,
        date: new Date().toISOString().split('T')[0],
        description: `Retrait de l'objectif: ${goalData.name}`,
        categoryId: "cat-6", // Catégorie "Épargne"
        type: "income" 
      });
    }

    toast.success("Retrait effectué avec succès !");
    setIsWithdrawing(false);
    setWithdrawal(0);
  };

  const handleCreateGoal = () => {
    if (!newGoal.name || newGoal.target <= 0 || !newGoal.deadline) {
      toast.error("Veuillez remplir tous les champs correctement");
      return;
    }
    
    const newId = Math.max(...goals.map(g => g.id), 0) + 1;
    const randomColorIndex = Math.floor(Math.random() * COLORS.length);
    
    const goalToAdd = {
      id: newId,
      name: newGoal.name,
      current: 0,
      target: newGoal.target,
      percentage: 0,
      icon: [PiggyBank, Target][Math.floor(Math.random() * 2)],
      deadline: newGoal.deadline,
      color: COLORS[randomColorIndex]
    };
    
    setGoals([...goals, goalToAdd]);
    toast.success("Nouvel objectif d'épargne créé !");
    setIsAddingNew(false);
    setNewGoal({ name: "", target: 0, deadline: "" });
  };

  const chartData = goals.map((goal) => ({
    name: goal.name,
    value: goal.current,
    color: goal.color || COLORS[Math.floor(Math.random() * COLORS.length)]
  }));

  const totalSaved = goals.reduce((acc, goal) => acc + goal.current, 0);
  const formattedTotal = totalSaved.toLocaleString('fr-FR') + ' €';

  return (
    <Card className="animate-fade-in [animation-delay:600ms]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Objectifs d'épargne</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddingNew(true)}
            className="text-xs flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> 
            Nouvel objectif
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-4 border-b border-border">
          <div className="text-center mb-2">
            <div className="text-sm text-muted-foreground">Total épargné</div>
            <div className="text-2xl font-bold">{formattedTotal}</div>
          </div>
          <div className="h-[180px]">
            <ChartContainer
              config={{
                goal1: { color: "#4DC0B5" },
                goal2: { color: "#2C5282" },
                goal3: { color: "#68D391" },
                goal4: { color: "#F6AD55" },
                goal5: { color: "#FC8181" }
              }}
            >
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </div>
        </div>
        
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
                <div className="flex gap-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6"
                    onClick={() => {
                      setSelectedGoal(goal.id);
                      setIsWithdrawing(false);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6"
                    onClick={() => {
                      setSelectedGoal(goal.id);
                      setIsWithdrawing(true);
                    }}
                    disabled={goal.current <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <div className="text-muted-foreground text-xs">
                    {goal.current.toLocaleString('fr-FR')} € / {goal.target.toLocaleString('fr-FR')} €
                  </div>
                  <div className="text-xs font-medium">{goal.percentage}%</div>
                </div>
                <Progress 
                  value={goal.percentage} 
                  max={100} 
                  className="h-2" 
                  style={{ backgroundColor: `${goal.color}30` }}
                  indicatorClassName={cn("transition-transform", {
                    "bg-primary": !goal.color
                  })}
                  // Add inline style for the indicator color when goal.color exists
                  indicatorStyle={goal.color ? { backgroundColor: goal.color } : undefined}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Dialog pour ajouter une contribution */}
      <Dialog
        open={selectedGoal !== null && !isWithdrawing}
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

      {/* Dialog pour retirer de l'argent */}
      <Dialog
        open={selectedGoal !== null && isWithdrawing}
        onOpenChange={(open) => !open && setSelectedGoal(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Retirer de l'objectif d'épargne</DialogTitle>
            <DialogDescription>
              Retirez de l'argent de votre objectif d'épargne.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="withdrawal" className="text-right">
                Montant
              </Label>
              <Input
                id="withdrawal"
                type="number"
                step="0.01"
                min="0"
                max={selectedGoal ? goals.find(g => g.id === selectedGoal)?.current : 0}
                value={withdrawal}
                onChange={(e) => setWithdrawal(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedGoal(null)}>
              Annuler
            </Button>
            <Button type="submit" onClick={() => selectedGoal && handleWithdrawFromGoal(selectedGoal)}>
              Retirer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour ajouter un nouvel objectif */}
      <Dialog
        open={isAddingNew}
        onOpenChange={setIsAddingNew}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nouvel objectif d'épargne</DialogTitle>
            <DialogDescription>
              Créez un nouvel objectif pour épargner en vue d'un projet.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="goalName" className="text-right">
                Nom
              </Label>
              <Input
                id="goalName"
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="goalTarget" className="text-right">
                Objectif (€)
              </Label>
              <Input
                id="goalTarget"
                type="number"
                step="0.01"
                min="0"
                value={newGoal.target}
                onChange={(e) => setNewGoal({...newGoal, target: Number(e.target.value)})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="goalDeadline" className="text-right">
                Échéance
              </Label>
              <Input
                id="goalDeadline"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                placeholder="ex: Décembre 2025"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingNew(false)}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleCreateGoal}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
