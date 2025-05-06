
import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { TransactionsList } from "@/components/Transactions/TransactionsList";
import { TransactionForm } from "@/components/Transactions/TransactionForm";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, Filter } from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-categories";
import { Badge } from "@/components/ui/badge";

const Transactions = () => {
  const [showForm, setShowForm] = useState(false);
  const { transactions, isLoading } = useTransactions();
  const { categories } = useCategories();
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [filterCategory, setFilterCategory] = useState<string | undefined>(undefined);
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  
  // Appliquer tous les filtres
  const filteredTransactions = transactions.filter(t => {
    // Filtre par date
    if (filterDate && new Date(t.date).toDateString() !== filterDate.toDateString()) {
      return false;
    }
    
    // Filtre par catégorie
    if (filterCategory && t.categoryId !== filterCategory) {
      return false;
    }
    
    // Filtre par type
    if (filterType !== "all" && t.type !== filterType) {
      return false;
    }
    
    return true;
  });

  const clearFilters = () => {
    setFilterDate(undefined);
    setFilterCategory(undefined);
    setFilterType("all");
  };

  return (
    <MainLayout title="Transactions">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/80 shadow-sm">
              <PlusCircle className="h-5 w-5" /> Nouvelle transaction
            </Button>
          </div>
        </div>
        
        <Card className="border border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtres:</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Date</span>
                  <DatePicker
                    date={filterDate}
                    setDate={setFilterDate}
                    className="w-auto"
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Catégorie</span>
                  <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-categories">Toutes les catégories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Type</span>
                  <Select
                    value={filterType}
                    onValueChange={(value: "all" | "income" | "expense") => setFilterType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="income">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-budget-success"></span>
                          <span>Revenus</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="expense">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-budget-danger"></span>
                          <span>Dépenses</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                disabled={!filterDate && !filterCategory && filterType === "all"}
                className="mt-2 md:mt-0"
              >
                Effacer les filtres
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {showForm && (
          <TransactionForm onClose={() => setShowForm(false)} />
        )}
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse">Chargement des transactions...</div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                {filteredTransactions.length} transaction{filteredTransactions.length > 1 ? 's' : ''} affichée{filteredTransactions.length > 1 ? 's' : ''}
              </div>
              <div className="flex flex-wrap gap-2">
                {filterDate && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> 
                    {filterDate.toLocaleDateString('fr-FR')}
                  </Badge>
                )}
                {filterCategory && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    {categories.find(c => c.id === filterCategory)?.name}
                  </Badge>
                )}
                {filterType !== "all" && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${filterType === "income" ? "bg-budget-success" : "bg-budget-danger"}`}></span>
                    {filterType === "income" ? "Revenus" : "Dépenses"}
                  </Badge>
                )}
              </div>
            </div>
            <TransactionsList transactions={filteredTransactions} />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Transactions;
