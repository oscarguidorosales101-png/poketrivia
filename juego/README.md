# PokéTrivia Survival Master — Quiz #5: Videojuego con React + Consumo de Datos + n8n

Videojuego de **supervivencia infinito de preguntas y respuestas** desarrollado con **React 18**, **React Router v6**, consumo de **PokeAPI v2**, persistencia con **json-server** (`db.json`), control de roles (**PLAYER** y **ADMIN**), códigos de acceso (**401**, **403**, **404**) y automatización con **n8n**.

---

## 1. Características Principales

* **Modo Supervivencia Infinito:** No existe un límite de 10 o 20 preguntas; la partida continúa indefinidamente mientras queden vidas.
* **Escalado Progresivo:** La partida aumenta en complejidad durante su ejecución (Fácil: 1-10, Intermedio: 11-25, Difícil: 26-50, Supervivencia Élite: 51+).
* **3 Dificultades por Generación de Videojuegos:**
  * **Principiante (Gen 1 - Kanto):** ❤️ 5 vidas iniciales, +100 puntos base por respuesta correcta.
  * **Avanzado (Gen 2 - Johto):** ❤️ 4 vidas iniciales, +200 puntos base por respuesta correcta.
  * **Maestro (Gen 3 - Hoenn):** ❤️ 3 vidas iniciales, +350 puntos base por respuesta correcta.
* **Sistema de Vidas Estricto:** Cada error o tiempo agotado consume 1 vida. Responder correctamente NO recupera vidas. Al llegar a 0 vidas, se muestra la pantalla de **Game Over**.
* **Rachas y Multiplicadores:**
  * Racha 1 - 4: `x1.0`
  * Racha 5 - 9: `x1.25`
  * Racha 10 - 19: `x1.50`
  * Racha 20 - 29: `x1.75`
  * Racha 30+: `x2.0`
* **Sistema de Pistas Equilibrado (5 pistas iniciales):**
  * **1. Descarte 50/50:** Elimina una opción incorrecta.
  * **2. Revelar Atributo:** Muestra tipos y dimensiones oficiales.
  * **3. Pista Textual:** Proporciona descripción de la especie.
  * **Penalización de Puntuación:** Sin pistas = 100% | 1 pista = 75% | 2 pistas = 50% (el multiplicador de racha se aplica tras la deducción).
* **Récords Independientes por Dificultad:**
  * `highScore.beginner`, `highScore.advanced`, `highScore.master` permanecen guardados y no se borran al reiniciar partida.
* **Autenticación Real y Roles:**
  * Rol **PLAYER**: Acceso a la arena de juego, dashboard y perfil. Si intenta entrar a `/admin`, recibe pantalla **403 Forbidden**.
  * Rol **ADMIN**: Acceso al panel administrativo con gestión de preguntas, variaciones, jugadores, puntuaciones, generaciones y suscripciones.
  * No autenticado: Redirección automática (**401 Unauthorized**) al login (`/`).
  * Ruta inexistente: Pantalla temática personalizada (**404 Not Found**).

---

## 2. Cuentas de Acceso y Demostración

El sistema incluye cuentas precargadas en `db.json` para validación inmediata:

| Usuario | Contraseña | Rol | Pistas | Tipo de Cuenta |
| :--- | :--- | :--- | :--- | :--- |
| **`ash`** | `pikachu123` | **PLAYER** | 5 pistas | Plan Gratuito (Acceso a juego y récords) |
| **`oak`** | `profesor123` | **ADMIN** | 99 pistas | Administrador de la Liga (Acceso a `/admin`) |
| **`misty`** | `starmie123` | **PLAYER** | 15 pistas | Pase Mensual Premium |

---

## 3. Arquitectura del Proyecto

```
c:\Users\Foward\Desktop\juego/
├── n8n/
│   └── workflow.json                # Flujo completo exportado de n8n
├── public/
│   └── pokeball.svg                 # Favicon temático
├── src/
│   ├── components/
│   │   ├── AnswerOption.jsx         # Opción con feedback y soporte descarte 50/50
│   │   ├── ErrorMessage.jsx         # Mensaje amigable de error con reintento
│   │   ├── GameBoard.jsx            # Tablero de supervivencia
│   │   ├── GameHeader.jsx           # HUD con vidas, racha, temporizador y nivel
│   │   ├── GameOverModal.jsx        # Pantalla modal completa de Game Over y récord
│   │   ├── HintPanel.jsx            # Selector de pistas (50/50, atributo, texto)
│   │   ├── LivesDisplay.jsx         # Visualizador dinámico de hasta 5 vidas
│   │   ├── LoadingState.jsx         # Spinner temático de Pokéball animado
│   │   ├── Navigation.jsx           # Barra con sesión, rol activo y enlaces
│   │   ├── ProtectedRoute.jsx       # Guardián de rutas con control 401 y 403
│   │   ├── QuestionCard.jsx         # Tarjeta con silueta, pistas y 4 variantes
│   │   └── ScoreBoard.jsx           # Marcador continuo de supervivencia
│   ├── pages/
│   │   ├── Home.jsx                 # Login unificado con selección de cuenta
│   │   ├── PlayerDashboard.jsx      # Panel del jugador (/jugador)
│   │   ├── Game.jsx                 # Arena de supervivencia infinita (/juego/:nivel)
│   │   ├── Results.jsx              # Historial de partidas y récords (/resultados)
│   │   ├── Instructions.jsx         # Manual de supervivencia (/instrucciones)
│   │   ├── Profile.jsx              # Perfil de usuario y suscripción (/perfil)
│   │   ├── Forbidden403.jsx         # Pantalla 403 Forbidden
│   │   ├── NotFound404.jsx          # Pantalla 404 Not Found
│   │   └── admin/                   # Módulo administrativo completo
│   │       ├── AdminLayout.jsx      # Barra lateral administrativa
│   │       ├── AdminDashboard.jsx   # Métricas y analíticas globales
│   │       ├── AdminQuestions.jsx   # Catálogo con búsqueda, filtros y paginación
│   │       ├── AdminVariations.jsx  # Matriz de 4 variaciones dinámicas
│   │       ├── AdminPlayers.jsx     # Gestión de usuarios y roles
│   │       ├── AdminScores.jsx      # Récords y partidas históricas
│   │       ├── AdminGenerations.jsx # Desglose de Generaciones 1, 2 y 3
│   │       ├── AdminDifficulties.jsx# Configuración de vidas y escalado
│   │       ├── AdminHints.jsx       # Métricas de consumo de pistas
│   │       └── AdminSubscriptions.jsx# Modelos Free vs Premium (1, 1.5 y 2 meses)
│   ├── routes/
│   │   └── AppRoutes.jsx            # Enrutamiento central y protecciones
│   ├── services/
│   │   ├── authService.js           # Validación real de credenciales y roles
│   │   ├── pokemonService.js        # Consumo de PokeAPI, variantes y prefetch
│   │   ├── scoreService.js          # Persistencia en db.json y récords independientes
│   │   └── n8nService.js            # Envío a webhook con AbortController
│   ├── hooks/
│   │   ├── useAuth.js               # Hook reactivo de sesión
│   │   └── useGameTimer.js          # Temporizador con useRef y useCallback
│   ├── utils/
│   │   └── helpers.js               # Algoritmo Fisher-Yates, multiplicadores y etapas
│   ├── App.jsx                      # Layout raíz
│   ├── index.css                    # Estilos oscuros modernos, elegantes y responsivos
│   └── main.jsx                     # Punto de entrada con BrowserRouter
├── db.json                          # Base de datos local (scores, users, records, subscriptions)
├── package.json                     # Scripts y dependencias
├── vite.config.js                   # Configuración de Vite
├── index.html                       # HTML principal
└── README.md                        # Documentación técnica
```

---

## 4. API Utilizada: PokeAPI v2

* **URL Base:** `https://pokeapi.co/api/v2`
* **Endpoints:**
  * `GET /pokemon?limit={limit}&offset={offset}`: Catálogo de Pokémon de la generación seleccionada.
  * `GET /pokemon/{id}`: Detalles completos (ilustraciones oficiales, tipos, estadísticas base, medidas).
* **Variaciones de Preguntas Generadas:**
  1. *¿Quién es este Pokémon?* (Identificación por silueta/artwork).
  2. *¿Cuál es el tipo principal de este Pokémon?* (Evaluación de tipos elementales en español).
  3. *¿A qué generación de videojuegos pertenece este Pokémon?* (Asignación de generación 1, 2, 3 o 4).
  4. *¿Cuál es la estadística base más destacada de este Pokémon?* (Comparativa de valores de combate).

---

## 5. Integración con n8n

* **Archivo de Workflow:** [`n8n/workflow.json`](n8n/workflow.json)
* **URL de Webhook Predeterminada:** `http://localhost:5678/webhook/pokemon-quiz-result`
* **Nodos del Flujo:**
  1. **Webhook Entrenador (Trigger):** Recibe petición HTTP POST con el resumen completo de la partida.
  2. **Validar Datos de Supervivencia (Code):** Sanitiza y valida `playerId`, `score`, `questionsAnswered`, `bestStreak`, `hintsUsed`, `isNewRecord`.
  3. **Procesar Rango y Récord (Code):** Evalúa el rendimiento y asigna rango (*Maestro de la Supervivencia Pokémon*, *Líder de Supervivencia*, o *Aspirante en Práctica*).
  4. **¿Superó el Desafío? (IF):** Comprueba si se alcanzó nuevo récord o puntaje suficiente.
  5. **Respuesta Certificada Aprobado / Reintento (Respond to Webhook):** Devuelve respuesta HTTP 200 con badge y certificación oficial.
* **Manejo en el frontend:** Envía `fetch` con `AbortController` de 3.5 segundos. Si n8n no está corriendo, la partida y el récord quedan guardados de forma segura en `db.json` sin interrumpir la experiencia.

---

## 6. Instrucciones de Instalación y Ejecución

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Iniciar el Servidor de Persistencia (json-server)
En una terminal:
```bash
npm run server
```
*Inicia la base de datos en `http://localhost:3001` gestionando `scores`, `records`, `users` y `subscriptions`.*

### 3. Iniciar la Aplicación Frontend (Vite)
En otra terminal:
```bash
npm run dev
```
*Abre tu navegador en `http://localhost:5173`.*

### 4. (Opcional) Activar el Flujo en n8n
1. En n8n (`http://localhost:5678`), selecciona **Import from File...** y elige `n8n/workflow.json`.
2. Activa el webhook en `/webhook/pokemon-quiz-result`.
3. Al concluir cualquier partida, la evaluación oficial de n8n se procesará en tiempo real.
