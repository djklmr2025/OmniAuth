# 🔐 OmniAuth (Chrome/Edge) — Authenticator Offline

OmniAuth es una extensión **offline** para Chrome/Edge que genera códigos **TOTP** (RFC 6238) y permite agregar cuentas por **QR local** o manual.

✅ Sin Gemini  
✅ Sin nube  
✅ Sin mandar secretos a internet  
🔒 Incluye **bóveda cifrada** + **backup cifrado** `.authbackup`

---

## ✨ Funciones principales

- **TOTP offline** (códigos 6 dígitos, ventana 30s)
- **Escaneo QR local** (cámara) o **subir imagen** (según soporte del navegador)
- **Alta manual** (Issuer / Label / Secret Base32)
- **Bóveda cifrada** (AES-GCM + PBKDF2)
- **Backup / Restore** en archivo `.authbackup` (cifrado)

---

## 📦 Descargar

- ZIP de la extensión:  
  `OmniAuth-extension-final.zip` (en este repositorio)

Tip: para descarga directa desde GitHub, usa el link con `?raw=1`.

---

## 🧩 Instalación (ZIP)

1. Descarga y descomprime el ZIP.
2. Abre:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
3. Activa **Modo desarrollador**.
4. Click en **Cargar descomprimida**.
5. Selecciona la carpeta descomprimida donde esté `manifest.json`.

---

## 🔒 Primer uso (bóveda)

1. Abre OmniAuth desde el icono de extensiones.
2. Crea tu **contraseña** de bóveda.
3. Agrega una cuenta:
   - **Escanear QR**
   - **Subir imagen**
   - **Manual** (Secret Base32)
4. Exporta un respaldo:
   - **Exportar** → guarda tu `.authbackup` en **2 lugares**.

> ⚠️ Si olvidas la contraseña, no hay recuperación.  
> El cifrado está diseñado para que sin contraseña el archivo sea inútil.

---

## ♻️ Restaurar en otra PC

1. Instala la extensión (pasos arriba).
2. Abre OmniAuth → **Importar**.
3. Selecciona tu `.authbackup`.
4. Escribe la contraseña → se restauran tus cuentas.

---

## 🛡️ Seguridad (en pocas palabras)

- Los secretos se protegen con:
  - **PBKDF2 (SHA-256)** para derivar clave desde tu contraseña
  - **AES-GCM** para cifrado + verificación de integridad
- El backup `.authbackup` está cifrado: es seguro guardarlo en nube.

---

## 🧪 Notas de compatibilidad

- El lector QR puede depender de APIs del navegador (ej. `BarcodeDetector`).
- Si tu navegador no soporta alguna función, puedes usar **alta manual**.

---

## 📄 Licencia

MIT (ver `LICENSE`).

---

## 🐞 Soporte

Reporta errores en **Issues**:
- describe tu navegador (Chrome/Edge + versión)
- adjunta captura y/o logs de consola del popup
