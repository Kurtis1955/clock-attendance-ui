"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SessionExpiredModal({
  isOpen,
  onClose,
}: SessionExpiredModalProps) {
  const pathname = usePathname();
  const [isSigningIn, setIsSigningIn] = React.useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      // Clear the current session
      await signOut({ redirect: false });
      
      // Store the current path for redirect after login
      const callbackUrl = `${pathname}${window.location.search}`;
      
      // Redirect to Keycloak login with callback URL
      await signIn("keycloak", { callbackUrl });
    } catch (error) {
      console.error("Error during sign in:", error);
      setIsSigningIn(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={false}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-expired-title"
        aria-describedby="session-expired-description"
      >
        <DialogHeader>
          <DialogTitle id="session-expired-title" className="text-lg">
            Your session has expired
          </DialogTitle>
          <DialogDescription id="session-expired-description" className="text-sm">
            Please sign in again to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSigningIn}
            className="w-full sm:w-auto text-black text-xs"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="w-full sm:w-auto bg-yellow-400 text-black text-xs hover:bg-yellow-500"
          >
            {isSigningIn ? "Signing in..." : "Sign In"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
