
import { useState, useEffect } from "react";
import { toast } from "sonner";

export type Category = {
  id: string;
  name: string;
  color: string;
  type: "income" | "expense" | "both";
  icon: string;
};

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
          // Catégories par défaut
          const defaultCategories: Category[] = [
            { id: "cat-1", name: "Salaire", color: "#4CAF50", type: "income", icon: "dollar-sign" },
            { id: "cat-2", name: "Logement", color: "#2196F3", type: "expense", icon: "home" },
            { id: "cat-3", name: "Courses", color: "#FF9800", type: "expense", icon: "shopping-cart" },
            { id: "cat-4", name: "Transport", color: "#795548", type: "expense", icon: "bus" },
            { id: "cat-5", name: "Loisirs", color: "#9C27B0", type: "expense", icon: "music" },
            { id: "cat-6", name: "Revenus divers", color: "#4CAF50", type: "income", icon: "plus" }
          ];
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

  const addCategory = (categoryData: Omit<Category, "id">) => {
    const newCategory = {
      ...categoryData,
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

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || "Non catégorisé";
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
