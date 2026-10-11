import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-7 w-7 text-destructive" />
            <h1 className="text-2xl font-bold">Page introuvable</h1>
          </div>
          <Link href="/" className="text-sm text-primary hover:underline">Retour à l'accueil</Link>
        </CardContent>
      </Card>
    </div>
  );
}
