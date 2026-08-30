import React from 'react';
import { EducationSlotProps } from '../../templates/types';
import { marked } from 'marked';
import { EditableText } from '../studio/preview/EditableText';
import { useCvLiveEdit } from '../studio/preview/CvLiveEditContext';

export type { EducationSlotProps };

export const EducationSlot: React.FC<EducationSlotProps> = ({ 
  data, 
  className = '',
  maxItems 
}) => {
  const liveEdit = useCvLiveEdit();
  const displayItems = maxItems ? data.items.slice(0, maxItems) : data.items;

  return (
    <section className={`cv-section section-${data.type} section-block ${className}`}>
      <h2 className="cv-section-title">{data.title}</h2>
      <ul className={`${data.type}-list section-block`}>
        {displayItems.map((rawItem, idx) => {
          let item = (rawItem || '').trim();
          // Auto-repair missing leading bold like "Degree** – Institution" or "*Degree** – Institution"
          if (/^\*?[^*]+\*\*/.test(item)) {
            item = item.replace(/^\*?([^*]+)\*\*/, '**$1**');
          } else if (!item.includes('**') && /^[A-Za-z0-9\s.,/&()-]+?\s+[–—\-]\s+/.test(item)) {
            item = item.replace(/^([A-Za-z0-9\s.,/&()-]+?)\s+([–—\-])\s+/, '**$1** $2 ');
          }

          return (
            <EditableText
              key={idx}
              tagName="li"
              value={item}
              onSave={(newVal) => liveEdit?.updateEducationItem(idx, newVal)}
              htmlContent={marked.parseInline(item) as string}
              placeholder="Degree, Institution, Dates..."
            />
          );
        })}
      </ul>
    </section>
  );
};
