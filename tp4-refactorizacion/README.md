# Práctica SOLID - Empleados y Salarios

Proyecto refactorizado aplicando los principios **SOLID** y una separación clara de
responsabilidades: `controllers`, `routes`, `services`, `repositories`, `models` y
`errorHandler`.

La explicación de los principios y el análisis de `docker-compose.yml` están en
**[DOCUMENTACION.md](./DOCUMENTACION.md)**.

## Regla de negocio

**salario final = salario base + 2% del salario base por cada año de antigüedad**

Ejemplo:

- Salario base: 1.000.000
- Antigüedad: 5 años
- Adicional: 10%
- Salario final: 1.100.000

## Endpoints

- `POST /employees`
- `GET /employees`
- `GET /employees/:id`

## Estructura

```
src/
├── config/Server.ts                  # Express, conexión a Mongo y composition root
├── controllers/EmployeeController.ts # Capa HTTP
├── errors/                           # AppError + ErrorHandler
├── models/Employee.ts                # Esquema e interfaces de Mongoose
├── repositories/                     # Contrato + implementación de persistencia
├── routes/EmployeeRoutes.ts          # Rutas de Express
├── services/                         # Reglas de negocio y cálculo de salario
└── server.ts                         # Punto de entrada
```

## Cómo ejecutar

```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```

Compilar y ejecutar en producción:

```bash
npm run build
npm start
```

> El proyecto usa módulos ES nativos (`"type": "module"`).

## Comportamiento

El comportamiento observable de la API se mantiene igual que en la versión original:
mismos códigos de estado (`201`, `200`, `400`, `404`, `500`), mismos cuerpos de respuesta y
mismos mensajes.
