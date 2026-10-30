"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Lock } from "lucide-react";

export function LoginView() {
  const { setUser, setView } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth?action=login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error");
      }

      setUser(data);
      toast.success(`¡Hola, ${data.name}!`);
      setView("admin");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("admin@dulcehabana.cu");
    setPassword("admin123");
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 md:py-20">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--dh-green)]">
          <Lock className="h-6 w-6 text-white" />
        </div>
        <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-[var(--dh-green)]">
          Acceso staff
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Solo para administración de DULCE HABANA
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="email">Correo</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 text-muted-foreground"
            >
              {showPass ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full bg-[var(--dh-green)] hover:bg-[var(--dh-green-bright)]"
          disabled={loading}
        >
          {loading ? "Verificando..." : "Iniciar sesión"}
        </Button>
      </form>

      <div className="mt-6 rounded-lg border border-border bg-[var(--dh-cream)] p-4">
        <p className="text-xs text-muted-foreground">
          Acceso demo: <code className="font-mono">admin@dulcehabana.cu</code> / <code className="font-mono">admin123</code>
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3 w-full border-[var(--dh-green)] text-[var(--dh-green)]"
          onClick={fillDemo}
        >
          Rellenar credenciales demo
        </Button>
      </div>

      <button
        onClick={() => setView("home")}
        className="mt-6 text-center text-sm text-muted-foreground hover:text-foreground"
      >
        ← Volver a la tienda
      </button>
    </div>
  );
}
