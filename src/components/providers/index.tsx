// components
import ProgressBarProvider from "@/components/providers/progress-bar"
import ImagekitProvider from "@/components/providers/imagekit"
import { TooltipProvider } from "@/components/ui/tooltip"
import QueryProvider from "@/components/providers/query"
import ToastProvider from "@/components/providers/toast"

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider disableHoverableContent>
      <QueryProvider>
        <ProgressBarProvider>
          <ToastProvider />
          <ImagekitProvider>{children}</ImagekitProvider>
        </ProgressBarProvider>
      </QueryProvider>
    </TooltipProvider>
  )
}

export default Providers
