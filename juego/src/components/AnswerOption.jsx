import React from 'react';
import { CheckCircle2, XCircle, Ban } from 'lucide-react';

export const AnswerOption = ({
  option,
  onSelect,
  isSelected,
  isRevealed,
  disabled,
  disabledByHint = false
}) => {
  let statusClass = '';

  if (disabledByHint) {
    statusClass = 'option-hint-eliminated';
  } else if (isRevealed) {
    if (option.isCorrect) {
      statusClass = 'option-correct';
    } else if (isSelected && !option.isCorrect) {
      statusClass = 'option-incorrect';
    } else {
      statusClass = 'option-dimmed';
    }
  } else if (isSelected) {
    statusClass = 'option-selected';
  }

  return (
    <button
      type="button"
      className={`answer-option-button ${statusClass}`}
      onClick={() => onSelect(option)}
      disabled={disabled || disabledByHint}
      aria-label={`Opción: ${option.text}`}
    >
      <span className="option-text">{option.text}</span>

      {disabledByHint && (
        <span className="option-hint-badge" title="Descartado por pista">
          <Ban size={16} /> Descartado
        </span>
      )}

      {isRevealed && option.isCorrect && (
        <CheckCircle2 size={20} className="option-icon icon-success" />
      )}

      {isRevealed && isSelected && !option.isCorrect && (
        <XCircle size={20} className="option-icon icon-error" />
      )}
    </button>
  );
};
