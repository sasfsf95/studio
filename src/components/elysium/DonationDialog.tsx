
"use client";

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
import { Heart, CheckCircle2 } from "lucide-react";

export function DonationDialog({
  children,
  open,
  onOpenChange,
}: {
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const handleDonateClick = () => {
    window.open('https://www.upilinks.in/payment-link/upi621761487', '_blank', 'noopener,noreferrer');
  };

  const handleDialogClose = (isOpen: boolean) => {
      onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px] liquid-glass-modal border border-white/20 text-white rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Heart className="text-pink-500" />
            Support Girl.ai Development
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
            Click here to Donate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
