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
      handleContratarPoliza();
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
      const res = await fetch("/api/vehicle_insurances", {
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

export function LifeInsuranceForm({ userPolicyId }) {
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
      const res = await fetch("/api/life_insurances", {
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
