
import { useState } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/Settings/ProfileSettings";
import { DisplaySettings } from "@/components/Settings/DisplaySettings";
import { DataSettings } from "@/components/Settings/DataSettings";

const Parametres = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold">Paramètres</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="display">Affichage</TabsTrigger>
            <TabsTrigger value="data">Données</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
          <TabsContent value="display">
            <DisplaySettings />
          </TabsContent>
          <TabsContent value="data">
            <DataSettings />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Parametres;
