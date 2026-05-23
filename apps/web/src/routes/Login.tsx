import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { trpc } from "@/trpc/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { logInSchema, type LogInInputType, } from "@repo/shared";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// type RegisterForm = RegisterInputType

export default function LoginPage() {
    const navigate = useNavigate();
    const utils = trpc.useUtils()

    const loginMutation =
        trpc.auth.loginUser.useMutation({

            async onSuccess() {
                await utils.auth.getMe.invalidate();
                navigate("/dashboard" );
            },
        });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LogInInputType>({
        resolver: zodResolver(
            logInSchema
        ),
    });

    async function onSubmit(
        values: LogInInputType
    ) {
        await loginMutation.mutateAsync(
            values
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>
                        Login
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

                        {loginMutation.error && (
                            <p className="text-red-500 text-sm">
                                {loginMutation.error.message}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={
                                loginMutation.isPending
                            }
                        >
                            {loginMutation.isPending
                                ? "Loading..."
                                : "Login"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}