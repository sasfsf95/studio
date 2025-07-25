
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
import { CreditCard, Crown, Loader2, CheckCircle2, PartyPopper } from "lucide-react";

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
  const [showQrCode, setShowQrCode] = useState(false);
  const { toast } = useToast();

  const handleSubscribeClick = async () => {
    setShowQrCode(true);
  };
  
  const handlePaymentComplete = () => {
    localStorage.setItem('isPremium', 'true');
    toast({
        title: "Welcome to Premium!",
        description: (
            <div className="flex items-center gap-2">
              <PartyPopper className="h-5 w-5 text-primary" />
              <span>You now have unlimited access. Enjoy!</span>
            </div>
        ),
    });
    setShowQrCode(false);
    onOpenChange(false);
    // Full reload to ensure premium state is recognized everywhere
    window.location.assign('/chat');
  }

  const handleDialogClose = (isOpen: boolean) => {
      if (!isOpen) {
          // Reset the view when the dialog is closed
          setTimeout(() => setShowQrCode(false), 300);
      }
      onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        {showQrCode ? (
            <>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <CreditCard className="text-primary" />
                        Scan to Pay
                    </DialogTitle>
                     <DialogDescription>
                        Use any UPI app to scan the QR code and complete your payment.
                     </DialogDescription>
                </DialogHeader>
                 <div className="flex flex-col items-center justify-center py-4">
                    <img
                        src="/payment/PAYMENTQR.jpg"
                        alt="Scan to pay with any UPI app"
                        width={300}
                        height={300}
                        data-ai-hint="QR code payment"
                    />
                 </div>
                <DialogFooter className="pt-0">
                    <Button 
                        onClick={handlePaymentComplete} 
                        className="w-full font-bold bg-green-600 text-white hover:bg-green-700"
                    >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        I have paid
                    </Button>
                </DialogFooter>
            </>
        ) : (
            <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <Crown className="text-yellow-400" />
                    Become a Premium Member
                  </DialogTitle>
                  <DialogDescription>
                    Unlock the full experience and get unlimited access to your AI companion.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-2">
                  <ul className="space-y-3 text-sm text-foreground">
                      <li className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                          <span>Unlimited Messages & Conversations</span>
                      </li>
                      <li className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                          <span>Change Companion's Photo Anytime</span>
                      </li>
                      <li className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                          <span>Unlock More Intimate Dialogue</span>
                      </li>
                      <li className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                          <span>Access All Premium Actions</span>
                      </li>
                  </ul>
                </div>

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
            </>
        )}
      </DialogContent>
    </Dialog>
  );
}
