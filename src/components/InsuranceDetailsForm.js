"use client";

import { useEffect, useState } from "react";
import {
  HomeInsuranceForm,
  VehicleInsuranceForm,
  LifeInsuranceForm,
} from "./purchase";
import { Loader2 } from "lucide-react";

export default function InsuranceDetailsForm({ userPolicyId }) {
  const [policyType, setPolicyType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener tipo de póliza desde la base de datos
  useEffect(() => {
    const fetchPolicyType = async () => {
      try {
        const res = await fetch(`/api/user_policies/${userPolicyId}`);
        const data = await res.json();

        if (!res.ok)
          throw new Error(data.error || "Error obteniendo tipo de póliza");

        const type = data[0].category?.toLowerCase();
        if (!["hogar", "vehiculo", "vida"].includes(type)) {
          throw new Error(
            `Tipo de póliza desconocido: ${data.policy.category}`,
          );
        }

        setPolicyType(type);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyType();
  }, [userPolicyId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-48 text-gray-500">
        <Loader2 className="animate-spin mr-2 h-5 w-5" />
        Cargando información de la póliza...
      </div>
    );

  if (error)
    return (
      <p className="text-red-600 text-center font-medium">Error: {error}</p>
    );

  return (
    <div className="p-6 bg-white border rounded-xl shadow-sm">
      {policyType === "hogar" && (
        <HomeInsuranceForm userPolicyId={userPolicyId} />
      )}
      {(policyType === "vehículo" || policyType === "vehiculo") && (
        <VehicleInsuranceForm userPolicyId={userPolicyId} />
      )}
      {policyType === "vida" && (
        <LifeInsuranceForm userPolicyId={userPolicyId} />
      )}

      {!["hogar", "vehículo", "vehiculo", "vida"].includes(policyType) && (
        <p className="text-gray-600 text-center">
          No se encontró un formulario asociado a este tipo de póliza.
        </p>
      )}
    </div>
  );
}
