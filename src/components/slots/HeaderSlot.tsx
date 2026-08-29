import React from 'react';
import { HeaderSlotProps } from '../../templates/types';
import { Icon } from '../Icons';
import { EditableText } from '../studio/preview/EditableText';
import { useCvLiveEdit } from '../studio/preview/CvLiveEditContext';

export type { HeaderSlotProps };

export const HeaderSlot: React.FC<HeaderSlotProps> = ({ 
  data, 
  className = '',
  showContactsInHeader = true 
}) => {
  const liveEdit = useCvLiveEdit();

  return (
    <header className={`cv-header ${className}`}>
      <EditableText
        tagName="h1"
        className="cv-name"
        value={data.name}
        onSave={(newName) => liveEdit?.updateName(newName)}
        placeholder="Full Name"
      />
      {(data.title || liveEdit?.isLiveEditing) && (
        <EditableText
          tagName="div"
          className="cv-title"
          value={data.title || ''}
          onSave={(newTitle) => liveEdit?.updateTitle(newTitle)}
          placeholder="Professional Title"
        />
      )}
      
      {showContactsInHeader && data.contacts.length > 0 && (
        <div className="cv-contact-list">
          {data.contacts.map((c, i) => (
            <span key={i} className="cv-contact-item">
              <Icon type={c.type} />
              {c.url && !liveEdit?.isLiveEditing ? (
                <a href={c.url} target="_blank" rel="noopener noreferrer">
                  {c.label}
                </a>
              ) : (
                <EditableText
                  tagName="span"
                  value={c.label}
                  onSave={(newLabel) => liveEdit?.updateContact(i, newLabel)}
                  placeholder="Contact Info"
                />
              )}
            </span>
          ))}
        </div>
      )}
    </header>
  );
};
