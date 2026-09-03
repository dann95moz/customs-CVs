import React from 'react';
import { ExperienceSlotProps } from '../../templates/types';
import { marked } from 'marked';
import { EditableText } from '../studio/preview/EditableText';
import { useCvLiveEdit } from '../studio/preview/CvLiveEditContext';

export type { ExperienceSlotProps };

export const ExperienceSlot: React.FC<ExperienceSlotProps> = ({ 
  data, 
  className = '',
  maxItems
}) => {
  const liveEdit = useCvLiveEdit();
  const displayItems = maxItems ? data.items.slice(0, maxItems) : data.items;
  const isProjects = data.type === 'projects';
  const sectionType = isProjects ? 'projects' : 'experience';

  return (
    <section className={`cv-section section-${data.type} section-block ${className}`}>
      <EditableText
        tagName="h2"
        className="cv-section-title"
        value={data.title}
        onSave={(newTitle) => liveEdit?.updateSectionTitle(sectionType, newTitle)}
        placeholder={isProjects ? 'Personal & Open Source Projects' : 'Work Experience'}
      />
      <div className="experience-list">
        {displayItems.map((item, idx) => (
          <div key={idx} className="experience-item section-block">
            <div className="item-header">
              <EditableText
                tagName="span"
                className="item-company"
                value={item.company}
                htmlContent={item.company ? (marked.parseInline(item.company) as string) : ''}
                onSave={(newVal) => liveEdit?.updateExperienceField(sectionType, idx, 'company', newVal)}
                placeholder={isProjects ? 'Project Title' : 'Company / Organization'}
              />
              {!isProjects && (item.location || liveEdit?.isLiveEditing) && (
                <EditableText
                  tagName="span"
                  className="item-location"
                  value={item.location || ''}
                  onSave={(newVal) => liveEdit?.updateExperienceField(sectionType, idx, 'location', newVal)}
                  placeholder="Location"
                />
              )}
            </div>
            
            {(item.role || (!isProjects && item.date) || liveEdit?.isLiveEditing) && (
              <div className="item-sub-header">
                <EditableText
                  tagName="span"
                  className="item-role"
                  value={item.role || ''}
                  htmlContent={item.role ? (marked.parseInline(item.role) as string) : ''}
                  onSave={(newVal) => liveEdit?.updateExperienceField(sectionType, idx, 'role', newVal)}
                  placeholder={isProjects ? 'Project Links / Stack' : 'Role / Job Title'}
                />
                {!isProjects && (item.date || liveEdit?.isLiveEditing) && (
                  <EditableText
                    tagName="span"
                    className="item-date"
                    value={item.date || ''}
                    onSave={(newVal) => liveEdit?.updateExperienceField(sectionType, idx, 'date', newVal)}
                    placeholder="Date Range"
                  />
                )}
              </div>
            )}

            {item.bullets && item.bullets.length > 0 && (
              <ul className="item-bullets">
                {item.bullets.map((bullet, bIdx) => (
                  <EditableText
                    key={bIdx}
                    tagName="li"
                    value={bullet}
                    onSave={(newBullet) => liveEdit?.updateExperienceBullet(sectionType, idx, bIdx, newBullet)}
                    multiline
                    htmlContent={marked.parseInline(bullet) as string}
                    placeholder="Describe high-impact achievement with metrics..."
                    aiConfig={{
                      type: 'bullet',
                      fieldKey: `${sectionType}-${idx}-${bIdx}`,
                      sectionType,
                      itemIndex: idx,
                      bulletIndex: bIdx,
                      company: item.company,
                      role: item.role,
                    }}
                  />
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
