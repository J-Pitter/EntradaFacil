DROP TABLE IF EXISTS tipos_entrada     CASCADE;
DROP TABLE IF EXISTS eventos           CASCADE;
DROP TABLE IF EXISTS sedes             CASCADE;
DROP TABLE IF EXISTS categorias_evento CASCADE;
DROP TABLE IF EXISTS organizadores     CASCADE;
DROP TABLE IF EXISTS usuarios          CASCADE;

CREATE TABLE usuarios (
    id             INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    telefono       VARCHAR(20),
    fecha_registro TIMESTAMP    NOT NULL DEFAULT NOW(),
    estado         VARCHAR(20)  NOT NULL DEFAULT 'activo'
                   CHECK (estado IN ('activo', 'inactivo'))
);

CREATE TABLE organizadores (
    id             INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id     INT          NOT NULL UNIQUE
                   REFERENCES usuarios (id) ON DELETE CASCADE,
    nombre_empresa VARCHAR(150) NOT NULL,
    descripcion    TEXT,
    verificado     BOOLEAN      NOT NULL DEFAULT FALSE
);


CREATE TABLE categorias_evento (
    id     INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE sedes (
    id        INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre    VARCHAR(150) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    ciudad    VARCHAR(80)  NOT NULL,
    capacidad INT          NOT NULL CHECK (capacidad > 0)
);


CREATE TABLE eventos (
    id             INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organizador_id INT          NOT NULL
                   REFERENCES organizadores (id) ON DELETE RESTRICT,
    categoria_id   INT          NOT NULL
                   REFERENCES categorias_evento (id) ON DELETE RESTRICT,
    sede_id        INT          NOT NULL
                   REFERENCES sedes (id) ON DELETE RESTRICT,
    titulo         VARCHAR(150) NOT NULL,
    descripcion    TEXT,
    fecha_inicio   TIMESTAMP    NOT NULL,
    fecha_fin      TIMESTAMP,
    estado         VARCHAR(20)  NOT NULL DEFAULT 'borrador'
                   CHECK (estado IN ('borrador', 'publicado', 'finalizado', 'cancelado')),
    CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);

CREATE TABLE tipos_entrada (
    id                  INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    evento_id           INT           NOT NULL
                        REFERENCES eventos (id) ON DELETE CASCADE,
    nombre              VARCHAR(80)   NOT NULL,
    precio              NUMERIC(12,2) NOT NULL CHECK (precio >= 0),
    cantidad_disponible INT           NOT NULL CHECK (cantidad_disponible >= 0),
    cantidad_vendida    INT           NOT NULL DEFAULT 0 CHECK (cantidad_vendida >= 0),
    CHECK (cantidad_vendida <= cantidad_disponible),
    UNIQUE (evento_id, nombre)
);
