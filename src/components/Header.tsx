import React from 'react';
import { ContactItem } from '../types/cv';
import { Icon } from './Icons';

interface HeaderProps {
  name: string;
  title?: string;
  contacts: ContactItem[];
}

export const Header: React.FC<HeaderProps> = ({ name, title, contacts }) => {
  return (
    <header className="cv-header">
      <h1 className="cv-name">{name}</h1>
      {title && <div className="cv-title">{title}</div>}
      <div className="cv-contact-list">
        {contacts.map((c, i) => (
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
    </header>
  );
};
