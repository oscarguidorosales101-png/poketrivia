import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, HelpCircle, ChevronLeft, ChevronRight, Layers, Database, Sparkles, CheckCircle2 } from 'lucide-react';
import { getAdminQuestionsCatalog } from '../../services/pokemonService';

export const AdminQuestions = () => {
  const [catalog, setCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterGen, setFilterGen] = useState('all');
  const [filterDiff, setFilterDiff] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setIsLoading(true);
    getAdminQuestionsCatalog().then((data) => {
      setCatalog(data || []);
      setIsLoading(false);
    });
  }, []);

  // Filtrado reactivo con useMemo
  const filteredQuestions = useMemo(() => {
    return catalog.filter((q) => {
      const qTitle = q.title || '';
      const qPokemon = q.pokemonName || q.pokemon || '';
      const qAns = q.correctAnswer || '';

      const matchSearch =
        qTitle.toLowerCase().includes(search.toLowerCase()) ||
        qPokemon.toLowerCase().includes(search.toLowerCase()) ||
        qAns.toLowerCase().includes(search.toLowerCase());

      const matchGen = filterGen === 'all' || q.generation === Number(filterGen);
      const matchDiff = filterDiff === 'all' || (q.difficulty || '').toLowerCase() === filterDiff.toLowerCase();
      const matchCategory = filterCategory === 'all' || (q.category || '').toLowerCase() === filterCategory.toLowerCase();

      return matchSearch && matchGen && matchDiff && matchCategory;
    });
  }, [catalog, search, filterGen, filterDiff, filterCategory]);

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage) || 1;
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Catálogo Maestro de Preguntas PokeAPI</h1>
          <p className="admin-page-sub">
            Exploración, auditoría y control de repeticiones sobre cientos de preguntas indexadas desde PokeAPI v2.
          </p>
        </div>
      </div>

      {/* Tarjetas de Resumen de Inventario de Preguntas */}
      <div className="admin-stats-grid mb-4">
        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-blue">
            <Database size={20} />
          </div>
          <div>
            <span className="admin-stat-label">Preguntas en Catálogo</span>
            <span className="admin-stat-val">{catalog.length} preguntas</span>
            <span className="admin-stat-trend">Gen 1, 2 y 3 indexadas</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-gold">
            <Layers size={20} />
          </div>
          <div>
            <span className="admin-stat-label">Variantes Reales</span>
            <span className="admin-stat-val">8 formatos</span>
            <span className="admin-stat-trend">Tipos, debilidades, stats</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon-box bg-green">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="admin-stat-label">Estado de Banco</span>
            <span className="admin-stat-val">100% Activo</span>
            <span className="admin-stat-trend">Control anti-repetición</span>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="admin-filters-bar">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            className="input-search"
            placeholder="Buscar por Pokémon, título o respuesta..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="select-filters-group">
          <select
            value={filterGen}
            onChange={(e) => { setFilterGen(e.target.value); setCurrentPage(1); }}
            className="filter-select"
          >
            <option value="all">Todas las Generaciones</option>
            <option value="1">Generación 1 (Kanto)</option>
            <option value="2">Generación 2 (Johto)</option>
            <option value="3">Generación 3 (Hoenn)</option>
          </select>

          <select
            value={filterDiff}
            onChange={(e) => { setFilterDiff(e.target.value); setCurrentPage(1); }}
            className="filter-select"
          >
            <option value="all">Todas las Dificultades</option>
            <option value="Principiante">Principiante</option>
            <option value="Avanzado">Avanzado</option>
            <option value="Maestro">Maestro</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
            className="filter-select"
          >
            <option value="all">Todas las Categorías</option>
            <option value="Identificación">Identificación</option>
            <option value="Tipos Elementales">Tipos Elementales</option>
            <option value="Generaciones">Generaciones</option>
            <option value="Estadísticas">Estadísticas</option>
          </select>
        </div>
      </div>

      {/* Tabla Paginada de Preguntas */}
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pregunta</th>
              <th>Pokémon</th>
              <th>Gen</th>
              <th>Dificultad</th>
              <th>Categoría</th>
              <th>Respuesta Correcta</th>
              <th>Usos</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {paginatedQuestions.map((q) => (
              <tr key={q.id}>
                <td className="font-mono text-muted">{q.id}</td>
                <td className="font-bold">{q.title}</td>
                <td>{q.pokemon}</td>
                <td>Gen {q.generation}</td>
                <td>
                  <span className={`badge-diff-tag diff-${q.difficulty.toLowerCase()}`}>
                    {q.difficulty}
                  </span>
                </td>
                <td>{q.category}</td>
                <td className="text-success font-bold">{q.correctAnswer}</td>
                <td>{q.uses}</td>
                <td>
                  <span className="status-pill active">Activa</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="pagination-footer">
        <span className="pagination-info">
          Mostrando {paginatedQuestions.length} de {filteredQuestions.length} preguntas encontradas
        </span>

        <div className="pagination-buttons">
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} /> Anterior
          </button>
          <span className="page-indicator">
            Página {currentPage} de {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
