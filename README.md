
Instrucciones de ejecución
1. Requisitos previos
Node.js 18 o superior y npm.
Angular CLI 16 (npm install -g @angular/cli@16).
Cuenta de MongoDB Atlas con la IP del equipo permitida en Network Access.

2. Backend
bash
cd backend
npm install

Crear el archivo .env (a partir de .env.example):

PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/citasdb
bash
npm start

Debe mostrar MongoDB conectado y API en http://localhost:3000.

3. Frontend
bash
cd frontend
npm install
npm start

Abrir http://localhost:4200.

4. Carga de datos de prueba

En MongoDB Compass: base citasdb → colección citas → ADD DATA → Import JSON → seleccionar datos/citas-prueba.json. El archivo datos/citas-export.json es la exportación de la colección con los registros usados en las pruebas.

5. Pruebas realizadas
Prueba	Resultado esperado	Resultado
Enviar formulario vacío	Mensajes de validación	Correcto
Registrar cita válida	Mensaje de éxito, aparece en la lista y en MongoDB	Correcto
Editar cita	Cambio visible en la lista y en MongoDB	Correcto
Eliminar cita	Confirmación; desaparece de la lista y de MongoDB	Correcto
Teléfono con menos de 9 dígitos	Rechazado por Angular y por la API (400)	Correcto
Backend apagado	Mensaje «No se pudo conectar con el servidor»	Correcto

6. Notas de seguridad y entrega
El archivo .env contiene credenciales y no se incluye en la entrega; se adjunta .env.example.
Se excluyen node_modules, .angular y dist para mantener el proyecto liviano; se regeneran con npm install.