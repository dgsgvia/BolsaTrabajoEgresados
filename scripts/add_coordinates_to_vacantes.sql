-- ============================================
-- Migration: Add coordinates columns to vacantes table
-- For Google Maps integration
-- ============================================

ALTER TABLE vacantes 
ADD COLUMN latitud DECIMAL(10, 8) NULL AFTER ubicacion,
ADD COLUMN longitud DECIMAL(11, 8) NULL AFTER latitud;

-- Update existing vacancies with NULL coordinates (optional default location can be set later)
-- No data changes needed for existing records, they will simply have NULL coordinates
