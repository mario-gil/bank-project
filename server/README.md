# API de Transacciones Bancarias - NestJS 9

![NestJS](https://img.shields.io/badge/NestJS-9.0.0-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)

## 📝 Descripción

API escalable y modular para la gestión de transacciones bancarias construida con **NestJS 9**, demostrando arquitectura profesional, decoradores, validación de datos, middleware y persistencia temporal en sesión.

### ✨ Características Principales

- ✅ **Arquitectura Modular**: Organización escalable con módulos independientes
- ✅ **CRUD Completo**: GET, POST, PUT, PATCH, DELETE de transacciones
- ✅ **Validación de Datos**: DTOs con class-validator
- ✅ **Paginación Automática**: Manejo eficiente de grandes conjuntos de datos
- ✅ **Persistencia en Sesión**: express-session para datos temporales
- ✅ **CORS Configurado**: Comunicación entre Shell (4200) y Remote (4201)
- ✅ **Transformación de Parámetros**: ParseIntPipe para IDs de URL
- ✅ **Códigos HTTP Apropiados**: 201 Created, 204 No Content, 404 Not Found
- ✅ **Tests E2E**: Suite completa de pruebas con Supertest

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 16+ 
- npm o yarn
- Navegador moderno con soporte para fetch API

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd server
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env en la raíz del proyecto
NODE_ENV=development
PORT=3000
CORS_ORIGIN_SHELL=http://localhost:4200
CORS_ORIGIN_REMOTE=http://localhost:4201
```

4. **Compilar el proyecto**
```bash
npm run build
```

---

## 🎯 Ejecución

### Desarrollo con Watch Mode
```bash
npm run start:dev
```
Inicia el servidor con recarga automática en http://localhost:3000

### Producción
```bash
npm run build
npm run start:prod
```

### Modo Debug
```bash
npm run start:debug
```

---

## 📚 Documentación de la API

### Endpoints Disponibles

#### 1. **Health Check**
```http
GET /health
```
Verificar estado de la API

#### 2. **Obtener Transacciones (Con Paginación)**
```http
GET /transactions?page=1&limit=10
```
- `page`: Número de página (default: 1)
- `limit`: Registros por página (default: 10)

#### 3. **Obtener Transacción por ID**
```http
GET /transactions/:id
```

#### 4. **Crear Transacción**
```http
POST /transactions
Content-Type: application/json

{
  "concepto": "string (requerido)",
  "categoria": "string (requerido)",
  "importe": "number (mín: 0.01, requerido)",
  "fecha": "ISO 8601 date (requerido)"
}
```

#### 5. **Actualizar Totalmente (PUT)**
```http
PUT /transactions/:id
Content-Type: application/json

{
  "concepto": "string",
  "categoria": "string",
  "importe": "number",
  "fecha": "ISO 8601 date"
}
```
⚠️ **Nota**: PUT requiere TODOS los campos

#### 6. **Actualizar Parcialmente (PATCH)**
```http
PATCH /transactions/:id
Content-Type: application/json

{
  "importe": 2500.00
}
```
✅ **Nota**: PATCH permite actualizar solo los campos deseados

#### 7. **Eliminar Transacción**
```http
DELETE /transactions/:id
```
Retorna 204 No Content

---

## 🧪 Testing

### Tests Unitarios
```bash
npm run test
```

### Tests con Coverage
```bash
npm run test:cov
```

### Tests E2E
```bash
npm run test:e2e
```

### Tests en Modo Watch
```bash
npm run test:watch
```

---

## 🔌 Pruebas Manuales

### Opción 1: Postman/Insomnia
Importa la colección incluida en el proyecto:
```
Transacciones_API.postman_collection.json
```

### Opción 2: cURL (Bash)
```bash
# Ejecutar el script de pruebas
bash test_api.sh
```

### Opción 3: Consola del Navegador (CORS Test)
1. Abre Chrome DevTools (F12)
2. Pega el contenido de `CORS_INTEGRATION_TEST.js` en la consola
3. Ejecuta cualquier función:
```javascript
await testHealth();
await runFullTest();
```

### Opción 4: Curl Manual
```bash
# Crear transacción
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "concepto": "Nómina",
    "categoria": "Ingresos",
    "importe": 2500,
    "fecha": "2024-01-17"
  }' \
  -c cookies.txt

# Obtener transacciones
curl http://localhost:3000/transactions \
  -b cookies.txt
```

---

## 📂 Estructura del Proyecto

```
src/
├── transactions/
│   ├── dto/
│   │   ├── create-transaction.dto.ts
│   │   └── update-transaction.dto.ts
│   ├── entities/
│   │   └── transaction.entity.ts
│   ├── transactions.controller.ts
│   ├── transactions.service.ts
│   └── transactions.module.ts
├── config/
│   └── app.config.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts

test/
└── app.e2e-spec.ts

dist/                  # Compilado (generado)
node_modules/          # Dependencias
.env                   # Variables de entorno
TRANSACTIONS_API.md    # Documentación detallada
CORS_INTEGRATION_TEST.js  # Script de pruebas CORS
test_api.sh            # Script bash de pruebas
```

---

## 🔐 Configuración de Seguridad

### Express-Session
- **Duración**: 24 horas
- **HttpOnly**: `true` (protección contra XSS)
- **Secure**: `false` en desarrollo / `true` en producción
- **Secret**: Cambiar en producción

### CORS
- Orígenes permitidos: localhost:4200, localhost:4201
- Credenciales: `true`

### Validación
- Whitelist: Rechaza propiedades desconocidas
- Transform: Convierte tipos automáticamente
- Pipes: Valida en tiempo de ejecución

---

## 🛠️ Dependencias Principales

| Paquete | Versión | Descripción |
|---------|---------|-------------|
| @nestjs/common | ^9.0.0 | Core de NestJS |
| @nestjs/core | ^9.0.0 | Framework NestJS |
| express-session | ^1.18.2 | Persistencia de sesión |
| class-validator | ^0.14.3 | Validación de DTOs |
| class-transformer | ^0.5.1 | Transformación de objetos |
| @nestjs/config | ^2.3.4 | Manejo de .env |
| dotenv | ^17.2.3 | Carga de variables de entorno |

---

## 📋 Normas de Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 🐛 Debugging

### Ver logs del servidor
```bash
npm run start:dev
# Los logs aparecerán en la consola
```

### Inspeccionar con DevTools de Node
```bash
npm run start:debug
# Abre chrome://inspect en Chrome
```

### Tests con debug
```bash
npm run test:debug
```

---

## 📞 Soporte

Para preguntas o problemas:
1. Revisa la documentación en `TRANSACTIONS_API.md`
2. Consulta los tests en `test/app.e2e-spec.ts`
3. Revisa el script de pruebas en `CORS_INTEGRATION_TEST.js`

---

## 📄 Licencia

Proyecto educativo - Academia Santander 2024

---

## 🎓 Stack Tecnológico

- **Framework**: NestJS 9
- **Lenguaje**: TypeScript 5.5.3
- **Runtime**: Node.js 18
- **Testing**: Jest, Supertest
- **Validación**: class-validator, class-transformer
- **Sesión**: express-session
- **DevTools**: ESLint, Prettier



## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
