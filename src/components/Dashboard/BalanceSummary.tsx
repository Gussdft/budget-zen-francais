
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

export function BalanceSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Solde actuel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold">1 250,00 €</div>
              <p className="text-xs text-muted-foreground mt-1">
                Mis à jour le 29/04/2025
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in [animation-delay:100ms]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Revenus du mois
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold">2 500,00 €</div>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="h-4 w-4 text-budget-success mr-1" />
                <span className="text-xs text-budget-success">+5% vs mois dernier</span>
              </div>
            </div>
            <div className="bg-budget-success/10 p-3 rounded-full">
              <ArrowUpRight className="h-6 w-6 text-budget-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in [animation-delay:200ms]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Dépenses du mois
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold">1 850,00 €</div>
              <div className="flex items-center mt-1">
                <ArrowDownRight className="h-4 w-4 text-budget-danger mr-1" />
                <span className="text-xs text-budget-danger">+12% vs mois dernier</span>
              </div>
            </div>
            <div className="bg-budget-danger/10 p-3 rounded-full">
              <ArrowDownRight className="h-6 w-6 text-budget-danger" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
