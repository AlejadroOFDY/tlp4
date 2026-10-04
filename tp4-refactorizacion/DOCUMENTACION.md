# Documentación: Principios SOLID y Docker Compose

Trabajo práctico de refactorización del proyecto **Gestión de Empleados y Salarios**.

El código original concentraba todo en un único archivo (`src/server.ts`): definición del
esquema de Mongoose, validaciones, cálculo del salario, acceso a la base de datos y
declaración de rutas. El objetivo fue separar esas responsabilidades en capas y aplicar los
principios **SOLID**, **manteniendo intacto el comportamiento observable de la API**
(mismos códigos de estado, mismos cuerpos de respuesta y mismos mensajes).

---

## 1. Estructura del proyecto

```
src/
├── config/
│   └── Server.ts                     # Configuración de Express, conexión a Mongo y "composition root"
├── controllers/
│   └── EmployeeController.ts         # Entrada/salida HTTP
├── errors/
│   ├── AppError.ts                   # Error de negocio con código de estado
│   └── ErrorHandler.ts               # Middleware centralizado de errores
├── models/
│   └── Employee.ts                   # Esquema e interfaces de Mongoose
├── repositories/
│   ├── IEmployeeRepository.ts        # Contrato de acceso a datos
│   └── EmployeeRepository.ts         # Implementación con MongoDB
├── routes/
│   └── EmployeeRoutes.ts             # Definición de rutas de Express
├── services/
│   ├── ISalaryCalculator.ts          # Contrato de cálculo de salario
│   ├── AntiquitySalaryCalculator.ts  # Implementación por antigüedad
│   ├── IEmployeeService.ts           # Contrato de negocio + DTO
│   └── EmployeeService.ts            # Lógica de negocio de empleados
└── server.ts                         # Punto de entrada
```

El flujo de una petición es siempre el mismo:

```
HTTP → Route → Controller → Service → Repository → MongoDB
                 (error)  → ErrorHandler → HTTP
```

---

## 2. Aplicación de los principios SOLID

### S — Single Responsibility Principle (Responsabilidad única)

Cada archivo tiene **una sola razón para cambiar**:

- **`models/Employee.ts`**: solo define el esquema y los tipos. No valida ni accede a datos.
- **`repositories/EmployeeRepository.ts`**: solo encapsula las operaciones de persistencia
  (`create`, `findAll`, `findById`). No conoce HTTP ni reglas de negocio.
- **`services/AntiquitySalaryCalculator.ts`**: solo hace el cálculo matemático del salario.
- **`services/EmployeeService.ts`**: solo orquesta el dominio: valida los datos, pide el
  cálculo y delega el guardado. No conoce `req`/`res` ni Mongoose.
- **`controllers/EmployeeController.ts`**: solo traduce HTTP ↔ negocio (lee `req.body`,
  arma la respuesta y deriva errores con `next(error)`).
- **`routes/EmployeeRoutes.ts`**: solo declara los endpoints y los asocia al controlador.
- **`errors/ErrorHandler.ts`**: solo centraliza el formato de las respuestas de error,
  evitando repetir `try/catch` con formato manual en cada endpoint.
- **`config/Server.ts`**: solo configura el ciclo de vida (middlewares, conexión y arranque).

### O — Open/Closed Principle (Abierto/Cerrado)

Las entidades deben estar **abiertas a extensión pero cerradas a modificación**.

- La interfaz `ISalaryCalculator` define `calculate(baseSalary, yearsOfService)`.
  `AntiquitySalaryCalculator` la implementa. Si mañana cambia la fórmula o se agrega otro
  criterio (bonos por desempeño, inflación, etc.), se crea una **nueva clase** que implemente
  la interfaz y se inyecta en `Server.ts`, sin tocar `EmployeeService`. El servicio no se
  modifica para extenderse.

### L — Liskov Substitution Principle (Sustitución de Liskov)

Una implementación debe poder reemplazar a su contrato sin romper nada.

- Cualquier clase que implemente `ISalaryCalculator` puede pasarse al constructor de
  `EmployeeService` y el programa sigue funcionando: respeta el tipo de entrada
  (`number, number`) y de salida (`number`).
- Lo mismo con `IEmployeeRepository`: `EmployeeRepository` cumple exactamente las firmas
  (`create`, `findAll`, `findById`), por lo que podría reemplazarse por otra implementación
  (por ejemplo, en memoria para tests) sin cambiar el resto del sistema.

### I — Interface Segregation Principle (Segregación de interfaces)

Mejor varias interfaces chicas y específicas que una grande y general.

- `ISalaryCalculator` expone **solo** `calculate`; quien calcula salarios no necesita conocer
  la base de datos.
- `IEmployeeRepository` expone **solo** las operaciones que el servicio realmente usa.
- `IEmployeeService` + `CreateEmployeeDTO` separan el contrato de negocio de los detalles de
  Mongoose, y ofrecen solo lo que el controlador necesita.

Ninguna clase queda obligada a implementar métodos que no utiliza.

### D — Dependency Inversion Principle (Inversión de dependencias)

Los módulos de alto nivel no dependen de los de bajo nivel: ambos dependen de abstracciones.

- `EmployeeController` recibe `IEmployeeService` por constructor (no instancia nada).
- `EmployeeService` recibe `IEmployeeRepository` y `ISalaryCalculator` por constructor
  (no crea `new EmployeeRepository()` ni `new AntiquitySalaryCalculator()`).
- El cableado concreto se centraliza en **`config/Server.ts`** (composition root):

```typescript
const salaryCalculator = new AntiquitySalaryCalculator();
const employeeRepository = new EmployeeRepository();
const employeeService = new EmployeeService(employeeRepository, salaryCalculator);
const employeeController = new EmployeeController(employeeService);
const employeeRoutes = new EmployeeRoutes(employeeController);

this.app.use(employeeRoutes.getRoutes());
```

Así, los detalles (Mongo, fórmula de cálculo) dependen de las abstracciones, y no al revés.

---

## 3. Análisis del archivo `docker-compose.yml`

Contenido del archivo:

```yaml
services:
  mongodb:
    image: mongo:8
    container_name: empleados-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### 3.1. ¿Cuál es su función?

**Docker Compose** es una herramienta que permite describir y ejecutar infraestructura de
contenedores de forma declarativa (archivo YAML). En este proyecto su función es **levantar
MongoDB de manera aislada, reproducible e inmediata**, sin tener que instalar y configurar
manualmente un motor de base de datos en la máquina.

### 3.2. ¿Qué servicios y parámetros configura?

Define **un único servicio**, `mongodb`, con estos parámetros:

| Parámetro | Qué hace |
|---|---|
| `image: mongo:8` | Descarga y usa la imagen oficial de MongoDB versión 8 (Community Server). |
| `container_name: empleados-mongodb` | Le da un nombre fijo al contenedor, para poder verlo/detenerlo por nombre. |
| `restart: unless-stopped` | Reinicia el contenedor automáticamente si se cae, salvo que se lo detenga a mano. |
| `ports: "27017:27017"` | Mapea el puerto `27017` del host al `27017` del contenedor (formato `host:contenedor`). Permite conectarse desde fuera del contenedor. |
| `volumes: mongo_data:/data/db` | Persiste los datos: monta el volumen `mongo_data` en `/data/db` (carpeta estándar de datos de Mongo). |
| `volumes: mongo_data:` | Declara el volumen con nombre (gestionado por Docker) a nivel raíz. |

### 3.3. ¿Cómo se relaciona con el funcionamiento general de la aplicación?

1. **Cadena de conexión**: en `.env` se define
   `MONGO_URI=mongodb://localhost:27017/employees_db`. Al arrancar, `Server.ts` ejecuta
   `mongoose.connect(this.mongoUri)` contra el puerto `27017` que expone el contenedor.
2. **Dependencia de arranque**: si el contenedor no está corriendo, la conexión falla, se
   imprime `No se pudo conectar a MongoDB` y el proceso termina con código `1`.
3. **Persistencia**: cada `POST /employees` se guarda en el volumen `mongo_data`, así que los
   datos sobreviven a reinicios del contenedor o de la aplicación y siguen disponibles para
   `GET /employees`.

> Nota: la aplicación Node corre en el host (no dentro de Docker); por eso el mapeo de
> puertos a `localhost` es lo que permite la comunicación con el contenedor.

---

## 4. Guía de ejecución y verificación

```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```

### Probar los endpoints

**Crear empleado (`POST /employees`)**

```bash
curl -X POST http://localhost:3000/employees \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Perez","position":"Desarrollador Senior","baseSalary":1000000,"yearsOfService":5}'
```

Respuesta esperada (`201 Created`, con `finalSalary: 1100000` porque 5 años → 10% adicional):

```json
{
  "_id": "...",
  "name": "Juan Perez",
  "position": "Desarrollador Senior",
  "baseSalary": 1000000,
  "yearsOfService": 5,
  "finalSalary": 1100000,
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Listar empleados (`GET /employees`)** — devuelve el arreglo ordenado por fecha descendente.

**Consultar por ID (`GET /employees/:id`)** — devuelve el empleado o `404` con
`{ "message": "Empleado no encontrado" }` si no existe.

### Ejecución en producción

```bash
npm run build
npm start
```

El proyecto usa **módulos ES nativos** (`"type": "module"` en `package.json`), por lo que la
salida compilada en `dist/` se ejecuta como ESM.
