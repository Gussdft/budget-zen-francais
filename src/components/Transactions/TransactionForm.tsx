
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

// Importation simulée des objectifs d'épargne
// Dans une application réelle, cela viendrait d'un hook comme useSavingsGoals
const savingsGoals = [
  { id: 1, name: "Vacances en Italie" },
  { id: 2, name: "Achat voiture" },
  { id: 3, name: "Apport immobilier" }
];

const transactionSchema = z.object({
  amount: z.coerce.number().min(0.01, "Le montant doit être supérieur à zéro"),
  description: z.string().min(1, "La description est requise"),
  categoryId: z.string().min(1, "La catégorie est requise"),
  type: z.enum(["income", "expense"]),
  isSavingsGoal: z.boolean().optional(),
  savingsGoalId: z.number().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onClose: () => void;
  transactionId?: string;
}

export function TransactionForm({ onClose, transactionId }: TransactionFormProps) {
  const { categories } = useCategories();
  const { addTransaction, transactions, updateTransaction } = useTransactions();
  
  const existingTransaction = transactionId 
    ? transactions.find(t => t.id === transactionId) 
    : undefined;

  const [date, setDate] = useState<Date>(
    existingTransaction ? new Date(existingTransaction.date) : new Date()
  );

  const [isSavingsGoal, setIsSavingsGoal] = useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: existingTransaction ? {
      amount: existingTransaction.amount,
      description: existingTransaction.description,
      categoryId: existingTransaction.categoryId,
      type: existingTransaction.type,
      isSavingsGoal: false,
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
      // Définir la catégorie sur "Épargne" si c'est un objectif d'épargne
      form.setValue("categoryId", "cat-6"); // Supposons que cat-6 soit la catégorie "Épargne"
    }
  }, [isSavingsGoal, form]);

  const onSubmit = (values: TransactionFormValues) => {
    const formattedDate = date.toISOString().split('T')[0];
    
    // Si c'est un objectif d'épargne, mettre à jour la description
    if (values.isSavingsGoal && values.savingsGoalId) {
      const goalName = savingsGoals.find(g => g.id === values.savingsGoalId)?.name;
      if (goalName) {
        values.description = `${values.type === 'expense' ? 'Contribution à' : 'Retrait de'} l'objectif: ${goalName}`;
      }
    }
    
    if (transactionId) {
      updateTransaction(transactionId, {
        ...values,
        date: formattedDate,
      });
    } else {
      addTransaction({
        amount: values.amount,
        date: formattedDate,
        description: values.description,
        categoryId: values.categoryId,
        type: values.type,
      });
    }
    onClose();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{transactionId ? "Modifier la transaction" : "Nouvelle transaction"}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
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
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
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
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un objectif" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {savingsGoals.map((goal) => (
                          <SelectItem key={goal.id} value={goal.id.toString()}>
                            {goal.name}
                          </SelectItem>
                        ))}
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
                        disabled={isSavingsGoal}
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
          
          <CardFooter className="flex justify-end gap-2">
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
