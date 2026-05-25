import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createFormSchema,
  type CreateFormActualInputType,
} from "@repo/shared";

import { trpc } from "@/trpc/client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import {Plus}from "lucide-react";

// ─── Modal Primitive ──────────────────────────────────────────────────────────

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function Modal({ open, onClose, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {children}
    </div>
  );
}

// ─── Error Message ────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-red-500">{message}</p>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CreateFormDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const createFormMutation = trpc.form.createForm.useMutation({
    onSuccess(form) {
      if (!form) return;
      navigate(`/forms/${form.id}/edit`);
    },
  });

  const form = useForm<CreateFormActualInputType>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      title: "",
      description: "",
      slug: "",
      visibility: "public",
      expiresAt: undefined,
      settings: {
        notifyCreator: false,
        allowEmailReceipt: false,
        oneResponsePerRespondent: false,
        thankYouMessage: "",
      },
    },
  });

  const errors = form.formState.errors;

  const inputError = (hasError: boolean) =>
    hasError ? "border-red-500 focus-visible:ring-red-500" : "";

  const onSubmit = async (values: CreateFormActualInputType) => {
    await createFormMutation.mutateAsync(values);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        New Form
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div
          className="relative w-full max-w-5xl rounded-2xl bg-background shadow-2xl border"
          style={{ maxHeight: "calc(100vh - 3rem)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4 shrink-0">
            <h2 className="text-xl font-semibold">Create Form</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 3rem - 65px)" }}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-6 p-6 lg:grid-cols-[1fr_280px]"
            >
              {/* ── Main Content ── */}
              <div className="space-y-6">

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Customer Feedback"
                    className={inputError(!!errors.title)}
                    {...form.register("title")}
                  />
                  <FieldError message={errors.title?.message} />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Optional short description..."
                    className={`min-h-[110px] resize-none ${inputError(!!errors.description)}`}
                    {...form.register("description")}
                  />
                  <FieldError message={errors.description?.message} />
                </div>

                {/* Slug + Visibility */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                        id="slug"
                        placeholder="customer-feedback"
                        className={inputError(!!errors.slug)}
                        {...form.register("slug", {
                            setValueAs: (v) => (v === "" ? undefined : v),
                        })}
                    />
                    <FieldError message={errors.slug?.message} />
                  </div>

                  <div className="space-y-2">
                    <Label>Visibility</Label>
                    <Controller
                      control={form.control}
                      name="visibility"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className={inputError(!!errors.visibility)}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="unlisted">Unlisted</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError message={errors.visibility?.message} />
                  </div>
                </div>

                {/* Expiration */}
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Expiration Date</Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    className={inputError(!!errors.expiresAt)}
                    {...form.register("expiresAt", {
                      setValueAs: (v) => (v ? new Date(v) : undefined),
                    })}
                  />
                  <FieldError message={errors.expiresAt?.message} />
                </div>

                {/* Thank You */}
                <div className="space-y-2">
                  <Label htmlFor="thankYouMessage">Thank You Message</Label>
                  <Textarea
                    id="thankYouMessage"
                    placeholder="Thanks for submitting..."
                    className={`min-h-[110px] resize-none ${inputError(!!errors.settings?.thankYouMessage)}`}
                    {...form.register("settings.thankYouMessage")}
                  />
                  <FieldError message={errors.settings?.thankYouMessage?.message} />
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t pt-5">
                  <Button type="submit" disabled={createFormMutation.isPending}>
                    {createFormMutation.isPending ? "Creating..." : "Create Form"}
                  </Button>
                </div>
              </div>

              {/* ── Sidebar ── */}
              <div className="h-fit space-y-4 rounded-2xl border bg-muted/30 p-5">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">Settings</h3>
                  <p className="text-xs text-muted-foreground">
                    Configure form behavior.
                  </p>
                </div>

                <div className="space-y-3">
                  <SettingCheckbox
                    label="Notify creator"
                    checked={form.watch("settings.notifyCreator") ?? false}
                    onCheckedChange={(checked) =>
                      form.setValue("settings.notifyCreator", checked)
                    }
                  />
                  <SettingCheckbox
                    label="Email receipt"
                    checked={form.watch("settings.allowEmailReceipt") ?? false}
                    onCheckedChange={(checked) =>
                      form.setValue("settings.allowEmailReceipt", checked)
                    }
                  />
                  <SettingCheckbox
                    label="One response only"
                    checked={form.watch("settings.oneResponsePerRespondent") ?? false}
                    onCheckedChange={(checked) =>
                      form.setValue("settings.oneResponsePerRespondent", checked)
                    }
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}

// ─── SettingCheckbox ──────────────────────────────────────────────────────────

type SettingCheckboxProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function SettingCheckbox({ label, checked, onCheckedChange }: SettingCheckboxProps) {
  return (
    <label className="flex items-center gap-3 rounded-xl border bg-background px-3 py-3 transition-colors hover:bg-muted cursor-pointer">
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(Boolean(value))}
      />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}





// import { useNavigate } from "react-router-dom";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import {
//   createFormSchema,
//   type CreateFormActualInputType,
// } from "@repo/shared";

// import { trpc } from "@/trpc/client";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";

// export function CreateFormDialog() {
//   const navigate = useNavigate();

//   const createFormMutation = trpc.form.createForm.useMutation({
//     onSuccess(form) {
//       if (!form) return;

//       navigate(`/forms/${form.id}/edit`);
//     },
//   });

//   const form = useForm<CreateFormActualInputType>({
//     resolver: zodResolver(createFormSchema),

//     defaultValues: {
//       title: "",
//       description: "",
//       slug: "",
//       visibility: "public",
//       expiresAt: undefined,

//       settings: {
//         notifyCreator: false,
//         allowEmailReceipt: false,
//         oneResponsePerRespondent: false,
//         thankYouMessage: "",
//       },
//     },
//   });

//   const onSubmit = async (values: CreateFormActualInputType) => {
//     await createFormMutation.mutateAsync(values);
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button size="sm">New Form</Button>
//       </DialogTrigger>

//       <DialogContent className="max-w-xl rounded-2xl border-0 p-0 overflow-hidden">
//         <DialogHeader className="border-b bg-muted/40 px-6 py-4">
//           <DialogTitle className="text-xl font-semibold">
//             Create Form
//           </DialogTitle>
//         </DialogHeader>

//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="max-h-[85vh] space-y-6 overflow-y-auto p-6"
//         >
//           {/* Basic */}
//           <Card className="space-y-5 rounded-xl border p-5 shadow-sm">
//             <div className="space-y-1">
//               <h3 className="text-sm font-semibold tracking-tight">
//                 Basic Details
//               </h3>

//               <p className="text-sm text-muted-foreground">
//                 Configure your form information.
//               </p>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="title">
//                 Title <span className="text-red-500">*</span>
//               </Label>

//               <Input
//                 id="title"
//                 placeholder="Customer Survey"
//                 {...form.register("title")}
//               />

//               {form.formState.errors.title && (
//                 <p className="text-sm text-red-500">
//                   {form.formState.errors.title.message}
//                 </p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="description">Description</Label>

//               <Textarea
//                 id="description"
//                 placeholder="Short description..."
//                 className="min-h-[100px] resize-none"
//                 {...form.register("description")}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="slug">Slug</Label>

//               <Input
//                 id="slug"
//                 placeholder="customer-survey"
//                 {...form.register("slug")}
//               />
//             </div>

//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="space-y-2">
//                 <Label>Visibility</Label>

//                 <Controller
//                   control={form.control}
//                   name="visibility"
//                   render={({ field }) => (
//                     <Select
//                       value={field.value}
//                       onValueChange={field.onChange}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select visibility" />
//                       </SelectTrigger>

//                       <SelectContent>
//                         <SelectItem value="public">Public</SelectItem>

//                         <SelectItem value="unlisted">
//                           Unlisted
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="expiresAt">Expiration Date</Label>

//                 <Input
//                   id="expiresAt"
//                   type="datetime-local"
//                   {...form.register("expiresAt")}
//                 />
//               </div>
//             </div>
//           </Card>

//           {/* Settings */}
//           <Card className="space-y-5 rounded-xl border p-5 shadow-sm">
//             <div className="space-y-1">
//               <h3 className="text-sm font-semibold tracking-tight">
//                 Settings
//               </h3>

//               <p className="text-sm text-muted-foreground">
//                 Customize submission behavior.
//               </p>
//             </div>

//             <div className="space-y-4">
//               <SettingCheckbox
//                 label="Notify creator"
//                 checked={form.watch("settings.notifyCreator")?? false}
//                 onCheckedChange={(checked) =>
//                   form.setValue(
//                     "settings.notifyCreator",
//                     Boolean(checked)
//                   )
//                 }
//               />

//               <SettingCheckbox
//                 label="Allow email receipt"
//                 checked={form.watch("settings.allowEmailReceipt")?? false}
//                 onCheckedChange={(checked) =>
//                   form.setValue(
//                     "settings.allowEmailReceipt",
//                     Boolean(checked)
//                   )
//                 }
//               />

//               <SettingCheckbox
//                 label="One response per user"
//                 checked={form.watch(
//                   "settings.oneResponsePerRespondent"
//                 ) ?? false}
//                 onCheckedChange={(checked) =>
//                   form.setValue(
//                     "settings.oneResponsePerRespondent",
//                     Boolean(checked)
//                   )
//                 }
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="thankYouMessage">
//                 Thank You Message
//               </Label>

//               <Textarea
//                 id="thankYouMessage"
//                 placeholder="Thanks for submitting..."
//                 className="min-h-[100px] resize-none"
//                 {...form.register("settings.thankYouMessage")}
//               />
//             </div>
//           </Card>

//           <Button
//             type="submit"
//             className="h-11 w-full rounded-xl"
//             disabled={createFormMutation.isPending}
//           >
//             {createFormMutation.isPending
//               ? "Creating..."
//               : "Create Form"}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// type SettingCheckboxProps = {
//   label: string;
//   checked: boolean;
//   onCheckedChange: (checked: boolean) => void;
// };

// function SettingCheckbox({
//   label,
//   checked,
//   onCheckedChange,
// }: SettingCheckboxProps) {
//   return (
//     <label className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
//       <Checkbox
//         checked={checked}
//         onCheckedChange={onCheckedChange}
//       />

//       <span className="text-sm font-medium">{label}</span>
//     </label>
//   );
// }