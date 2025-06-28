
"use client";

import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Crown, Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/app/actions";

export function PremiumDialog({
  children,
  open,
  onOpenChange,
}: {
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribeClick = async () => {
    setIsSubmitting(true);
    try {
      const checkoutUrl = await createCheckoutSession();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast({
          variant: "destructive",
          title: "Setup Incomplete",
          description: "The payment system has not been configured by the site owner. Please fill in the .env file.",
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Stripe Checkout Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not connect to the payment gateway. Please try again later.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Crown className="text-yellow-400" />
            Become a Premium Member
          </DialogTitle>
          <DialogDescription>
            Unlock exclusive features and get unlimited access to your AI companion.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 text-center">
            <p className="text-4xl font-bold">$5</p>
            <p className="text-muted-foreground">per month</p>
        </div>

        <DialogFooter className="pt-0">
          <Button 
            onClick={handleSubscribeClick} 
            className="w-full font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:opacity-90" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <CreditCard className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "Redirecting..." : "Subscribe Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
