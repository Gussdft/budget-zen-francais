
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, PiggyBank, PlusCircle, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

const savingsGoalSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  targetAmount: z.coerce.number().positive("Le montant cible doit être positif"),
  currentAmount: z.coerce.number().min(0, "Le montant actuel ne peut pas être négatif"),
  deadline: z.date({
    required_error: "La date limite est requise",
  }),
});

const SavingsGoals = () => {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  // Charger les objectifs d'épargne depuis le localStorage
  useEffect(() => {
    const loadSavingsGoals = () => {
      setIsLoading(true);
      try {
        const storedGoals = localStorage.getItem("savingsGoals");
        if (storedGoals) {
          setSavingsGoals(JSON.parse(storedGoals));
        } else {
          // Objectifs par défaut pour la démonstration
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

  const form = useForm<z.infer<typeof savingsGoalSchema>>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      title: "",
      targetAmount: 0,
      currentAmount: 0,
    },
  });

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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getColorClass = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-amber-500";
    return "bg-green-500";
  };

  const handleSaveGoal = (values: z.infer<typeof savingsGoalSchema>) => {
    const newGoal: SavingsGoal = {
      id: `goal-${Date.now()}`,
      title: values.title,
      targetAmount: values.targetAmount,
      currentAmount: values.currentAmount,
      deadline: values.deadline.toISOString().split('T')[0],
    };

    const updatedGoals = [...savingsGoals, newGoal];
    setSavingsGoals(updatedGoals);
    localStorage.setItem("savingsGoals", JSON.stringify(updatedGoals));
    
    toast.success("Objectif d'épargne créé avec succès");
    setOpenDialog(false);
    form.reset();
  };

  const confirmDeleteGoal = (goalId: string) => {
    setGoalToDelete(goalId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteGoal = () => {
    if (goalToDelete) {
      const updatedGoals = savingsGoals.filter(goal => goal.id !== goalToDelete);
      setSavingsGoals(updatedGoals);
      localStorage.setItem("savingsGoals", JSON.stringify(updatedGoals));
      toast.success("Objectif d'épargne supprimé");
    }
    setDeleteDialogOpen(false);
    setGoalToDelete(null);
  };

  if (isLoading) {
    return <p>Chargement des objectifs d'épargne...</p>;
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Objectifs d'épargne
          </CardTitle>
          <Button 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={() => setOpenDialog(true)}
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Ajouter un objectif</span>
          </Button>
        </div>
        <CardDescription>Suivez vos progrès vers vos objectifs financiers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
          {savingsGoals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucun objectif d'épargne défini</p>
          ) : (
            savingsGoals.map((goal) => {
              const progress = calculateProgress(goal);
              const colorClass = getColorClass(progress);

              return (
                <div key={goal.id} className="border rounded-md p-4 space-y-2 bg-card hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{goal.title}</h3>
                    <div className="flex gap-1 items-center">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 rounded-full p-0 text-red-500 hover:text-red-600 hover:bg-red-100"
                        onClick={() => confirmDeleteGoal(goal.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
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
      
      {/* Dialog pour ajouter un nouvel objectif */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nouvel objectif d'épargne</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveGoal)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Vacances, voiture..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targetAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant cible (€)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant actuel (€)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date limite</FormLabel>
                    <DatePicker
                      date={field.value}
                      setDate={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                  Annuler
                </Button>
                <Button type="submit">Créer</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de confirmation pour supprimer un objectif */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement votre objectif d'épargne.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGoal} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default SavingsGoals;
