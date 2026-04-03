'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => onOpenChange(false)}
      />
      {/* Content */}
      <div className="relative z-50 animate-scale-in">
        {children}
      </div>
    </div>
  )
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, size = 'md', children, ...props }, ref) => {
    const sizes = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full mx-4',
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full rounded-2xl bg-white shadow-2xl p-6 max-h-[90vh] overflow-y-auto",
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
DialogContent.displayName = "DialogContent"

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col space-y-2 mb-4", className)}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h2
    className={cn("text-2xl font-semibold text-neutral-900", className)}
    {...props}
  />
)
DialogTitle.displayName = "DialogTitle"

const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => (
  <p
    className={cn("text-sm text-neutral-600", className)}
    {...props}
  />
)
DialogDescription.displayName = "DialogDescription"

const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex items-center justify-end gap-3 mt-6", className)}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogClose: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...props
}) => (
  <button
    className={cn(
      "absolute right-4 top-4 rounded-lg p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors",
      className
    )}
    {...props}
  >
    <X className="h-5 w-5" />
  </button>
)
DialogClose.displayName = "DialogClose"

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
}
