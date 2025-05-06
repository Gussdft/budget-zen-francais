import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/use-categories";
import { useTransactions } from "@/hooks/use-transactions";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, ArrowDownRight, ArrowUpRight, PiggyBank } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

const transactionSchema = z.object({
  amount: z.coerce.number().min(0.01, "Le montant doit être supérieur à zéro"),
  description: z.string().min(1, "La description est requise"),
  categoryId: z.string().min(1, "La catégorie est requise"),
  type: z.enum(["income", "expense"]),
  isSavingsGoal: z.boolean().optional(),
  savingsGoalId: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onClose: () => void;
  transactionId?: string;
}

export function TransactionForm({ onClose, transactionId }: TransactionFormProps) {
  const { categories } = useCategories();
  const { addTransaction, transactions, updateTransaction } = useTransactions();
  
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isLoadingGoals, setIsLoadingGoals] = useState(true);
  
  const existingTransaction = transactionId 
    ? transactions.find(t => t.id === transactionId) 
    : undefined;

  const [date, setDate] = useState<Date>(
    existingTransaction ? new Date(existingTransaction.date) : new Date()
  );

  const [isSavingsGoal, setIsSavingsGoal] = useState(
    !!existingTransaction?.savingsGoalId
  );

  // Charger les objectifs d'épargne
  useEffect(() => {
    const loadSavingsGoals = () => {
      setIsLoadingGoals(true);
      try {
        const storedGoals = localStorage.getItem("savingsGoals");
        if (storedGoals) {
          setSavingsGoals(JSON.parse(storedGoals));
        }
      } catch (error) {
        console.error("Error loading savings goals:", error);
      } finally {
        setIsLoadingGoals(false);
      }
    };

    loadSavingsGoals();
  }, []);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: existingTransaction ? {
      amount: existingTransaction.amount,
      description: existingTransaction.description,
      categoryId: existingTransaction.categoryId,
      type: existingTransaction.type,
      isSavingsGoal: !!existingTransaction.savingsGoalId,
      savingsGoalId: existingTransaction.savingsGoalId,
    } : {
      amount: 0,
      description: "",
      categoryId: "",
      type: "expense",
      isSavingsGoal: false,
    }
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

  const onSubmit = (values: TransactionFormValues) => {
    const formattedDate = date.toISOString().split('T')[0];
    
    // Préparer les données de transaction
    const transactionData = {
      amount: parseFloat(values.amount.toFixed(2)),
      date: formattedDate,
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
    
    if (transactionId) {
      updateTransaction(transactionId, transactionData);
    } else {
      addTransaction(transactionData);
    }
    onClose();
  };

  return (
    <Card className="w-full border border-border shadow-md">
      <CardHeader className="flex flex-row items-center justify-between bg-muted/30">
        <CardTitle>{transactionId ? "Modifier la transaction" : "Nouvelle transaction"}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-5">
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

            <div>
              <FormLabel>Date</FormLabel>
              <DatePicker date={date} setDate={(newDate) => newDate && setDate(newDate)} />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isSavingsGoal" 
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
                htmlFor="isSavingsGoal"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
              >
                <PiggyBank className="h-4 w-4" /> Transaction liée à un objectif d'épargne
              </label>
            </div>

            {isSavingsGoal && (
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
                          <SelectItem value="no-goals" disabled>
                            Aucun objectif d'épargne disponible
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!isSavingsGoal && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
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
                            <SelectItem value="no-categories" disabled>
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
            )}

            {!isSavingsGoal && (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2 pt-4 border-t bg-muted/30">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {transactionId ? "Mettre à jour" : "Ajouter"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
