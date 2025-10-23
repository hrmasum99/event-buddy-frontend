import PaymentForm from "@/components/forms/PaymentForm";
import ProtectedRoute from "@/components/ui/layouts/ProtectedRoute";

interface PageProps {
  params: {
    id: string;
  };
}

export default function PaymentPage({ params }: PageProps) {
  return (
    <ProtectedRoute requiredRole="user">
      <PaymentForm bookingId={params.id} />
    </ProtectedRoute>
  );
}
