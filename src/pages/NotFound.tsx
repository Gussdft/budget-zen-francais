
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-budget-primary">404</h1>
        <p className="text-xl text-muted-foreground">
          Oups ! La page que vous recherchez n'existe pas.
        </p>
        <Button asChild>
          <Link to="/">Retourner à l'accueil</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
