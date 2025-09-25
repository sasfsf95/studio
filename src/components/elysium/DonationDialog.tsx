
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
import { Heart, CreditCard, CheckCircle2 } from "lucide-react";

export function DonationDialog({
  children,
  open,
  onOpenChange,
}: {
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [showQrCode, setShowQrCode] = useState(false);
  const { toast } = useToast();

  const handleDonateClick = async () => {
    setShowQrCode(true);
  };
  
  const handleDonationComplete = () => {
    toast({
        title: "Thank You! 💕",
        description: "Your donation helps us develop more amazing features!",
    });
    setShowQrCode(false);
    onOpenChange(false);
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
                        <Heart className="text-pink-500" />
                        Support Our Development
                    </DialogTitle>
                     <DialogDescription>
                        Scan the QR code with any UPI app to support us in developing more amazing features!
                     </DialogDescription>
                </DialogHeader>
                 <div className="flex flex-col items-center justify-center py-4">
                    <img
                        src="/payment/donation-qr.jpg"
                        alt="Donation QR code - Scan to support development"
                        width={300}
                        height={300}
                        data-ai-hint="QR code for donations"
                    />
                    <p className="text-sm text-gray-400 mt-2 text-center">
                        Your donation helps us develop more features and improve the experience
                    </p>
                 </div>
                <DialogFooter className="pt-0">
                    
                </DialogFooter>
            </>
        ) : (
            <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <Heart className="text-pink-500" />
                    Support Yuki AI Development
                  </DialogTitle>
                  <DialogDescription>
                    Help us build more amazing features and improve your AI companion experience.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <div className="text-center mb-4">
                    <Heart className="h-12 w-12 text-pink-500 mx-auto mb-2" />
                    <p className="text-lg font-semibold text-foreground">
                      Every donation helps us develop more!
                    </p>
                  </div>
                  
                  <ul className="space-y-3 text-sm text-foreground">
                      <li className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-pink-500" />
                          <span>Develop new AI models and personalities</span>
                      </li>
                      <li className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-pink-500" />
                          <span>Improve conversation quality and intelligence</span>
                      </li>
                      <li className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-pink-500" />
                          <span>Add more interactive features and customization</span>
                      </li>
                      <li className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-pink-500" />
                          <span>Keep the platform running smoothly</span>
                      </li>
                  </ul>
                </div>

                <DialogFooter className="pt-0">
                  <Button 
                    onClick={handleDonateClick} 
                    className="w-full font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700" 
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Donate to Support Development
                  </Button>
                </DialogFooter>
            </>
        )}
      </DialogContent>
    </Dialog>
  );
}
