INSERT INTO usuarios (nombre, email, password_hash, telefono) VALUES
    ('Laura Gómez',    'laura@example.com',  'hash_de_prueba_1', '3001112233'),
    ('Carlos Ramírez', 'carlos@example.com', 'hash_de_prueba_2', '3004445566');

INSERT INTO organizadores (usuario_id, nombre_empresa, descripcion, verificado) VALUES
    (1, 'Pulso Producciones', 'Productora de conciertos y festivales',          TRUE),
    (2, 'Escena Viva',        'Compañía de teatro y eventos culturales',        FALSE);

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