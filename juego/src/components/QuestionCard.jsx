import React from 'react';
import { AnswerOption } from './AnswerOption';
import { translatePokemonType, getTypeBadgeClass } from '../utils/helpers';
import { HelpCircle, Info, Tag } from 'lucide-react';

export const QuestionCard = ({
  question,
  selectedOption,
  isRevealed,
  onSelectOption,
  disabled,
  disabledOptionIds = [],
  revealedFeatures = false,
  revealedTextClue = false
}) => {
  if (!question) return null;

  return (
    <div className="question-card">
      {/* Cabecera de Categoría y Pregunta */}
      <div className="question-category-tag">
        <Tag size={14} />
        <span>Categoría: {question.category || 'Identificación'}</span>
      </div>

      <div className="pokemon-stage">
        <div className="stage-glow"></div>
        <div className="pokemon-image-container">
          {question.image ? (
            <img
              src={question.image}
              alt={isRevealed ? question.pokemonName : 'Silueta del Pokémon misterioso'}
              className={`pokemon-artwork ${isRevealed ? 'revealed' : 'silhouette'}`}
              style={{
                filter: isRevealed ? 'none' : question.silhouetteFilter
              }}
            />
          ) : (
            <div className="image-placeholder">
              <HelpCircle size={64} />
            </div>
          )}
        </div>

        {/* Pistas reveladas o atributos normales */}
        {(isRevealed || revealedFeatures) && (
          <div className="pokemon-hints animate-fade-in">
            <div className="types-container">
              {question.types?.map((typeName) => (
                <span
                  key={`type-${question.id}-${typeName}`}
                  className={`type-badge ${getTypeBadgeClass(typeName)}`}
                >
                  {translatePokemonType(typeName)}
                </span>
              ))}
            </div>

            <div className="revealed-details">
              <span className="detail-tag">Altura: {question.height}</span>
              <span className="detail-tag">Peso: {question.weight}</span>
            </div>
          </div>
        )}

        {/* Pista textual adicional si fue solicitada */}
        {revealedTextClue && question.clueText && (
          <div className="text-clue-banner animate-fade-in">
            <Info size={16} />
            <span>{question.clueText}</span>
          </div>
        )}
      </div>

      <div className="question-body">
        <h3 className="question-title">
          {isRevealed ? (
            <span className="text-revealed-name">
              Respuesta: <strong className="highlight-pokemon">{question.correctAnswer}</strong>
            </span>
          ) : (
            <span>{question.title || '¿Quién es este Pokémon?'}</span>
          )}
        </h3>

        {/* Lista de opciones con keys estables y únicas */}
        <div className="options-grid">
          {question.options.map((opt) => (
            <AnswerOption
              key={opt.id}
              option={opt}
              onSelect={onSelectOption}
              isSelected={selectedOption?.id === opt.id}
              isRevealed={isRevealed}
              disabled={disabled}
              disabledByHint={disabledOptionIds.includes(opt.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
