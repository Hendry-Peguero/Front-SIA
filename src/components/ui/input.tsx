import * as React from "react"
import { cn } from "../../utils/cn"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    /**
     * Si es true, fuerza teclado numérico en móviles
     * Se aplica automáticamente cuando type="number"
     */
    numeric?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, numeric, ...props }, ref) => {
        // Auto-activar teclado numérico si type="number" o numeric=true
        const isNumeric = type === 'number' || numeric;

        return (
            <input
                type={type}
                // Forzar teclado numérico en móviles
                inputMode={isNumeric ? "numeric" : undefined}
                pattern={isNumeric ? "[0-9]*" : undefined}
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }

