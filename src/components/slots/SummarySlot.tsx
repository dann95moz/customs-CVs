import React from 'react';
import { SummarySlotProps } from '../../templates/types';
import { marked } from 'marked';
import { EditableText } from '../studio/preview/EditableText';
import { useCvLiveEdit } from '../studio/preview/CvLiveEditContext';

export type { SummarySlotProps };

export const SummarySlot: React.FC<SummarySlotProps> = ({ data, className = '' }) => {
  const liveEdit = useCvLiveEdit();

  return (
    <section className={`cv-section section-summary section-block ${className}`}>
      <h2 className="cv-section-title">{data.title}</h2>
      <EditableText
        tagName="div"
        className="cv-summary"
        value={data.rawContent}
        onSave={(newSummary) => liveEdit?.updateSummary(newSummary)}
        multiline
        htmlContent={marked.parse(data.rawContent) as string}
        aiConfig={{
          type: 'summary',
          fieldKey: 'summary-main',
        }}
      />
    </section>
  );
};
