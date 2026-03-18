# 📚 Libreria Personale

App full-stack per gestire la propria libreria personale. Frontend in React, backend in FastAPI con API REST completa: aggiungi libri, segnali come letti, cerca per autore e consulta le statistiche della tua collezione.

---

## Panoramica

Libreria Personale è un'applicazione CRUD che permette di tenere traccia dei libri posseduti, del loro stato di lettura e di visualizzare statistiche aggregate. Il backend espone un'API RESTful con FastAPI e Pydantic per la validazione, il frontend consuma l'API con fetch e gestisce lo stato con React hooks.

## Funzionalità

- **Aggiungi libri** — Form con titolo, autore e numero di pagine. Validazione client-side e assegnazione automatica dell'ID.
- **Toggle letto/da leggere** — Checkbox per segnare un libro come letto, con feedback visivo (barrato, badge colorato).
- **Elimina libri** — Rimozione con bottone che appare al hover.
- **Ricerca per autore** — Filtro in tempo reale sulla lista.
- **Statistiche** — Pannello con totale libri, letti, da leggere e pagine totali.
- **Classifica** — Endpoint per ordinare i libri per numero di pagine.

## Tech Stack

| Tecnologia | Ruolo |
|---|---|
| **React 19** | UI e gestione dello stato |
| **Tailwind CSS 4** | Styling utility-first |
| **Vite 8** | Build tool frontend |
| **FastAPI** | API REST backend |
| **Pydantic** | Validazione dei dati |

## API Endpoints

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/libri` | Lista di tutti i libri |
| `POST` | `/libri` | Aggiungi un nuovo libro |
| `GET` | `/libri/cerca` | Cerca per autore e/o stato lettura |
| `GET` | `/libri/statistiche` | Totale, letti, da leggere, pagine |
| `GET` | `/libri/classifica` | Libri ordinati per pagine (desc) |
| `PUT` | `/libri/{id}/toggle` | Cambia stato letto/non letto |
| `DELETE` | `/libri/{id}` | Elimina un libro |

## Struttura del Progetto

```
app_python_react/
├── backend/
│   └── main.py              # FastAPI: modelli, endpoints, CORS
└── frontend/
    ├── src/
    │   ├── App.jsx           # Componente principale (CRUD + UI)
    │   └── main.jsx          # Entry point
    ├── package.json
    └── vite.config.js
```

## Installazione

### Backend

```bash
cd app_python_react/backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload
```

Il server sarà disponibile su `http://127.0.0.1:8000`. La documentazione interattiva delle API è su `http://127.0.0.1:8000/docs`.

### Frontend

```bash
cd app_python_react/frontend
npm install
npm run dev
```

Il frontend sarà disponibile su `http://localhost:5173`.

## Licenza

MIT
