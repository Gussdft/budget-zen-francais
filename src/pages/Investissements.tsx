
import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { InvestmentsList } from "@/components/Investments/InvestmentsList";
import { InvestmentForm } from "@/components/Investments/InvestmentFormWrapper";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp, PieChart, LineChart, Sparkles } from "lucide-react";
import { useInvestments } from "@/hooks/use-investments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  Legend,
  Tooltip,
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";

const COLORS = ["#4DC0B5", "#2C5282", "#68D391", "#F6AD55", "#FC8181", "#9F7AEA", "#ED64A6"];

const Investissements = () => {
  const [showForm, setShowForm] = useState(false);
  const { investments, isLoading } = useInvestments();
  const [activeTab, setActiveTab] = useState("liste");

  // Préparer les données pour le graphique en camembert
  const pieData = investments.map((investment, index) => ({
    name: investment.name,
    value: investment.amount,
    color: COLORS[index % COLORS.length]
  }));

  // Préparer les données pour le graphique d'évolution (simulé)
  const evolutionData = [
    { mois: 'Jan', valeur: 5000 },
    { mois: 'Fév', valeur: 5200 },
    { mois: 'Mars', valeur: 5150 },
    { mois: 'Avr', valeur: 5400 },
    { mois: 'Mai', valeur: 5650 },
    { mois: 'Juin', valeur: 5800 },
    { mois: 'Juil', valeur: 6000 },
    { mois: 'Août', valeur: 6200 },
    { mois: 'Sept', valeur: 6150 },
    { mois: 'Oct', valeur: 6300 },
    { mois: 'Nov', valeur: 6500 },
    { mois: 'Déc', valeur: 6700 }
  ];

  // Calculer le total des investissements
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const formattedTotal = totalInvestments.toLocaleString('fr-FR') + ' €';

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Investissements</h1>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            <PlusCircle className="h-5 w-5" /> Nouvel investissement
          </Button>
        </div>
        
        <Tabs defaultValue="liste" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="liste">Liste</TabsTrigger>
              <TabsTrigger value="repartition">Répartition</TabsTrigger>
              <TabsTrigger value="evolution">Évolution</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="liste" className="space-y-4">
            {showForm && (
              <InvestmentForm onClose={() => setShowForm(false)} />
            )}
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-pulse">Chargement des investissements...</div>
              </div>
            ) : (
              <InvestmentsList investments={investments} />
            )}
          </TabsContent>
          
          <TabsContent value="repartition">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Répartition des investissements
                </CardTitle>
                <CardDescription>
                  Visualisation de vos investissements par type d'actif
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="text-2xl font-bold mb-4">{formattedTotal}</div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toLocaleString('fr-FR')} €`} />
                      <Legend layout="vertical" align="right" verticalAlign="middle" />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="evolution">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Évolution de la valeur
                </CardTitle>
                <CardDescription>
                  Suivi de l'évolution de la valeur de vos investissements dans le temps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={evolutionData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value.toLocaleString('fr-FR')} €`} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="valeur" 
                        stroke="#9b87f5" 
                        strokeWidth={2}
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                        name="Valeur totale"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-muted rounded-md flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <span className="text-sm">Conseil: Diversifiez vos investissements pour optimiser le rapport risque/rendement.</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Investissements;
