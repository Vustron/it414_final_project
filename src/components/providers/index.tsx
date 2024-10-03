// components
import ProgressBarProvider from "@/components/providers/progress-bar"
import QueryProvider from "@/components/providers/query"
import ToastProvider from "@/components/providers/toast"
import { TooltipProvider } from "@/components/ui/tooltip"

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider disableHoverableContent>
      <QueryProvider>
        <ProgressBarProvider>
          <ToastProvider />
          {children}
        </ProgressBarProvider>
      </QueryProvider>
    </TooltipProvider>
  )
}

export default Providers
