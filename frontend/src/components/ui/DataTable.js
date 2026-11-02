'use client';

import Link from 'next/link';

export default function DataTable({
  columnas,
  filas,
  basePath,
  idKey = 'id',
  onEliminar,
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#e9e4f0] bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#f0e9ff] text-[#241a36]">
          <tr>
            {columnas.map((col) => (
              <th key={col.clave} className="px-4 py-3 font-semibold">
                {col.titulo}
              </th>
            ))}
            <th className="px-4 py-3 text-right font-semibold">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filas.map((fila) => (
            <tr key={fila[idKey]} className="border-t border-[#e9e4f0]">
              {columnas.map((col) => (
                <td key={col.clave} className="px-4 py-3 text-[#241a36]">
                  {col.render ? col.render(fila) : fila[col.clave]}
                </td>
              ))}

              <td className="px-4 py-3">
                <div className="flex justify-end gap-3">
                  <Link href={`${basePath}/${fila[idKey]}`} className="font-medium text-[#7138e8] hover:underline">
                    Ver
                  </Link>
                  <Link href={`${basePath}/${fila[idKey]}/editar`} className="font-medium text-[#7138e8] hover:underline">
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => onEliminar(fila)}
                    className="font-medium text-[#b42332] hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}