import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { User, Users, Calendar, Mail, Lock, Ticket } from "lucide-react";

export default function RegisterPage() {
  const [role, setRole] = useState<"user" | "organizer" | null>(null);
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 py-8 px-4">
      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="flex justify-center mb-8 items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/30">
            <Ticket className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <span className="ml-3 text-2xl font-semibold">Eventify</span>
        </div>

        <Card className="rounded-2xl shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Join Eventify to discover or create amazing events
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-5">
              {/* ROLE */}
              <div className="space-y-2">
                <Label>I Want to</Label>
                <div className="grid grid-cols-2 gap-3">
                  {/* USER */}
                  <button
                    type="button"
                    onClick={() => setRole("user")}
                    className={`rounded-xl border p-4 text-center transition ${
                      role === "user"
                        ? "border-emerald-500 bg-emerald-50"
                        : "hover:border-emerald-300"
                    }`}
                  >
                    <Users className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
                    <span className="text-sm font-medium">Join as User</span>
                  </button>

                  {/* ORGANIZER */}
                  <button
                    type="button"
                    onClick={() => setRole("organizer")}
                    className={`rounded-xl border p-4 text-center transition ${
                      role === "organizer"
                        ? "border-emerald-500 bg-emerald-50"
                        : "hover:border-emerald-300"
                    }`}
                  >
                    <Calendar className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
                    <span className="text-sm font-medium">Event Organizer</span>
                  </button>
                </div>
              </div>

              {/* Nama */}
              <div className="space-y-2">
                <Label>Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="name"
                    placeholder="Your full name"
                    className="pl-9"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pl-9"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Password</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input type="password" className="pl-9" />
                </div>
              </div>

              {/* Password Confirm */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Confirm Password</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input type="password" className="pl-9" />
                </div>
              </div>

              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-full">
                Create Account
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="flex items-center w-full gap-3">
              <div className="h-px w-full bg-border" />
              <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                OR CONTINUE WITH
              </span>
              <div className="h-px w-full bg-border" />
            </div>

            <Button variant="outline" className="w-full rounded-full">
              Continue with Google
            </Button>

            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="#" className="text-emerald-500 hover:underline">
                Sign in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
