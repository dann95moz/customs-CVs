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
        {displayItems.map((item, idx) => (
          <EditableText
            key={idx}
            tagName="li"
            value={item}
            onSave={(newVal) => liveEdit?.updateEducationItem(idx, newVal)}
            htmlContent={marked.parseInline(item) as string}
            placeholder="Degree, Institution, Dates..."
          />
        ))}
      </ul>
    </section>
  );
};
