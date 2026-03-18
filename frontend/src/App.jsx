import { useState, useEffect } from "react";

const API = "http://127.0.0.1:8000";

function App() {
  const [libri, setLibri] = useState([]);
  const [stats, setStats] = useState(null);
  const [mostraStats, setMostraStats] = useState(false);
  const [form, setForm] = useState({ titolo: "", autore: "", pagine: "" });
  const [ricerca, setRicerca] = useState("");
  const [mostraForm, setMostraForm] = useState(false);

  const caricaLibri = () => {
    fetch(`${API}/libri`)
      .then((res) => res.json())
      .then((data) => setLibri(data));
  };

  useEffect(() => {
    caricaLibri();
  }, []);

  const aggiungiLibro = () => {
    if (!form.titolo || !form.autore || !form.pagine) return;
    fetch(`${API}/libri`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titolo: form.titolo,
        autore: form.autore,
        pagine: parseInt(form.pagine),
        letto: false,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        caricaLibri();
        setForm({ titolo: "", autore: "", pagine: "" });
        setMostraForm(false);
      });
  };

  const toggleLetto = (id) => {
    fetch(`${API}/libri/${id}/toggle`, { method: "PUT" })
      .then((res) => res.json())
      .then(() => caricaLibri());
  };

  const eliminaLibro = (id) => {
    fetch(`${API}/libri/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => caricaLibri());
  };

  const toggleStats = () => {
    if (!mostraStats) {
      fetch(`${API}/libri/statistiche`)
        .then((res) => res.json())
        .then((data) => setStats(data));
    }
    setMostraStats(!mostraStats);
  };

  const libriFiltrati = libri.filter(
    (libro) =>
      !ricerca || libro.autore.toLowerCase().includes(ricerca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Header */}
      <div className="border-b border-stone-800 bg-stone-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              📚 Libreria Personale
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              {libri.length} libri · FastAPI + React
            </p>
          </div>
          <button
            onClick={() => setMostraForm(!mostraForm)}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
          >
            {mostraForm ? "✕ Chiudi" : "+ Aggiungi"}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
        {/* Form aggiunta */}
        {mostraForm && (
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-stone-400 uppercase tracking-wider">
              Nuovo libro
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                placeholder="Titolo"
                value={form.titolo}
                onChange={(e) => setForm({ ...form, titolo: e.target.value })}
                className="bg-stone-800 border border-stone-700 rounded-lg px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none focus:border-amber-500 transition-colors sm:col-span-1"
              />
              <input
                placeholder="Autore"
                value={form.autore}
                onChange={(e) => setForm({ ...form, autore: e.target.value })}
                className="bg-stone-800 border border-stone-700 rounded-lg px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none focus:border-amber-500 transition-colors"
              />
              <div className="flex gap-3">
                <input
                  placeholder="Pagine"
                  type="number"
                  value={form.pagine}
                  onChange={(e) =>
                    setForm({ ...form, pagine: e.target.value })
                  }
                  className="bg-stone-800 border border-stone-700 rounded-lg px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none focus:border-amber-500 transition-colors w-full"
                />
                <button
                  onClick={aggiungiLibro}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm whitespace-nowrap"
                >
                  Salva
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar: ricerca + statistiche */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            placeholder="🔍 Cerca per autore..."
            value={ricerca}
            onChange={(e) => setRicerca(e.target.value)}
            className="bg-stone-900 border border-stone-800 rounded-lg px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none focus:border-amber-500 transition-colors flex-1"
          />
          <button
            onClick={toggleStats}
            className="border border-stone-700 hover:border-stone-500 text-stone-400 hover:text-stone-200 px-4 py-2.5 rounded-lg transition-colors text-sm"
          >
            {mostraStats ? "✕ Chiudi stats" : "📊 Statistiche"}
          </button>
        </div>

        {/* Statistiche */}
        {mostraStats && stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Totale", value: stats.totale, icon: "📚", color: "text-amber-400" },
              { label: "Letti", value: stats.letti, icon: "✅", color: "text-emerald-400" },
              { label: "Da leggere", value: stats.da_leggere, icon: "📖", color: "text-orange-400" },
              { label: "Pagine", value: stats.pagine_totali, icon: "📄", color: "text-sky-400" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-stone-900 border border-stone-800 rounded-xl p-4"
              >
                <div className="text-lg mb-1">{s.icon}</div>
                <div className={`text-2xl font-bold ${s.color}`}>
                  {s.value}
                </div>
                <div className="text-xs text-stone-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Lista libri */}
        <div className="space-y-2">
          {libriFiltrati.map((libro) => (
            <div
              key={libro.id}
              className={`group flex items-center gap-4 p-4 rounded-xl border transition-all hover:translate-x-1 ${libro.letto
                  ? "bg-stone-900/50 border-emerald-900/30"
                  : "bg-stone-900 border-stone-800"
                }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleLetto(libro.id)}
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center text-xs transition-all flex-shrink-0 ${libro.letto
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "border-stone-600 hover:border-amber-500"
                  }`}
              >
                {libro.letto && "✓"}
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div
                  className={`font-semibold transition-all ${libro.letto
                      ? "text-stone-500 line-through"
                      : "text-stone-100"
                    }`}
                >
                  {libro.titolo}
                </div>
                <div className="text-sm text-stone-500">
                  {libro.autore} · {libro.pagine} pag.
                </div>
              </div>

              {/* Badge */}
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${libro.letto
                    ? "bg-emerald-900/40 text-emerald-400"
                    : "bg-amber-900/40 text-amber-400"
                  }`}
              >
                {libro.letto ? "LETTO" : "DA LEGGERE"}
              </span>

              {/* Elimina */}
              <button
                onClick={() => eliminaLibro(libro.id)}
                className="text-stone-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-sm"
              >
                ✕
              </button>
            </div>
          ))}

          {libriFiltrati.length === 0 && (
            <div className="text-center py-12 text-stone-600">
              Nessun libro trovato
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
