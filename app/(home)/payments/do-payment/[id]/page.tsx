import PaymentForm from "@/components/forms/PaymentForm";
import ProtectedRoute from "@/components/ui/layouts/ProtectedRoute";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <ProtectedRoute requiredRole="user">
      <PaymentForm bookingId={id} />
    </ProtectedRoute>
  );
}
