# API Integration Guide - Google Maps & EmailJS

This document explains all the changes made to integrate Google Maps and EmailJS APIs into the job board project.

---

## 1. DATABASE CHANGES

### Migration Script
File: `scripts/add_coordinates_to_vacantes.sql`

Run this SQL to add the coordinate columns to your existing database:

```sql
ALTER TABLE vacantes 
ADD COLUMN latitud DECIMAL(10, 8) NULL AFTER ubicacion,
ADD COLUMN longitud DECIMAL(11, 8) NULL AFTER latitud;
```

### Updated Schema (for new installations)
File: `database.sql`

The vacantes table now includes:
- `latitud DECIMAL(10, 8) NULL` - Latitude coordinate
- `longitud DECIMAL(11, 8) NULL` - Longitude coordinate

---

## 2. BACKEND CHANGES

### models/Vacante.js
- **crear()**: Now accepts and stores `latitud` and `longitud` parameters
- **actualizar()**: Now accepts and updates `latitud` and `longitud` parameters
- **obtenerPorId()**: Now returns `empresa_email` for EmailJS notifications

### controllers/vacantesController.js
- **crear()**: Extracts `latitud` and `longitud` from request body
- **actualizar()**: Extracts `latitud` and `longitud` from request body

---

## 3. FRONTEND CHANGES

### public/dashboard.html
Added:
- Map picker container with hidden inputs for coordinates
- Google Maps API script at bottom of file

### public/js/dashboard.js
Added functions:
- `initMapPicker()` - Google Maps callback
- `initializeMapInModal()` - Initializes map when modal opens
- `placeMarker(location)` - Places/moves marker on map
- `resetMapPicker()` - Resets map state
- `setMapMarkerFromCoordinates(lat, lng)` - Sets marker from existing coordinates

Modified functions:
- `mostrarFormVacante()` - Resets and initializes map picker
- `editarVacante(id)` - Loads existing coordinates into map
- `guardarVacante(e)` - Includes coordinates in save data

### public/vacante-detalle.html
Added:
- EmailJS SDK script
- Google Maps API script

### public/js/vacante-detalle.js
Added functions:
- `initMapDisplay()` - Google Maps callback for display
- `initializeMapDisplay(lat, lng)` - Shows map with marker
- `enviarEmailNotificacion(mensajeAdicional)` - Sends email via EmailJS

Modified functions:
- `cargarVacante(id)` - Displays map if coordinates exist
- `enviarPostulacion(e)` - Calls email notification after successful application

---

## 4. API KEY PLACEHOLDERS

### Google Maps API Key
Replace `GOOGLE_MAPS_API_KEY_HERE` in:
- `public/dashboard.html` (line 174)
- `public/vacante-detalle.html` (line 60)

### EmailJS Credentials
Replace in `public/vacante-detalle.html`:
- `EMAILJS_PUBLIC_KEY_HERE` (line 55)

Replace in `public/js/vacante-detalle.js`:
- `EMAILJS_SERVICE_ID_HERE` (line 206)
- `EMAILJS_TEMPLATE_ID_HERE` (line 207)

---

## 5. EMAILJS TEMPLATE SETUP

Create an EmailJS template with these variables:
- `{{to_email}}` - Company email address
- `{{empresa_nombre}}` - Company name
- `{{egresado_nombre}}` - Graduate's full name
- `{{egresado_email}}` - Graduate's email
- `{{vacante_titulo}}` - Job title
- `{{vacante_id}}` - Vacancy ID
- `{{mensaje}}` - Additional message from graduate
- `{{mensaje_postulacion}}` - Full formatted message

Example template:
```
Subject: Nueva postulacion para {{vacante_titulo}}

Hola {{empresa_nombre}},

{{mensaje_postulacion}}

Saludos,
Sistema de Bolsa de Trabajo
```

---

## 6. GOOGLE MAPS SETUP

1. Go to Google Cloud Console
2. Enable "Maps JavaScript API"
3. Create an API key
4. Optionally restrict the key to your domain
5. Replace `GOOGLE_MAPS_API_KEY_HERE` with your key

---

## 7. QUICK START

1. Run the migration SQL on your database
2. Replace all placeholder API keys
3. Set up your EmailJS account and template
4. Test by:
   - Creating a new vacancy as empresa (map picker should appear)
   - Viewing a vacancy as egresado (map should display if coordinates exist)
   - Applying to a vacancy (email should be sent)

---

## Files Modified Summary

| File | Changes |
|------|---------|
| `scripts/add_coordinates_to_vacantes.sql` | NEW - Migration script |
| `database.sql` | Added latitud/longitud columns |
| `models/Vacante.js` | Updated crear, actualizar, obtenerPorId |
| `controllers/vacantesController.js` | Added coordinate handling |
| `public/dashboard.html` | Added map picker UI and script |
| `public/js/dashboard.js` | Added map picker functions |
| `public/vacante-detalle.html` | Added EmailJS and Maps scripts |
| `public/js/vacante-detalle.js` | Added map display and email functions |
