
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
  CreditCard
} from "lucide-react";

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
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    onClose();
  };

  // Par défaut, afficher l'icône CreditCard
  const DefaultIcon = CreditCard;
  const TransactionIcon = transaction.type === 'income' ? ArrowUpRight : ArrowDownRight;

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
            <span className={`p-1 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
              <TransactionIcon className={`h-4 w-4 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`} />
            </span>
            {transaction.description}
          </DialogTitle>
          <DialogDescription>
            {getCategoryName(transaction.categoryId)}
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
            <span className={transaction.type === 'income' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
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
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button variant="default" onClick={() => setIsEditing(true)}>
            Modifier
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
