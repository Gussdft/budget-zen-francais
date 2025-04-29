
import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { InvestmentsList } from "@/components/Investments/InvestmentsList";
import { InvestmentForm } from "@/components/Investments/InvestmentForm";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useInvestments } from "@/hooks/use-investments";

const Investissements = () => {
  const [showForm, setShowForm] = useState(false);
  const { investments, isLoading } = useInvestments();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Investissements</h1>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" /> Nouvel investissement
          </Button>
        </div>
        
        {showForm && (
          <InvestmentForm onClose={() => setShowForm(false)} />
        )}
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse">Chargement des investissements...</div>
          </div>
        ) : (
          <InvestmentsList investments={investments} />
        )}
      </div>
    </MainLayout>
  );
};

export default Investissements;
