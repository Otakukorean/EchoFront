import axios from "axios";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Shape of the unified API error body
// ---------------------------------------------------------------------------
interface ValidationError {
  propertyName: string;
  errorMessage: string;
  attemptedValue: unknown;
  customState: unknown;
  severity: number;
  errorCode: string;
  formattedMessagePlaceholderValues: Record<string, unknown>;
}

interface ApiErrorBody {
  title: string;
  status: number;
  detail: string;
  instance: string;
  traceId: string;
  ValidationErrors: ValidationError[] | null;
}

// ---------------------------------------------------------------------------
// handleApiError
//
// Parses the unified error format and fires a toast:
//   • ValidationErrors present → one toast per validation message
//   • No ValidationErrors      → toast with title + detail
// ---------------------------------------------------------------------------
export function handleApiError(error: unknown): void {
  if (!axios.isAxiosError(error)) {
    toast.error("An unexpected error occurred. Please try again.");
    return;
  }

  const body = error.response?.data as ApiErrorBody | undefined;

  if (!body) {
    // Network-level error (no response at all)
    toast.error(error.message ?? "Network error. Please check your connection.");
    return;
  }

  const { title, detail, ValidationErrors } = body;

  if (ValidationErrors && ValidationErrors.length > 0) {
    ValidationErrors.forEach(({ errorMessage }) => {
      toast.error(errorMessage);
    });
  } else {
    toast.error(title, {
      description: detail,
    });
  }
}
