"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function HomeInsuranceForm({ userPolicyId, handleContratarPoliza }) {
  const [form, setForm] = useState({
    user_policy_id: userPolicyId || "",
    direccion_vivienda: "",
    tipo_vivienda: "Casa",
    superficie_m2: "",
    anio_construccion: "",
    valor_estimado: "",
    posee_alarma: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/home_insurances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Error al registrar seguro de hogar");
      alert("Seguro de hogar registrado correctamente");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Seguro de Vivienda</h3>
      <div className="flex flex-col space-y-3 mt-6">
        <input
          name="direccion_vivienda"
          required
          placeholder="Dirección de la vivienda"
          value={form.direccion_vivienda}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        />
        <select
          name="tipo_vivienda"
          value={form.tipo_vivienda}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        >
          <option value="Casa">Casa</option>
          <option value="Departamento">Departamento</option>
          <option value="Dúplex">Dúplex</option>
          <option value="Otro">Otro</option>
        </select>
        <input
          name="superficie_m2"
          type="number"
          placeholder="Superficie (m²)"
          value={form.superficie_m2}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        />
        <input
          name="anio_construccion"
          type="number"
          placeholder="Año de construcción"
          value={form.anio_construccion}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        />
        <input
          name="valor_estimado"
          type="number"
          placeholder="Valor estimado ($)"
          value={form.valor_estimado}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        />
        <label className="flex items-center gap-2">
          <input
            name="posee_alarma"
            type="checkbox"
            checked={form.posee_alarma}
            onChange={handleChange}
          />
          Posee alarma
        </label>
      </div>
      <Button type="submit" className="w-full bg-black text-white">
        Guardar Seguro
      </Button>
    </form>
  );
}

export function VehicleInsuranceForm({ userPolicyId }) {
  const [form, setForm] = useState({
    user_policy_id: userPolicyId || "",
    marca: "",
    modelo: "",
    anio: "",
    patente: "",
    numero_chasis: "",
    numero_motor: "",
    uso: "Particular",
  });

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/vehicle_insurances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Error al registrar seguro de vehículo");
      alert("Seguro de vehículo registrado correctamente");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Seguro de Vehículo</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <input
          name="marca"
          required
          placeholder="Marca"
          value={form.marca}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        />
        <input
          name="modelo"
          required
          placeholder="Modelo"
          value={form.modelo}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        />
        <input
          name="anio"
          required
          type="number"
          placeholder="Año"
          value={form.anio}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        />
        <input
          name="patente"
          required
          placeholder="Patente"
          value={form.patente}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        />
        <input
          name="numero_chasis"
          placeholder="Número de chasis"
          value={form.numero_chasis}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        />
        <input
          name="numero_motor"
          placeholder="Número de motor"
          value={form.numero_motor}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        />
        <select
          name="uso"
          value={form.uso}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        >
          <option value="Particular">Particular</option>
          <option value="Comercial">Comercial</option>
        </select>
      </div>
      <Button type="submit" className="w-full bg-black text-white">
        Guardar Seguro
      </Button>
    </form>
  );
}

export function LifeInsuranceForm({ userPolicyId }) {
  const [form, setForm] = useState({
    user_policy_id: userPolicyId || "",
    nombre_asegurado: "",
    apellido_asegurado: "",
    fecha_nacimiento: "",
    ocupacion: "",
    monto_asegurado: "",
    beneficiario: "",
    relacion_beneficiario: "",
  });

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/life_insurances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Error al registrar seguro de vida");
      alert("Seguro de vida registrado correctamente");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Seguro de Vida</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <input
          name="nombre_asegurado"
          required
          placeholder="Nombre del asegurado"
          value={form.nombre_asegurado}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        />
        <input
          name="apellido_asegurado"
          required
          placeholder="Apellido del asegurado"
          value={form.apellido_asegurado}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        />
        <input
          name="fecha_nacimiento"
          type="date"
          required
          value={form.fecha_nacimiento}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        />
        <input
          name="ocupacion"
          placeholder="Ocupación"
          value={form.ocupacion}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        />
        <input
          name="monto_asegurado"
          required
          type="number"
          placeholder="Monto asegurado ($)"
          value={form.monto_asegurado}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        />
        <input
          name="beneficiario"
          placeholder="Beneficiario"
          value={form.beneficiario}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        />
        <input
          name="relacion_beneficiario"
          placeholder="Relación con beneficiario"
          value={form.relacion_beneficiario}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        />
      </div>
      <Button type="submit" className="w-full bg-black text-white">
        Guardar Seguro
      </Button>
    </form>
  );
}
