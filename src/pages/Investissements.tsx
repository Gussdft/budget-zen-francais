
import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { InvestmentsList } from "@/components/Investments/InvestmentsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface Investment {
  id: string;
  name: string;
  type: string;
  amount: number;
}

const Investissements = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Sample data
  const investmentsData: Investment[] = [
    { id: "1", name: "Tesla", type: "Stock", amount: 5000 },
    { id: "2", name: "Bitcoin", type: "Crypto", amount: 3000 },
    { id: "3", name: "Real Estate Fund", type: "REIT", amount: 10000 },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold">Investissements</h1>
        
        <Card>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="stocks">Actions</TabsTrigger>
                <TabsTrigger value="crypto">Crypto</TabsTrigger>
                <TabsTrigger value="real-estate">Immobilier</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">Tous les investissements</h2>
                  <InvestmentsList />
                </div>
              </TabsContent>
              
              <TabsContent value="stocks">
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">Investissements en actions</h2>
                  <p>Affichage des investissements en actions uniquement.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="crypto">
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">Investissements en cryptomonnaies</h2>
                  <p>Affichage des investissements en cryptomonnaies uniquement.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="real-estate">
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">Investissements immobiliers</h2>
                  <p>Affichage des investissements immobiliers uniquement.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Investissements;
