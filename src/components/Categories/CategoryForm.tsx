
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

const categorySchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  icon: z.string().min(1, "L'icône est requise"),
  type: z.enum(["income", "expense", "both"]),
  color: z.string().min(1, "La couleur est requise"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  onClose: () => void;
  categoryId?: string;
}

export function CategoryForm({ onClose, categoryId }: CategoryFormProps) {
  const { addCategory, categories, updateCategory } = useCategories();
  
  const existingCategory = categoryId 
    ? categories.find(c => c.id === categoryId) 
    : undefined;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: existingCategory ? {
      name: existingCategory.name,
      icon: existingCategory.icon,
      type: existingCategory.type,
      color: existingCategory.color,
    } : {
      name: "",
      icon: "circle",
      type: "expense",
      color: "#4CAF50",
    }
  });

  const onSubmit = (values: CategoryFormValues) => {
    if (categoryId) {
      updateCategory(categoryId, values);
    } else {
      addCategory({
        name: values.name,
        icon: values.icon,
        type: values.type,
        color: values.color,
      });
    }
    onClose();
  };

  const iconOptions = [
    { value: "shopping-cart", label: "Shopping" },
    { value: "home", label: "Maison" },
    { value: "car", label: "Voiture" },
    { value: "film", label: "Film" },
    { value: "heart", label: "Santé" },
    { value: "briefcase", label: "Travail" },
    { value: "trending-up", label: "Investissement" },
    { value: "dollar-sign", label: "Argent" },
    { value: "gift", label: "Cadeau" },
    { value: "coffee", label: "Restaurant" },
    { value: "book", label: "Éducation" },
    // Nouvelles icônes ajoutées
    { value: "plane", label: "Voyages" },
    { value: "music", label: "Musique" },
    { value: "phone", label: "Téléphonie" },
    { value: "wifi", label: "Internet" },
    { value: "tv", label: "TV/Streaming" },
    { value: "credit-card", label: "Carte bancaire" },
    { value: "truck", label: "Livraison" },
    { value: "umbrella", label: "Assurance" },
    { value: "tag", label: "Shopping" },
    { value: "calendar", label: "Abonnement" },
    { value: "package", label: "Colis" },
    { value: "globe", label: "International" },
    { value: "smartphone", label: "Mobile" },
    { value: "zap", label: "Électricité" },
    { value: "smile", label: "Bien-être" },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{categoryId ? "Modifier la catégorie" : "Nouvelle catégorie"}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom de la catégorie" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icône</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une icône" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {iconOptions.map(icon => (
                          <SelectItem key={icon.value} value={icon.value}>
                            {icon.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="income">Revenu</SelectItem>
                        <SelectItem value="expense">Dépense</SelectItem>
                        <SelectItem value="both">Les deux</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Couleur</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
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
              {categoryId ? "Mettre à jour" : "Ajouter"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
