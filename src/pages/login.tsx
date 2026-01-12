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
import { Ticket, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="flex justify-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/30">
            <Ticket className="h-8 w-8 text-white" strokeWidth={2} />
          </div>
          <span className="ml-3 self-center text-2xl font-semibold">Eventify</span>
        </div>

        {/* CARD */}
        <Card className="rounded-2xl shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to discover and book amazing events
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-5">
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
                  <a
                    href="#"
                    className="text-sm text-emerald-500 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input type="password" className="pl-9" />
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-full">
                Sign In
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="flex items-center w-full gap-3">
              <div className="h-px w-full bg-border" />
              <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">OR CONTINUE WITH</span>
              <div className="h-px w-full bg-border" />
            </div>

            <Button variant="outline" className="w-full rounded-full">
              Continue with Google
            </Button>

            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a href="#" className="text-emerald-500 hover:underline">
                Sign up
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
