import { Suspense } from "react";
import ProtectedRoute from "@/components/ui/layouts/ProtectedRoute";
import { Loader2 } from "lucide-react";
import PaymentSuccess from "@/components/ui/layouts/PaymentSuccess";

export default function PaymentSuccessPage() {
  return (
    <ProtectedRoute requiredRole="user">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#4157FE]" />
          </div>
        }
      >
        <PaymentSuccess />
      </Suspense>
    </ProtectedRoute>
  );
}
