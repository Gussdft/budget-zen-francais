
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useInvestments } from "@/hooks/use-investments";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

const investmentSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  type: z.enum(["action", "crypto", "immobilier", "autre"]),
  amount: z.coerce.number().positive("Le montant doit être positif"),
  quantity: z.coerce.number().optional(),
  purchaseDate: z.string().min(1, "La date d'achat est requise"),
  currentValue: z.coerce.number().positive("La valeur doit être positive"),
  lastUpdate: z.string().min(1, "La date de mise à jour est requise"),
  notes: z.string().optional(),
});

type InvestmentFormValues = z.infer<typeof investmentSchema>;

interface InvestmentFormProps {
  onClose: () => void;
  investmentId?: string;
}

export function InvestmentForm({ onClose, investmentId }: InvestmentFormProps) {
  const { addInvestment, investments, updateInvestment } = useInvestments();
  
  const existingInvestment = investmentId 
    ? investments.find(inv => inv.id === investmentId) 
    : undefined;

  const form = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentSchema),
    defaultValues: existingInvestment ? {
      name: existingInvestment.name,
      type: existingInvestment.type,
      amount: existingInvestment.amount,
      quantity: existingInvestment.quantity,
      purchaseDate: existingInvestment.purchaseDate,
      currentValue: existingInvestment.currentValue,
      lastUpdate: existingInvestment.lastUpdate,
      notes: existingInvestment.notes,
    } : {
      name: "",
      type: "action",
      amount: 0,
      quantity: undefined,
      purchaseDate: new Date().toISOString().split('T')[0],
      currentValue: 0,
      lastUpdate: new Date().toISOString().split('T')[0],
      notes: "",
    }
  });

  const onSubmit = (values: InvestmentFormValues) => {
    if (investmentId) {
      updateInvestment(investmentId, values);
    } else {
      addInvestment(values);
    }
    onClose();
  };

  const watchType = form.watch("type");

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{investmentId ? "Modifier l'investissement" : "Nouvel investissement"}</CardTitle>
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
                      <Input {...field} placeholder="Nom de l'investissement" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        <SelectItem value="action">Action</SelectItem>
                        <SelectItem value="crypto">Crypto-monnaie</SelectItem>
                        <SelectItem value="immobilier">Immobilier</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant investi (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'achat</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {(watchType === "action" || watchType === "crypto") && (
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantité</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step={watchType === "crypto" ? "0.00000001" : "1"}
                        {...field} 
                        value={field.value || ""} 
                        onChange={(e) => {
                          const value = e.target.value ? parseFloat(e.target.value) : undefined;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valeur actuelle (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastUpdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dernière mise à jour</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {investmentId ? "Mettre à jour" : "Ajouter"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
