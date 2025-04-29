
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function DisplaySettings() {
  const [theme, setTheme] = useState("light");
  const [currency, setCurrency] = useState("EUR");
  const [showCents, setShowCents] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  async function saveSettings() {
    setIsLoading(true);
    try {
      // Simuler l'enregistrement des paramètres
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem("displaySettings", JSON.stringify({
        theme,
        currency,
        showCents,
      }));
      toast.success("Paramètres d'affichage enregistrés");
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement des paramètres");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres d'affichage</CardTitle>
        <CardDescription>
          Personnalisez l'apparence de votre application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme">Thème</Label>
          <Select
            value={theme}
            onValueChange={setTheme}
          >
            <SelectTrigger id="theme">
              <SelectValue placeholder="Sélectionnez un thème" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Clair</SelectItem>
              <SelectItem value="dark">Sombre</SelectItem>
              <SelectItem value="system">Système</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Devise</Label>
          <Select
            value={currency}
            onValueChange={setCurrency}
          >
            <SelectTrigger id="currency">
              <SelectValue placeholder="Sélectionnez une devise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">Euro (€)</SelectItem>
              <SelectItem value="USD">Dollar américain ($)</SelectItem>
              <SelectItem value="GBP">Livre sterling (£)</SelectItem>
              <SelectItem value="CHF">Franc suisse (CHF)</SelectItem>
              <SelectItem value="CAD">Dollar canadien (CAD)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="show-cents">Afficher les centimes</Label>
            <p className="text-sm text-muted-foreground">
              Affiche les décimales dans les montants
            </p>
          </div>
          <Switch
            id="show-cents"
            checked={showCents}
            onCheckedChange={setShowCents}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={saveSettings} disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </CardFooter>
    </Card>
  );
}
