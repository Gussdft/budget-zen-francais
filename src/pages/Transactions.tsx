
import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { TransactionsList } from "@/components/Transactions/TransactionsList";
import { TransactionForm } from "@/components/Transactions/TransactionForm";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";

const Transactions = () => {
  const [showForm, setShowForm] = useState(false);
  const { transactions, isLoading } = useTransactions();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Transactions</h1>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" /> Nouvelle transaction
          </Button>
        </div>
        
        {showForm && (
          <TransactionForm onClose={() => setShowForm(false)} />
        )}
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse">Chargement des transactions...</div>
          </div>
        ) : (
          <TransactionsList transactions={transactions} />
        )}
      </div>
    </MainLayout>
  );
};

export default Transactions;
