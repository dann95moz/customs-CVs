import React from 'react';
import { HeaderSlotData, HeaderSlotProps } from '../../templates/types';
import { Icon } from '../Icons';

export type { HeaderSlotProps };

export const HeaderSlot: React.FC<HeaderSlotProps> = ({ 
  data, 
  className = '',
  showContactsInHeader = true 
}) => {
  return (
    <header className={`cv-header ${className}`}>
      <h1 className="cv-name">{data.name}</h1>
      {data.title && <div className="cv-title">{data.title}</div>}
      
      {showContactsInHeader && data.contacts.length > 0 && (
        <div className="cv-contact-list">
          {data.contacts.map((c, i) => (
            <span key={i} className="cv-contact-item">
              <Icon type={c.type} />
              {c.url ? (
                <a href={c.url} target="_blank" rel="noopener noreferrer">
                  {c.label}
                </a>
              ) : (
                <span>{c.label}</span>
              )}
            </span>
          ))}
        </div>
      )}
    </header>
  );
};
