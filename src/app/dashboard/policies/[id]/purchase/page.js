import InsuranceDetailsForm from "@/components/InsuranceDetailsForm";
import { Header } from "@/components/ui/header";

export default async function PolicyDetailsPage({ params }) {
  const { id } = await params; // user_policy_id

  return (
    <>
      <Header logged={true} hasLogin={false} />
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">
          Detalles de la Póliza de Usuario
        </h1>
        <InsuranceDetailsForm userPolicyId={id} />
      </div>
    </>
  );
}
