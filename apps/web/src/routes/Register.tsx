import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { trpc } from "@/trpc/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type RegisterForm = z.infer<
  typeof registerSchema
>;

export default function RegisterPage() {
  const navigate = useNavigate();

  const registerMutation =
    trpc.auth.registerUser.useMutation({
      onSuccess() {
        navigate("/login");
      },
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(
      registerSchema
    ),
  });

  async function onSubmit(
    values: RegisterForm
  ) {
    await registerMutation.mutateAsync(
      values
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>
            Register
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <Label>
                Email
              </Label>

              <Input
                {...register("email")}
              />

              {errors.email && (
                <p>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label>
                Password
              </Label>

              <Input
                type="password"
                {...register("password")}
              />

              {errors.password && (
                <p>
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={
                registerMutation.isPending
              }
            >
              {registerMutation.isPending
                ? "Loading..."
                : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}