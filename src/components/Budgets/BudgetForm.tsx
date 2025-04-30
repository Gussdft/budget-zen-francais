import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useBudgets } from "@/hooks/use-budgets";
import { useCategories } from "@/hooks/use-categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Checkbox
} from "@/components/ui/checkbox";
import { X } from "lucide-react";

const budgetSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  amount: z.coerce.number().positive("Le montant doit être positif"),
  categories: z.array(z.string()).min(1, "Sélectionnez au moins une catégorie"),
  type: z.enum(["monthly", "yearly", "project"]),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().optional(),
  isActive: z.boolean(),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  onClose: () => void;
  budgetId?: string;
}

export function BudgetForm({ onClose, budgetId }: BudgetFormProps) {
  const { addBudget, budgets, updateBudget } = useBudgets();
  const { categories } = useCategories();
  
  const existingBudget = budgetId 
    ? budgets.find(b => b.id === budgetId) 
    : undefined;

  const expenseCategories = categories.filter(c => c.type === "expense" || c.type === "both");

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: existingBudget ? {
      name: existingBudget.name,
      amount: existingBudget.amount,
      categories: existingBudget.categories,
      type: existingBudget.type,
      startDate: existingBudget.startDate,
      endDate: existingBudget.endDate || "",
      isActive: existingBudget.isActive,
    } : {
      name: "",
      amount: 0,
      categories: [],
      type: "monthly",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      isActive: true,
    }
  });

  const onSubmit = (values: BudgetFormValues) => {
    if (budgetId) {
      // Fix: Ensure all required properties are included
      updateBudget(budgetId, {
        name: values.name,
        amount: values.amount,
        categories: values.categories,
        type: values.type,
        startDate: values.startDate,
        endDate: values.endDate,
        isActive: values.isActive
      });
    } else {
      addBudget(values);
    }
    onClose();
  };

  const watchType = form.watch("type");

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{budgetId ? "Modifier le budget" : "Nouveau budget"}</CardTitle>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom du budget" />
                    </FormControl>
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

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de budget</FormLabel>
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
                      <SelectItem value="monthly">Mensuel</SelectItem>
                      <SelectItem value="yearly">Annuel</SelectItem>
                      <SelectItem value="project">Projet</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchType === "project" && (
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de fin (optionnelle)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="categories"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Catégories</FormLabel>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {expenseCategories.map((category) => (
                      <FormField
                        key={category.id}
                        control={form.control}
                        name="categories"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={category.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(category.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, category.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== category.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {category.name}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Budget actif</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {budgetId ? "Mettre à jour" : "Ajouter"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
