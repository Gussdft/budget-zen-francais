
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransactions } from "@/hooks/use-transactions";
import { useCategories } from "@/hooks/use-categories";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownRight, ArrowUpRight, Plus, X, PiggyBank } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

// Définition du schéma pour les transactions rapides
const quickTransactionSchema = z.object({
  amount: z.coerce.number().min(0.01, "Le montant doit être supérieur à zéro"),
  description: z.string().min(1, "La description est requise"),
  categoryId: z.string().min(1, "La catégorie est requise"),
  type: z.enum(["income", "expense"]),
  isSavingsGoal: z.boolean().optional(),
  savingsGoalId: z.string().optional(),
});

type QuickTransactionValues = z.infer<typeof quickTransactionSchema>;

interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export function QuickTransactionEntry() {
  const { addTransaction } = useTransactions();
  const { categories } = useCategories();
  const [date, setDate] = useState<Date>(new Date());
  const [expanded, setExpanded] = useState(false);
  const [isSavingsGoal, setIsSavingsGoal] = useState(false);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);

  // Charger les objectifs d'épargne
  useEffect(() => {
    if (expanded) {
      try {
        const storedGoals = localStorage.getItem("savingsGoals");
        if (storedGoals) {
          setSavingsGoals(JSON.parse(storedGoals));
        }
      } catch (error) {
        console.error("Error loading savings goals:", error);
      }
    }
  }, [expanded]);

  const form = useForm<QuickTransactionValues>({
    resolver: zodResolver(quickTransactionSchema),
    defaultValues: {
      amount: 0,
      description: "",
      categoryId: "",
      type: "expense",
      isSavingsGoal: false,
    },
  });

  // Mettre à jour la catégorie lorsque isSavingsGoal change
  useEffect(() => {
    if (isSavingsGoal) {
      // Trouver la catégorie "Épargne" ou utiliser une catégorie par défaut
      const savingsCategory = categories.find(c => c.name === "Épargne");
      if (savingsCategory) {
        form.setValue("categoryId", savingsCategory.id);
      }
    }
  }, [isSavingsGoal, categories, form]);

  const onSubmit = (values: QuickTransactionValues) => {
    const transactionData = {
      amount: parseFloat(values.amount.toFixed(2)),
      date: date.toISOString().split('T')[0],
      description: values.description,
      categoryId: values.categoryId,
      type: values.type,
      savingsGoalId: values.isSavingsGoal ? values.savingsGoalId : undefined,
    };

    // Si c'est un objectif d'épargne, mettre à jour la description
    if (values.isSavingsGoal && values.savingsGoalId) {
      const goalName = savingsGoals.find(g => g.id === values.savingsGoalId)?.title;
      if (goalName) {
        transactionData.description = `${values.type === 'expense' ? 'Contribution à' : 'Retrait de'} l'objectif: ${goalName}`;
      }
    }

    addTransaction(transactionData);

    // Réinitialiser le formulaire
    form.reset({
      amount: 0,
      description: "",
      categoryId: "",
      type: "expense",
      isSavingsGoal: false,
    });
    setIsSavingsGoal(false);
    
    toast.success("Transaction ajoutée avec succès");
    setExpanded(false);  // Fermer le formulaire après l'ajout
  };

  if (!expanded) {
    return (
      <Button 
        onClick={() => setExpanded(true)} 
        className="w-full flex items-center gap-2 mb-4 bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/80 shadow-sm"
        variant="default"
      >
        <Plus size={18} />
        Ajouter une transaction rapide
      </Button>
    );
  }

  return (
    <Card className="mb-6 border border-border shadow-md">
      <CardHeader className="pb-2 bg-muted/30">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Nouvelle transaction</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setExpanded(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="flex items-center gap-2">
                          <SelectValue placeholder="Sélectionner le type">
                            {field.value === "income" ? (
                              <div className="flex items-center gap-2">
                                <ArrowUpRight className="h-4 w-4 text-budget-success" />
                                <span>Revenu</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <ArrowDownRight className="h-4 w-4 text-budget-danger" />
                                <span>Dépense</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income">
                          <div className="flex items-center gap-2">
                            <ArrowUpRight className="h-4 w-4 text-budget-success" />
                            <span>Revenu</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="expense">
                          <div className="flex items-center gap-2">
                            <ArrowDownRight className="h-4 w-4 text-budget-danger" />
                            <span>Dépense</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="quickIsSavingsGoal" 
                checked={isSavingsGoal}
                onCheckedChange={(checked) => {
                  setIsSavingsGoal(checked === true);
                  form.setValue("isSavingsGoal", checked === true);
                  if (!checked) {
                    form.setValue("savingsGoalId", undefined);
                  }
                }}
              />
              <label
                htmlFor="quickIsSavingsGoal"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
              >
                <PiggyBank className="h-4 w-4" /> Transaction liée à un objectif d'épargne
              </label>
            </div>

            {isSavingsGoal ? (
              <FormField
                control={form.control}
                name="savingsGoalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objectif d'épargne</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un objectif" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {savingsGoals.length > 0 ? (
                          savingsGoals.map((goal) => (
                            <SelectItem key={goal.id} value={goal.id}>
                              {goal.title}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            Aucun objectif d'épargne disponible
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une catégorie" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.length > 0 ? (
                              categories.map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="default" disabled>
                                Aucune catégorie disponible
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <div>
              <FormLabel>Date</FormLabel>
              <DatePicker date={date} setDate={(newDate) => newDate && setDate(newDate)} />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2 pt-4 border-t bg-muted/30">
            <Button type="button" variant="outline" onClick={() => setExpanded(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
