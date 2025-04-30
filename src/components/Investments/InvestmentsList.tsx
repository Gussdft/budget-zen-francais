
import { useState } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { Investment, useInvestments } from "@/hooks/use-investments";
import { InvestmentForm } from "./InvestmentFormWrapper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface InvestmentsListProps {
  investments: Investment[];
}

export function InvestmentsList({ investments }: InvestmentsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const { deleteInvestment, getPerformanceData } = useInvestments();

  if (investments.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center">
        <p className="text-muted-foreground">Aucun investissement enregistré</p>
      </div>
    );
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'action': return 'Action';
      case 'crypto': return 'Crypto-monnaie';
      case 'immobilier': return 'Immobilier';
      case 'autre': return 'Autre';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-6">
      {editingId && (
        <InvestmentForm 
          investmentId={editingId} 
          onClose={() => setEditingId(null)} 
        />
      )}
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {investments.map((investment) => {
          const { profitLoss, profitLossPercentage, isProfit, performanceClass } = getPerformanceData(investment.id);
          
          return (
            <Card key={investment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{investment.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setEditingId(investment.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer l'investissement</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cet investissement ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteInvestment(investment.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {getTypeLabel(investment.type)}
                  {investment.quantity !== undefined && (
                    <span> • {investment.quantity} unités</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <span>Montant investi:</span>
                    <span className="font-medium">{formatAmount(investment.amount)}</span>
                    
                    <span>Date d'achat:</span>
                    <span>{formatDate(investment.purchaseDate)}</span>
                    
                    <span>Valeur actuelle:</span>
                    <span className="font-medium">{formatAmount(investment.currentValue)}</span>
                    
                    <span>Dernière mise à jour:</span>
                    <span>{formatDate(investment.lastUpdate)}</span>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center">
                      {isProfit ? (
                        <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span>Performance:</span>
                    </div>
                    <div className={`font-bold ${performanceClass}`}>
                      {isProfit ? '+' : ''}{formatAmount(profitLoss)} 
                      <span className="ml-1 text-xs">
                        ({isProfit ? '+' : ''}{profitLossPercentage.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  
                  {investment.notes && (
                    <div className="mt-2 pt-2 text-sm">
                      <p className="font-medium">Notes:</p>
                      <p className="text-muted-foreground">{investment.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
