
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Coffee, 
  ShoppingCart, 
  Home, 
  Bus,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  CircleMinus,
  CirclePlus,
  PiggyBank,
  Briefcase,
  Settings,
  Category
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTransactions } from "@/hooks/use-transactions";
import { useCategories } from "@/hooks/use-categories";
import { TransactionPopup } from "@/components/Transactions/TransactionPopup";

// Map des icônes par défaut avec plus d'options
const categoryIcons: Record<string, any> = {
  "Logement": Home,
  "Courses": ShoppingCart,
  "Restaurant": Coffee,
  "Revenus": ArrowUpRight,
  "Transport": Bus,
  "Loisirs": PiggyBank,
  "Santé": CirclePlus,
  "Vacances": DollarSign,
  "Salaire": TrendingUp,
  "Investissement": Briefcase,
  "Épargne": CircleDollarSign,
  "Factures": CircleMinus,
  "Autres": Category,
  "default": CreditCard
};

// Format date to French format
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

// Format amount with currency symbol
const formatAmount = (amount: number) => {
  return `${amount.toFixed(2).replace('.', ',')} €`;
};

export function RecentTransactions() {
  const { transactions } = useTransactions();
  const { categories } = useCategories();
  const [limit] = useState(5);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const getIconForCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return categoryIcons["default"];
    
    return categoryIcons[category.name] || categoryIcons["default"];
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || "Non catégorisé";
  };

  // Trier les transactions par date (les plus récentes en premier) et limiter à 5
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return (
    <Card className="col-span-1 animate-fade-in [animation-delay:400ms]">
      <CardHeader className="pb-2">
        <CardTitle>Transactions récentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {recentTransactions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Aucune transaction récente
            </div>
          ) : (
            recentTransactions.map((transaction) => {
              const TransactionIcon = getIconForCategory(transaction.categoryId);
              return (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-budget-success/10' : 'bg-muted/80'}`}>
                      <TransactionIcon className={`h-4 w-4 ${transaction.type === 'income' ? 'text-budget-success' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(transaction.date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={transaction.type === 'income' ? "outline" : "secondary"} className="hidden md:flex">
                      {getCategoryName(transaction.categoryId)}
                    </Badge>
                    <div className={`font-semibold ${transaction.type === 'income' ? 'text-budget-success' : ''}`}>
                      {transaction.type === 'income' ? '+' : ''}{formatAmount(Math.abs(transaction.amount))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>

      {selectedTransaction && (
        <TransactionPopup
          transaction={selectedTransaction}
          open={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </Card>
  );
}
