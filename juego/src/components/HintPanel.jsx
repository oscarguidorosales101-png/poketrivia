import React from 'react';
import { HelpCircle, Eye, FileText, Ban } from 'lucide-react';

export const HintPanel = ({
  hintsRemaining = 5,
  hintsUsedOnCurrentQuestion = 0,
  onUseHint5050,
  onUseHintFeature,
  onUseHintText,
  is5050Used = false,
  isFeatureUsed = false,
  isTextUsed = false,
  disabled = false
}) => {
  const noHintsLeft = hintsRemaining <= 0;

  return (
    <div className="hint-panel-container">
      <div className="hint-panel-header">
        <div className="hint-counter-badge">
          <HelpCircle size={16} />
          <span>
            Pistas disponibles: <strong>{hintsRemaining}</strong>
          </span>
        </div>
        <span className="hint-penalty-note">
          {hintsUsedOnCurrentQuestion === 0
            ? 'Sin pistas: 100% pts'
            : hintsUsedOnCurrentQuestion === 1
            ? '1 pista: 75% pts'
            : '2+ pistas: 50% pts'}
        </span>
      </div>

      <div className="hint-buttons-grid">
        {/* Pista 1: Descarte 50/50 */}
        <button
          type="button"
          className="btn-hint"
          onClick={onUseHint5050}
          disabled={disabled || noHintsLeft || is5050Used}
          title="Elimina una opción incorrecta"
        >
          <Ban size={16} />
          <span>Descartar Opción</span>
          {is5050Used && <span className="hint-tag-used">Usada</span>}
        </button>

        {/* Pista 2: Revelar Característica */}
        <button
          type="button"
          className="btn-hint"
          onClick={onUseHintFeature}
          disabled={disabled || noHintsLeft || isFeatureUsed}
          title="Revela atributos clave del Pokémon"
        >
          <Eye size={16} />
          <span>Revelar Atributo</span>
          {isFeatureUsed && <span className="hint-tag-used">Usada</span>}
        </button>

        {/* Pista 3: Pista Textual */}
        <button
          type="button"
          className="btn-hint"
          onClick={onUseHintText}
          disabled={disabled || noHintsLeft || isTextUsed}
          title="Muestra un dato descriptivo oficial"
        >
          <FileText size={16} />
          <span>Pista Textual</span>
          {isTextUsed && <span className="hint-tag-used">Usada</span>}
        </button>
      </div>
    </div>
  );
};
