import React from 'react';
import { GenericSlotProps } from '../../templates/types';
import { safeMarkdown } from '../../utils/sanitize';
import { EditableText } from '../studio/preview/EditableText';
import { useCvLiveEdit } from '../studio/preview/CvLiveEditContext';

export type { GenericSlotProps };

export const GenericSlot: React.FC<GenericSlotProps> = ({ data, className = '' }) => {
  const liveEdit = useCvLiveEdit();

  return (
    <section key={data.id} className={`cv-section section-generic section-block ${className}`}>
      <EditableText
        tagName="h2"
        className="cv-section-title"
        value={data.title}
        onSave={(newTitle) => liveEdit?.updateSectionTitle(data.id, newTitle)}
        placeholder="Section Title"
      />
      <div 
        className="cv-content" 
        dangerouslySetInnerHTML={{ __html: safeMarkdown(data.rawContent) }} 
      />
    </section>
  );
};

