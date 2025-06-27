
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Crown, Loader2, PartyPopper } from "lucide-react";

const formSchema = z.object({
  cardName: z.string().min(2, "Name is too short"),
  cardNumber: z.string().regex(/^\d{16}$/, "Invalid card number. Must be 16 digits."),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid format. Use MM/YY."),
  cvc: z.string().regex(/^\d{3,4}$/, "Invalid CVC. Must be 3 or 4 digits."),
});

export function PremiumDialog({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsOpen(false);
    form.reset();

    toast({
      title: "Welcome to Premium!",
      description: (
        <div className="flex items-center gap-2">
          <PartyPopper className="h-5 w-5 text-primary" />
          <span>You now have unlimited access. Enjoy!</span>
        </div>
      ),
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Crown className="text-yellow-400" />
            Become a Premium Member
          </DialogTitle>
          <DialogDescription>
            Unlock exclusive features and get unlimited access for just $5/month.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="cardName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name on Card</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="bg-input border-white/10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                       <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <Input placeholder="0000 0000 0000 0000" {...field} className="pl-10 bg-input border-white/10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
               <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input placeholder="MM/YY" {...field} className="bg-input border-white/10"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="cvc"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>CVC</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} className="bg-input border-white/10"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <DialogFooter className="pt-4">
              <Button type="submit" className="w-full font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:opacity-90" disabled={isSubmitting}>
                {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Crown className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? "Processing..." : "Subscribe for $5/month"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
