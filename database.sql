-- ============================================
-- Bolsa de Trabajo - Universidad Tecnológica
-- Script de creación de Base de Datos
-- ============================================

CREATE DATABASE IF NOT EXISTS bolsa_trabajo_ut;
USE bolsa_trabajo_ut;

-- ============================================
-- Tabla: usuarios (Egresados)
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    carrera VARCHAR(150),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Tabla: empresas
-- ============================================
CREATE TABLE IF NOT EXISTS empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    sitio_web VARCHAR(255),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Tabla: vacantes
-- ============================================
CREATE TABLE IF NOT EXISTS vacantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    requisitos TEXT,
    salario VARCHAR(100),
    ubicacion VARCHAR(200),
    latitud DECIMAL(10, 8) NULL,
    longitud DECIMAL(11, 8) NULL,
    tipo_contrato ENUM('Tiempo completo', 'Medio tiempo', 'Por proyecto', 'Prácticas profesionales', 'Remoto') DEFAULT 'Tiempo completo',
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activa', 'cerrada') DEFAULT 'activa',
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Tabla: postulaciones
-- ============================================
CREATE TABLE IF NOT EXISTS postulaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    vacante_id INT NOT NULL,
    fecha_postulacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'revisada', 'aceptada', 'rechazada') DEFAULT 'pendiente',
    mensaje TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (vacante_id) REFERENCES vacantes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_postulacion (usuario_id, vacante_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Datos de prueba (Seed)
-- ============================================

-- Empresas de prueba (password: empresa123 - hash bcrypt)
INSERT INTO empresas (nombre, descripcion, email, password, telefono, direccion, sitio_web) VALUES
('TechSolutions MX', 'Empresa líder en desarrollo de software y consultoría tecnológica.', 'contacto@techsolutions.mx', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfl7v7bQdCzOl5jOGMwBFtUBEkaOW1tG', '555-0101', 'Av. Tecnológico 100, Querétaro', 'https://techsolutions.mx'),
('Innovatech', 'Startup de innovación digital enfocada en inteligencia artificial.', 'rh@innovatech.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfl7v7bQdCzOl5jOGMwBFtUBEkaOW1tG', '555-0202', 'Blvd. Innovación 250, CDMX', 'https://innovatech.com'),
('DataCorp', 'Consultora especializada en análisis de datos y business intelligence.', 'empleo@datacorp.mx', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfl7v7bQdCzOl5jOGMwBFtUBEkaOW1tG', '555-0303', 'Calle Datos 45, Monterrey', 'https://datacorp.mx');

-- Usuarios de prueba (password: usuario123 - hash bcrypt)
INSERT INTO usuarios (nombre, apellido, email, password, telefono, carrera) VALUES
('Carlos', 'Hernández', 'carlos@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '555-1001', 'Ingeniería en Sistemas Computacionales'),
('María', 'López', 'maria@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '555-1002', 'Ingeniería en Software'),
('José', 'García', 'jose@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '555-1003', 'Tecnologías de la Información');

-- Vacantes de prueba
INSERT INTO vacantes (empresa_id, titulo, descripcion, requisitos, salario, ubicacion, tipo_contrato) VALUES
(1, 'Desarrollador Frontend Jr.', 'Buscamos desarrollador frontend con conocimientos en HTML, CSS y JavaScript para unirse a nuestro equipo de desarrollo web.', 'HTML, CSS, JavaScript, Git. Deseable: conocimiento en algún framework como React o Vue.', '$12,000 - $18,000 MXN', 'Querétaro, Qro.', 'Tiempo completo'),
(1, 'Soporte Técnico', 'Se requiere técnico de soporte para atender incidencias y dar mantenimiento a equipos de cómputo.', 'Conocimiento en redes, Windows, Linux. Buen trato con usuarios.', '$10,000 - $14,000 MXN', 'Querétaro, Qro.', 'Tiempo completo'),
(2, 'Practicante de Data Science', 'Oportunidad de prácticas profesionales en el área de ciencia de datos con mentoría personalizada.', 'Python, SQL, estadística básica. Cursando último semestre o recién egresado.', '$8,000 - $10,000 MXN', 'CDMX (Híbrido)', 'Prácticas profesionales'),
(2, 'Desarrollador Backend Node.js', 'Desarrollador backend para construir APIs escalables usando Node.js y bases de datos relacionales.', 'Node.js, Express, MySQL o PostgreSQL, Git, APIs REST.', '$15,000 - $22,000 MXN', 'Remoto', 'Remoto'),
(3, 'Analista de Datos Jr.', 'Analista de datos para generar reportes e insights a partir de grandes volúmenes de información.', 'SQL, Excel avanzado, Power BI o Tableau. Deseable: Python.', '$14,000 - $20,000 MXN', 'Monterrey, N.L.', 'Tiempo completo'),
(3, 'QA Tester Jr.', 'Tester de calidad de software para realizar pruebas manuales y automatizadas.', 'Conocimiento en pruebas de software, SQL básico, atención al detalle.', '$12,000 - $16,000 MXN', 'Monterrey, N.L.', 'Medio tiempo');

-- Postulaciones de prueba
INSERT INTO postulaciones (usuario_id, vacante_id, estado, mensaje) VALUES
(1, 1, 'pendiente', 'Me interesa mucho esta posición, cuento con experiencia en proyectos escolares de desarrollo web.'),
(1, 4, 'revisada', 'Tengo experiencia con Node.js en proyectos académicos y personales.'),
(2, 3, 'aceptada', 'Estoy muy interesada en las prácticas de Data Science, he tomado cursos de Python y estadística.'),
(3, 5, 'pendiente', 'Me apasiona el análisis de datos y tengo certificación en Power BI.');
