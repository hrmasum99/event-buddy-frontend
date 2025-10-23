import { Suspense } from "react";
import ProtectedRoute from "@/components/ui/layouts/ProtectedRoute";
import { Loader2 } from "lucide-react";
import PaymentFail from "@/components/ui/layouts/PaymentFail";

export default function PaymentFailPage() {
  return (
    <ProtectedRoute requiredRole="user">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-red-600" />
          </div>
        }
      >
        <PaymentFail />
      </Suspense>
    </ProtectedRoute>
  );
}
