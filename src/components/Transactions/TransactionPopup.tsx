
import { useState } from "react";
import { Transaction, useTransactions } from "@/hooks/use-transactions";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { TransactionForm } from "./TransactionForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Calendar, 
  ShoppingCart, 
  Home, 
  ArrowUpRight, 
  ArrowDownRight,
  CreditCard,
  Coffee,
  Bus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  CircleMinus,
  CirclePlus,
  PiggyBank,
  Briefcase,
  Settings,
  Plus,
  Minus,
  Edit,
  Tags
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TransactionPopupProps {
  transaction: Transaction;
  open: boolean;
  onClose: () => void;
}

export function TransactionPopup({ transaction, open, onClose }: TransactionPopupProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { getCategoryName } = useCategories();
  const { deleteTransaction } = useTransactions();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    onClose();
  };

  // List of all available icons by category name mapping
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
    "Autres": Tags,
    "default": CreditCard
  };

  // Get the icon for the category or default
  const getCategoryIcon = (categoryId: string) => {
    const category = getCategoryName(categoryId);
    return categoryIcons[category] || categoryIcons["default"];
  };

  const TransactionIcon = transaction.type === 'income' ? ArrowUpRight : ArrowDownRight;
  const CategoryIcon = getCategoryIcon(transaction.categoryId);

  if (isEditing) {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-md">
          <TransactionForm 
            transactionId={transaction.id} 
            onClose={() => {
              setIsEditing(false);
              onClose();
            }} 
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className={`p-1.5 rounded-full ${transaction.type === 'income' ? 'bg-green-100/80 dark:bg-green-900/30' : 'bg-red-100/80 dark:bg-red-900/30'}`}>
              <TransactionIcon className={`h-4 w-4 ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
            </span>
            {transaction.description}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <CategoryIcon className="h-4 w-4 text-muted-foreground" />
            <span>{getCategoryName(transaction.categoryId)}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Date :</span>
            </div>
            <span>{formatDate(transaction.date)}</span>
          </div>
          
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Montant :</span>
            </div>
            <span className={transaction.type === 'income' ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
              {transaction.type === 'income' ? '+' : '-'} {formatAmount(transaction.amount)}
            </span>
          </div>
          
          <div className="border-t pt-4 mt-2">
            <div className="font-medium mb-1">Description :</div>
            <p className="text-sm text-muted-foreground break-words">
              {transaction.description || "Pas de description"}
            </p>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <div className="flex w-full flex-col-reverse sm:flex-row sm:justify-between">
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
            <div className="flex gap-2 mb-2 sm:mb-0">
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
              <Button variant="default" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" /> Modifier
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
