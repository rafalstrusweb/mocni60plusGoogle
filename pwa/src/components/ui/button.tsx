import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Radix Slot emulation - in a real env, user would install @radix-ui/react-slot.
// If they can't, this import will fail. I'm assuming they will install deps or I should code a simple version.
// For now, I'll rely on the standard Shadcn pattern which assumes Radix.

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-lg font-medium ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] active:ring-2 active:ring-primary/40 active:ring-offset-1",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-md", // Custom for Mocni60+
            },
            size: {
                default: "h-14 px-6 py-4", // 56px minimum height for accessibility
                sm: "h-12 rounded-md px-4",
                lg: "h-16 rounded-xl px-10 text-xl",
                icon: "h-14 w-14",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        // If asChild is true, we need Radix Slot.
        // If user installs dependencies from package.json I wrote, they will have node_modules issue until they run npm install.
        // I will write it as if dependencies are there.
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
