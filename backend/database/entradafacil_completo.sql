-- solamente junte las dos cosas y breve

DROP TABLE IF EXISTS tipos_entrada     CASCADE;
DROP TABLE IF EXISTS eventos           CASCADE;
DROP TABLE IF EXISTS sedes             CASCADE;
DROP TABLE IF EXISTS categorias_evento CASCADE;
DROP TABLE IF EXISTS organizadores     CASCADE;
DROP TABLE IF EXISTS usuarios          CASCADE;

-- 1. Tabla de Usuarios
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

-- 2. Tabla de Organizadores
CREATE TABLE organizadores (
    id             INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id     INT          NOT NULL UNIQUE
                   REFERENCES usuarios (id) ON DELETE CASCADE,
    nombre_empresa VARCHAR(150) NOT NULL,
    descripcion    TEXT,
    verificado     BOOLEAN      NOT NULL DEFAULT FALSE
);

-- 3. Tabla de Categorías de Evento
CREATE TABLE categorias_evento (
    id     INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE
);

-- 4. Tabla de Sedes
CREATE TABLE sedes (
    id        INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre    VARCHAR(150) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    ciudad    VARCHAR(80)  NOT NULL,
    capacidad INT          NOT NULL CHECK (capacidad > 0)
);

-- 5. Tabla de Eventos
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

-- 6. Tabla de Tipos de Entrada
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


-- DATOS DE PRUEBA 


INSERT INTO usuarios (nombre, email, password_hash, telefono) VALUES
    ('Laura Gómez',    'laura@example.com',  'hash_de_prueba_1', '3001112233'),
    ('Carlos Ramírez', 'carlos@example.com', 'hash_de_prueba_2', '3004445566');

INSERT INTO organizadores (usuario_id, nombre_empresa, descripcion, verificado) VALUES
    (1, 'Pulso Producciones', 'Productora de conciertos y festivales',   TRUE),
    (2, 'Escena Viva',        'Compañía de teatro y eventos culturales', FALSE);

INSERT INTO categorias_evento (nombre) VALUES
    ('Música'),
    ('Deportes'),
    ('Teatro'),
    ('Universidad'),
    ('Otros');

INSERT INTO sedes (nombre, direccion, ciudad, capacidad) VALUES
    ('Parque Central',       'Calle 10 # 5-20',    'Bogotá',   30000),
    ('Estadio de la Ciudad', 'Carrera 15 # 20-30', 'Cali',     35000),
    ('Teatro Municipal',     'Avenida 4 # 12-45',  'Medellín',   900);

INSERT INTO eventos
    (organizador_id, categoria_id, sede_id, titulo, descripcion, fecha_inicio, fecha_fin, estado) VALUES
    (1, 1, 1, 'Festival Pulso Capital 2026', 'Festival de música en vivo con artistas nacionales',
        '2026-10-17 18:00', '2026-10-17 23:30', 'publicado'),
    (1, 2, 2, 'Copa de la Ciudad',           'Torneo de fútbol entre equipos de barrio',
        '2026-10-18 15:00', '2026-10-18 18:00', 'publicado'),
    (2, 3, 3, 'Las horas azules',            'Obra de teatro contemporáneo',
        '2026-10-24 19:30', NULL,               'borrador');

INSERT INTO tipos_entrada (evento_id, nombre, precio, cantidad_disponible, cantidad_vendida) VALUES
    (1, 'General', 89000,  20000, 150),
    (1, 'VIP',     180000,  2000,  40),
    (2, 'General', 35000,  25000,   0),
    (3, 'General', 45000,    900,   0);

