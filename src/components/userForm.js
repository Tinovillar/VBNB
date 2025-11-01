"use client";

import { Button } from "@/components/ui/button";

export function UserForm({
  form,
  onChange,
  onSubmit,
  isEdit = false,
  showRole = true, // opcional: ocultar el selector de rol en el perfil
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* DATOS DE ACCESO */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Datos de Acceso</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div />
          <div>
            <label className="block text-sm font-medium mb-1">
              {isEdit ? "Nueva Contraseña" : "Contraseña *"}
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder={
                isEdit
                  ? "Dejar vacío para mantener la actual"
                  : "Ingresá una contraseña"
              }
              required={!isEdit}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirmar Contraseña {isEdit ? "" : "*"}
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={onChange}
              required={!isEdit}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </section>

      {/* DATOS PERSONALES */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Datos Personales</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre *</label>
            <input
              name="nombre"
              required
              value={form.nombre}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Apellido *</label>
            <input
              name="apellido"
              required
              value={form.apellido}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tipo de Documento *
            </label>
            <select
              name="tipo_documento"
              value={form.tipo_documento}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="DNI">DNI</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Cédula">Cédula</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Número de Documento *
            </label>
            <input
              name="numero_documento"
              required
              value={form.numero_documento}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha de Nacimiento *
            </label>
            <input
              name="fecha_nacimiento"
              type="date"
              required
              value={form.fecha_nacimiento}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teléfono *</label>
            <input
              name="telefono"
              type="tel"
              required
              value={form.telefono}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </section>

      {/* DIRECCIÓN */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Dirección</h3>
        <div className="grid gap-4 md:grid-cols-1">
          <div>
            <label className="block text-sm font-medium mb-1">
              Calle y Número *
            </label>
            <input
              name="calle_numero"
              required
              value={form.calle_numero}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ciudad *</label>
            <input
              name="ciudad"
              required
              value={form.ciudad}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Provincia *
            </label>
            <input
              name="provincia"
              required
              value={form.provincia}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Código Postal *
            </label>
            <input
              name="codigo_postal"
              required
              value={form.codigo_postal}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </section>

      {/* ROL */}
      {showRole && (
        <section>
          <h3 className="text-lg font-semibold mb-3">Rol del Usuario</h3>
          <select
            name="rol_id"
            value={form.rol_id}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value={1}>Administrador</option>
            <option value={2}>Cliente</option>
            <option value={3}>Empleado</option>
          </select>
        </section>
      )}

      {/* BOTÓN */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          className="flex-1 bg-black text-white hover:bg-gray-800"
        >
          {isEdit ? "Guardar Cambios" : "Crear Usuario"}
        </Button>
      </div>
    </form>
  );
}
