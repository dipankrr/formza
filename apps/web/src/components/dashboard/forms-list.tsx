import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Users,
  Globe,
  Clock3,
  Bell,
  Mail,
  ShieldCheck,
  FileEdit,
  BarChart3,
} from "lucide-react";

import { trpc } from "@/trpc/client";

export function FormsList() {
  const { data: forms, isLoading } =
    trpc.form.getAllFormsOfUser.useQuery();

  if (isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card
            key={i}
            className="h-[260px] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {forms?.map((form) => {
        const isExpired =
          form.expiresAt &&
          new Date(form.expiresAt) < new Date();

        return (
          <Card
            key={form.id}
            className="
              group
              overflow-hidden
              transition-all
              hover:-translate-y-1
              hover:shadow-lg
            "
          >
            <CardContent className="p-5">

              {/* top row */}
              <div className="mb-3 flex justify-between gap-2">

                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold">
                    {form.title}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {form.description}
                  </p>
                </div>

                <Badge
                  variant={
                    form.status === "draft"
                      ? "secondary"
                      : "default"
                  }
                >
                  {form.status}
                </Badge>

              </div>

              {/* metric */}
              <div className="mb-4 rounded-lg border bg-muted/40 p-3">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">
                      Responses
                    </span>
                  </div>

                  <span className="text-xl font-bold">
                    {form.submissionCount}
                  </span>

                </div>

              </div>

              {/* metadata */}
              <div className="mb-4 space-y-2 text-xs text-muted-foreground">

                <div className="flex justify-between">
                  <span>Slug</span>
                  <span>/{form.slug}</span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Visibility
                  </span>

                  <span>{form.visibility}</span>
                </div>

                <div className="flex justify-between">
                  <span>Created</span>

                  <span>
                    {new Date(
                      form.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Updated</span>

                  <span>
                    {new Date(
                      form.updatedAt
                    ).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">

                  <span className="flex items-center gap-1">
                    <Clock3 className="h-3 w-3" />
                    Expires
                  </span>

                  <span
                    className={
                      isExpired
                        ? "text-red-500 font-medium"
                        : ""
                    }
                  >
                    {form.expiresAt
                      ? new Date(
                          form.expiresAt
                        ).toLocaleDateString()
                      : "Never"
                    }
                  </span>

                </div>

              </div>

              {/* settings */}
              <div className="mb-4 flex flex-wrap gap-2">

                {form.settings.notifyCreator && (
                  <Badge variant="outline">
                    <Bell className="mr-1 h-3 w-3" />
                    Notify
                  </Badge>
                )}

                {form.settings.allowEmailReceipt && (
                  <Badge variant="outline">
                    <Mail className="mr-1 h-3 w-3" />
                    Receipt
                  </Badge>
                )}

                {form.settings.oneResponsePerRespondent && (
                  <Badge variant="outline">
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    One Response
                  </Badge>
                )}

              </div>

              {/* actions */}
              <div className="flex gap-2 border-t pt-4">

                <Button
                  className="flex-1"
                  size="sm"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Responses
                </Button>

                <Button
                  className="flex-1"
                  variant="outline"
                  size="sm"
                >
                  <FileEdit className="mr-2 h-4 w-4" />
                  Edit Fields
                </Button>

              </div>

            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}