
import { BalanceSummary } from "@/components/Dashboard/BalanceSummary";
import { BudgetProgress } from "@/components/Dashboard/BudgetProgress";
import { ExpensesChart } from "@/components/Dashboard/ExpensesChart";
import { RecentTransactions } from "@/components/Dashboard/RecentTransactions";
import { SavingsGoals } from "@/components/Dashboard/SavingsGoals";
import { QuickTransactionEntry } from "@/components/Dashboard/QuickTransactionEntry";
import { MainLayout } from "@/components/Layout/MainLayout";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold mb-6">Tableau de bord</h1>
        
        <BalanceSummary />
        
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 mb-4 border border-border">
          <h2 className="text-lg font-medium mb-2">Ajout rapide de transaction</h2>
          <QuickTransactionEntry />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ExpensesChart />
          <RecentTransactions />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BudgetProgress />
          <SavingsGoals />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
