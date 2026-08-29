import React from 'react';
import { LanguagesSlotProps } from '../../templates/types';
import { marked } from 'marked';
import { EditableText } from '../studio/preview/EditableText';
import { useCvLiveEdit } from '../studio/preview/CvLiveEditContext';

export type { LanguagesSlotProps };

export const LanguagesSlot: React.FC<LanguagesSlotProps> = ({ data, className = '' }) => {
  const liveEdit = useCvLiveEdit();

  return (
    <section className={`cv-section section-languages section-block ${className}`}>
      <h2 className="cv-section-title">{data.title}</h2>
      <ul className="languages-list section-block">
        {data.items.map((item, idx) => (
          <EditableText
            key={idx}
            tagName="li"
            value={item}
            onSave={(newVal) => liveEdit?.updateLanguageItem(idx, newVal)}
            htmlContent={marked.parseInline(item) as string}
            placeholder="Language (Proficiency Level)..."
          />
        ))}
      </ul>
    </section>
  );
};
