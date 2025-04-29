
import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { CategoryList } from "@/components/Categories/CategoryList";
import { CategoryForm } from "@/components/Categories/CategoryForm";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useCategories } from "@/hooks/use-categories";

const Categories = () => {
  const [showForm, setShowForm] = useState(false);
  const { categories, isLoading } = useCategories();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Catégories</h1>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" /> Nouvelle catégorie
          </Button>
        </div>
        
        {showForm && (
          <CategoryForm onClose={() => setShowForm(false)} />
        )}
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse">Chargement des catégories...</div>
          </div>
        ) : (
          <CategoryList categories={categories} />
        )}
      </div>
    </MainLayout>
  );
};

export default Categories;
