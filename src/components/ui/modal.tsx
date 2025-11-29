import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../utils/cn"
import { Button } from "./button"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    description?: string
    children: React.ReactNode
    className?: string
}

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    className,
}: ModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in-0 p-4">
            <div
                className={cn(
                    "relative w-full max-w-4xl max-h-[90vh] flex flex-col gap-4 border bg-background shadow-lg duration-200 sm:rounded-lg animate-in zoom-in-95 slide-in-from-bottom-10",
                    className
                )}
            >
                {/* Header - Fixed */}
                <div className="flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-0">
                    <h2 className="text-lg font-semibold leading-none tracking-tight">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
                    onClick={onClose}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </Button>

                {/* Content - Scrollable */}
                <div className="overflow-y-auto px-6 pb-6">
                    {children}
                </div>
            </div>
        </div>
    )
}
