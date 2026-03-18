from fastapi import FastAPI, Query

from pydantic import BaseModel
from typing import Optional

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
class Libro(BaseModel):
    id: int = None
    titolo: str
    autore: str
    pagine: int
    letto: bool = False

contatore_id = 4  

libri = [
    Libro(id=1, titolo="La banalità del male", autore="Hannah Arendt", pagine=320, letto=True),
    Libro(id=2, titolo="Fenomenologia della percezione", autore="Merleau-Ponty", pagine=560),
    Libro(id=3, titolo="Il Principe", autore="Machiavelli", pagine=140),
]

# GET tutti i libri
@app.get("/libri")
def get_libri():
    return libri

# POST aggiungi libro 
@app.post("/libri")
def aggiungi_libro(libro: Libro):
    global contatore_id
    libro.id = contatore_id
    contatore_id += 1
    libri.append(libro)
    return {"msg": "Aggiunto!", "libro": libro}

# GET cerca — 
@app.get("/libri/cerca")
def cerca(autore: Optional[str] = None, letto: Optional[bool] = None):
    risultati = libri
    if autore:
        risultati = [l for l in risultati if l.autore == autore]
    if letto is not None:
        risultati = [l for l in risultati if l.letto == letto]
    return risultati

# GET statistiche 
@app.get("/libri/statistiche")
def statistiche():
    totale = len(libri)
    letti = sum(1 for l in libri if l.letto)
    return {
        "totale": totale,
        "letti": letti,
        "da_leggere": totale - letti,
        "pagine_totali": sum(l.pagine for l in libri),
    }

# GET classifica 
@app.get("/libri/classifica")
def classifica():
    return sorted(libri, key=lambda x: x.pagine, reverse=True)


@app.put("/libri/{libro_id}/toggle")
def toggle_letto(libro_id: int):
    for libro in libri:
        if libro.id == libro_id:
            libro.letto = not libro.letto
            return libro
    return {"errore": "Libro non trovato"}

@app.delete("/libri/{libro_id}")
def elimina_libro(libro_id: int):
    global libri
    libri = [l for l in libri if l.id != libro_id]
    return {"msg": "Eliminato!"}