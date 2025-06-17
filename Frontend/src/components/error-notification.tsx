import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ErrorNotificationProps {
  errorMessage: string
}

const ErrorNotification = ({ errorMessage }: ErrorNotificationProps) => {
  return (
    <div className="container mx-auto p-4 max-w-md mt-10">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    </div>
  )
}

export default ErrorNotification

