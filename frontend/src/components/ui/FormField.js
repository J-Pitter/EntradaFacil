export default function FormField({
  etiqueta,
  nombre,
  tipo = 'text',
  valor = '',
  onChange,
  ayuda,
  error,
  opciones,
  disabled = false,
  ...props
}) {
  const clases = `h-12 w-full rounded-boton border bg-white px-4 text-sm outline-none transition disabled:bg-borde disabled:text-texto-suave ${
    error
      ? 'border-peligro'
      : 'border-borde focus:border-primario focus:ring-2 focus:ring-primario/20'
  }`;

  return (
    <div>
      <label htmlFor={nombre} className="mb-2 block text-xs font-semibold">
        {etiqueta}
      </label>

      {tipo === 'select' ? (
        <select
          id={nombre}
          name={nombre}
          value={valor}
          onChange={onChange}
          disabled={disabled}
          className={clases}
          {...props}
        >
          <option value="">Selecciona una opción</option>
          {opciones?.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.texto}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={nombre}
          name={nombre}
          type={tipo}
          value={valor}
          onChange={onChange}
          disabled={disabled}
          className={clases}
          {...props}
        />
      )}

      {error ? (
        <p className="mt-1.5 text-xs text-peligro">{error}</p>
      ) : (
        ayuda && <p className="mt-1.5 text-xs text-texto-suave">{ayuda}</p>
      )}
    </div>
  );
}