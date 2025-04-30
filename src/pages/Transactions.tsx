
import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { TransactionsList } from "@/components/Transactions/TransactionsList";
import { TransactionForm } from "@/components/Transactions/TransactionForm";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar } from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";

const Transactions = () => {
  const [showForm, setShowForm] = useState(false);
  const { transactions, isLoading } = useTransactions();
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  
  // Filtrer les transactions par date si une date est sélectionnée
  const filteredTransactions = filterDate 
    ? transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.toDateString() === filterDate.toDateString();
      })
    : transactions;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-semibold">Transactions</h1>
          <div className="flex flex-wrap gap-2">
            <Card className="p-1">
              <CardContent className="p-1">
                <DatePicker
                  date={filterDate}
                  setDate={setFilterDate}
                  label="Filtrer par date"
                  className="w-auto"
                />
              </CardContent>
            </Card>
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" /> Nouvelle transaction
            </Button>
          </div>
        </div>
        
        {showForm && (
          <TransactionForm onClose={() => setShowForm(false)} />
        )}
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse">Chargement des transactions...</div>
          </div>
        ) : (
          <>
            {filterDate && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" /> 
                  Filtre actif: {filterDate.toLocaleDateString('fr-FR')}
                </div>
                {filterDate && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setFilterDate(undefined)}
                  >
                    Effacer le filtre
                  </Button>
                )}
              </div>
            )}
            <TransactionsList transactions={filteredTransactions} />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Transactions;
