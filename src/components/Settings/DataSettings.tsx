
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertCircle, Download, Upload } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
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
} from "@/components/ui/alert-dialog";

export function DataSettings() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Fonction pour exporter toutes les données
  const exportData = async () => {
    setIsExporting(true);
    try {
      // Récupérer toutes les données
      const data = {
        transactions: JSON.parse(localStorage.getItem("transactions") || "[]"),
        categories: JSON.parse(localStorage.getItem("categories") || "[]"),
        budgets: JSON.parse(localStorage.getItem("budgets") || "[]"),
        investments: JSON.parse(localStorage.getItem("investments") || "[]"),
      };
      
      // Convertir en JSON
      const jsonData = JSON.stringify(data, null, 2);
      
      // Créer un objet Blob et un lien de téléchargement
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      // Configurer le lien et déclencher le téléchargement
      link.href = url;
      link.download = `budgetzen-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Données exportées avec succès");
    } catch (error) {
      console.error("Erreur lors de l'exportation:", error);
      toast.error("Erreur lors de l'exportation des données");
    } finally {
      setIsExporting(false);
    }
  };

  // Fonction pour importer des données
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Vérifier que le format des données est correct
        if (!importedData.transactions && !importedData.categories && 
            !importedData.budgets && !importedData.investments) {
          throw new Error("Format de fichier invalide");
        }
        
        // Importer les données dans le localStorage
        if (importedData.transactions) {
          localStorage.setItem("transactions", JSON.stringify(importedData.transactions));
        }
        if (importedData.categories) {
          localStorage.setItem("categories", JSON.stringify(importedData.categories));
        }
        if (importedData.budgets) {
          localStorage.setItem("budgets", JSON.stringify(importedData.budgets));
        }
        if (importedData.investments) {
          localStorage.setItem("investments", JSON.stringify(importedData.investments));
        }
        
        toast.success("Données importées avec succès. Veuillez rafraîchir la page.");
      } catch (error) {
        console.error("Erreur lors de l'importation:", error);
        toast.error("Erreur lors de l'importation des données");
      } finally {
        setIsImporting(false);
        // Réinitialiser la valeur du champ pour permettre de sélectionner à nouveau le même fichier
        event.target.value = "";
      }
    };
    
    reader.readAsText(file);
  };

  // Fonction pour effacer toutes les données
  const clearAllData = () => {
    try {
      localStorage.removeItem("transactions");
      localStorage.removeItem("categories");
      localStorage.removeItem("budgets");
      localStorage.removeItem("investments");
      
      toast.success("Toutes les données ont été effacées. Veuillez rafraîchir la page.");
    } catch (error) {
      toast.error("Erreur lors de la suppression des données");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des données</CardTitle>
        <CardDescription>
          Importez, exportez ou effacez vos données
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <Button 
            variant="outline" 
            onClick={exportData} 
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exportation..." : "Exporter toutes les données"}
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled={isImporting}
            onClick={() => document.getElementById("import-file")?.click()}
          >
            <Upload className="h-4 w-4" />
            {isImporting ? "Importation..." : "Importer des données"}
          </Button>
          <input
            id="import-file"
            type="file"
            accept="application/json"
            className="hidden"
            onChange={importData}
          />
        </div>

        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Zone dangereuse</AlertTitle>
          <AlertDescription>
            Les actions ci-dessous sont irréversibles et supprimeront définitivement vos données.
          </AlertDescription>
        </Alert>

        <div className="pt-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Effacer toutes les données</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action va supprimer définitivement toutes vos transactions, 
                  catégories, budgets et investissements. Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={clearAllData}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Supprimer toutes les données
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Nous vous recommandons d'exporter régulièrement vos données.
        </p>
      </CardFooter>
    </Card>
  );
}
