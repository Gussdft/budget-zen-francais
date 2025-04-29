
import { useState, useEffect } from "react";
import { toast } from "sonner";

export type Category = {
  id: string;
  name: string;
  icon: string;
  type: "income" | "expense" | "both";
  color: string;
};

// Catégories par défaut
const defaultCategories: Category[] = [
  { id: "cat-1", name: "Alimentation", icon: "shopping-cart", type: "expense", color: "#4CAF50" },
  { id: "cat-2", name: "Logement", icon: "home", type: "expense", color: "#2196F3" },
  { id: "cat-3", name: "Transport", icon: "car", type: "expense", color: "#FF9800" },
  { id: "cat-4", name: "Loisirs", icon: "film", type: "expense", color: "#9C27B0" },
  { id: "cat-5", name: "Santé", icon: "heart", type: "expense", color: "#F44336" },
  { id: "cat-6", name: "Salaire", icon: "briefcase", type: "income", color: "#00BCD4" },
  { id: "cat-7", name: "Investissements", icon: "trending-up", type: "both", color: "#795548" },
];

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupération des catégories depuis le localStorage
    const loadCategories = () => {
      setIsLoading(true);
      try {
        const storedCategories = localStorage.getItem("categories");
        if (storedCategories) {
          setCategories(JSON.parse(storedCategories));
        } else {
          // Si aucune catégorie n'est stockée, on utilise les catégories par défaut
          setCategories(defaultCategories);
          localStorage.setItem("categories", JSON.stringify(defaultCategories));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        toast.error("Impossible de charger les catégories");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = {
      ...category,
      id: `cat-${Date.now()}`
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
    toast.success("Catégorie ajoutée avec succès");
    return newCategory;
  };

  const updateCategory = (id: string, data: Partial<Omit<Category, "id">>) => {
    const updatedCategories = categories.map(category => 
      category.id === id ? { ...category, ...data } : category
    );
    
    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
    toast.success("Catégorie mise à jour");
  };

  const deleteCategory = (id: string) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
    toast.success("Catégorie supprimée");
  };

  const getCategoryName = (id: string): string => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : "Catégorie inconnue";
  };

  return { 
    categories, 
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryName
  };
};
