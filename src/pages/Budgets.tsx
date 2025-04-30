
import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { BudgetsList } from "@/components/Budgets/BudgetsList";
import { BudgetForm } from "@/components/Budgets/BudgetFormWrapper";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useBudgets } from "@/hooks/use-budgets";

const Budgets = () => {
  const [showForm, setShowForm] = useState(false);
  const { budgets, isLoading } = useBudgets();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Budgets & Projets</h1>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" /> Nouveau budget
          </Button>
        </div>
        
        {showForm && (
          <BudgetForm onClose={() => setShowForm(false)} />
        )}
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse">Chargement des budgets...</div>
          </div>
        ) : (
          <BudgetsList budgets={budgets} />
        )}
      </div>
    </MainLayout>
  );
};

export default Budgets;
