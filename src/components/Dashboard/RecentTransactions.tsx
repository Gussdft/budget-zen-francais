
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Coffee, 
  ShoppingCart, 
  Home, 
  Bus,
  ArrowDownRight,
  ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Simulated transaction data
const transactions = [
  {
    id: 1,
    description: "Loyer Appartement",
    amount: -800,
    date: "2025-04-25",
    category: "Logement",
    icon: Home
  },
  {
    id: 2,
    description: "Carrefour",
    amount: -65.42,
    date: "2025-04-27",
    category: "Courses",
    icon: ShoppingCart
  },
  {
    id: 3,
    description: "Starbucks",
    amount: -4.50,
    date: "2025-04-28",
    category: "Restaurant",
    icon: Coffee
  },
  {
    id: 4,
    description: "Salaire",
    amount: 2500,
    date: "2025-04-28",
    category: "Revenus",
    icon: ArrowUpRight
  },
  {
    id: 5,
    description: "Navigo",
    amount: -75.20,
    date: "2025-04-29",
    category: "Transport",
    icon: Bus
  }
];

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
  return (
    <Card className="col-span-1 animate-fade-in [animation-delay:400ms]">
      <CardHeader className="pb-2">
        <CardTitle>Transactions récentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${transaction.amount >= 0 ? 'bg-budget-success/10' : 'bg-muted/80'}`}>
                  <transaction.icon className={`h-4 w-4 ${transaction.amount >= 0 ? 'text-budget-success' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(transaction.date)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant={transaction.amount >= 0 ? "outline" : "secondary"} className="hidden md:flex">
                  {transaction.category}
                </Badge>
                <div className={`font-semibold ${transaction.amount >= 0 ? 'text-budget-success' : ''}`}>
                  {transaction.amount >= 0 ? '+' : ''}{formatAmount(transaction.amount)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
