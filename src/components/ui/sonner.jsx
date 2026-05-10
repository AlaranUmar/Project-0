import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Sonner
      key={resolvedTheme}
      theme={resolvedTheme}
      richColors
      closeButton
      expand={true}
      position="top-right"
      visibleToasts={4}
      duration={4000}
      gap={12}
      offset={16}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-500" />,
        info: <InfoIcon className="size-4 text-blue-500" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-500" />,
        error: <OctagonXIcon className="size-4 text-red-500" />,
        loading: <Loader2Icon className="size-4 animate-spin text-primary" />,
      }}
      toastOptions={{
        classNames: {
          toast: `
            group toast
            bg-background/95
            text-foreground
            border border-border/60
            backdrop-blur-xl
            shadow-xl
            rounded-2xl
            px-4 py-3
            gap-3
            transition-all
          `,

          title: `
            text-sm
            font-semibold
            tracking-tight
          `,

          description: `
            text-sm
            text-muted-foreground
            leading-relaxed
          `,

          actionButton: `
            bg-primary
            text-primary-foreground
            hover:bg-primary/90
            rounded-lg
            px-3
            transition-colors
          `,

          cancelButton: `
            bg-muted
            text-muted-foreground
            hover:bg-muted/80
            rounded-lg
            px-3
            transition-colors
          `,

          closeButton: `
            bg-background
            border border-border
            hover:bg-muted
            transition-colors
          `,

          success: `
            border-emerald-500/20
            text-success
            `,

          error: `
            text-destructive
            border-red-500/20
            `,

          warning: `
            text-warning
            border-amber-500/20
            `,

          info: `
            text-primary
            border-blue-500/20
          `,
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
