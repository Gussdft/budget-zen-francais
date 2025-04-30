
import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { BudgetsList } from "@/components/Budgets/BudgetsList";
import { BudgetForm } from "@/components/Budgets/BudgetFormWrapper";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart3, LineChart, TrendingUp } from "lucide-react";
import { useBudgets } from "@/hooks/use-budgets";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart as RechartsLineChart,
  Line
} from "recharts";

const Budgets = () => {
  const [showForm, setShowForm] = useState(false);
  const { budgets, isLoading, calculateBudgetProgress } = useBudgets();
  const [activeTab, setActiveTab] = useState("liste");

  // Données pour les graphiques
  const budgetsData = budgets.map(budget => {
    const progress = calculateBudgetProgress(budget.id);
    return {
      name: budget.name,
      prévu: budget.amount,
      dépensé: progress.spent,
      restant: progress.remaining,
      pourcentage: progress.percentage
    };
  });

  // Trier les budgets par pourcentage d'utilisation pour la vue "Tendance"
  const sortedBudgets = [...budgetsData].sort((a, b) => b.pourcentage - a.pourcentage);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Budgets & Projets</h1>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <PlusCircle className="h-5 w-5" /> Nouveau budget
          </Button>
        </div>
        
        <Tabs defaultValue="liste" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="liste">Liste</TabsTrigger>
              <TabsTrigger value="graphique">Graphique</TabsTrigger>
              <TabsTrigger value="tendances">Tendances</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="liste" className="space-y-4">
            {showForm && (
              <BudgetForm onClose={() => setShowForm(false)} />
            )}
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-pulse">Chargement des budgets...</div>
              </div>
            ) : (
              <BudgetsList budgets={budgets} />
            )}
          </TabsContent>
          
          <TabsContent value="graphique">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Répartition des budgets
                </CardTitle>
                <CardDescription>
                  Visualisation des montants prévus et dépensés pour chaque budget
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={budgetsData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 80,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value} €`} />
                      <Legend />
                      <Bar dataKey="prévu" fill="#9b87f5" name="Budget prévu" />
                      <Bar dataKey="dépensé" fill="#FC8181" name="Dépensé" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tendances">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Tendances de consommation
                </CardTitle>
                <CardDescription>
                  Analyse de l'utilisation de vos budgets (pourcentage consommé)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={sortedBudgets}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 80,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis domain={[0, 100]} unit="%" />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="pourcentage" 
                        stroke="#9b87f5" 
                        name="Pourcentage utilisé" 
                        strokeWidth={2}
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                      {/* Ligne représentant 100% */}
                      <Line 
                        type="monotone" 
                        data={[{name: sortedBudgets[0]?.name, plan: 100}, {name: sortedBudgets[sortedBudgets.length - 1]?.name, plan: 100}]}
                        dataKey="plan"
                        stroke="#FC8181"
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        name="Budget max (100%)"
                        dot={false}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Budgets;
