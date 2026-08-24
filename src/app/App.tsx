import React, { useState, useEffect, useMemo } from 'react';
import { parseCvMarkdownToData } from '../core/parser';
import { CVRenderer } from '../components/CVRenderer';
import { ThemeId, MarkdownFileItem } from '../types/cv';
import { Icon } from '../components/Icons';
import './App.css';

const DEFAULT_SAMPLE_MD = `# ALEJANDRO GÓMEZ
**Senior Fullstack Engineer | TypeScript, Node.js & Distributed Systems**  
Bogotá, Colombia (Disponible Remoto) • alejandro.dev@gmail.com • +57 300 1234567  
[linkedin.com/in/alejandro-dev](https://linkedin.com) • [github.com/alejandro-dev](https://github.com) • [alejandro.dev](https://alejandro.dev)

---

## RESUMEN PROFESIONAL
Senior Fullstack Engineer con más de 6 años de experiencia especializándose en sistemas distribuidos de pagos, arquitecturas de microservicios resilientes y computación en la nube (AWS). Historial comprobado de optimización de pipelines transaccionales procesando +1.5M de operaciones mensuales con reducción de latencia del 38%.

---

## HABILIDADES TÉCNICAS
- **Lenguajes & Backend:** TypeScript, Node.js, NestJS, Python, SQL, Express.js, Go
- **Frontend & Web:** React, Next.js, TailwindCSS, State Management, Responsive Design
- **Bases de Datos & Cloud:** PostgreSQL, Redis, Apache Kafka, AWS (ECS, Lambda, RDS), Docker

---

## EXPERIENCIA LABORAL

### **FinPay Global** | Remoto (EE.UU. / LATAM)
*Senior Backend & Fullstack Engineer* | **Ene 2023 – Presente**
- **Diseñar y desplegar el pipeline de procesamiento asíncrono** con Apache Kafka y Redis, reduciendo los errores por timeout en un **42%** durante picos de alto tráfico (+2M de usuarios).
- **Liderar la migración de base de datos PostgreSQL de 800GB** hacia AWS Aurora con sharding horizontal, incrementando el throughput de consultas concurrentes en **3.5x**.
- **Implementar instrumentación y observabilidad de punta a punta** con Datadog, reduciendo el MTTR de 45 a **12 minutos**.

---

### **LogiTech SaaS** | Híbrido (Bogotá, Colombia)
*Fullstack Software Developer* | **Mar 2020 – Dic 2022**
- **Crear la arquitectura del portal de clientes con Next.js y TypeScript**, incrementando el puntaje de rendimiento en Google Lighthouse de 58 a **96**.
- **Automatizar el flujo de facturación electrónica**, ahorrando más de **120 horas mensuales** al equipo contable.

---

## EDUCACIÓN Y CERTIFICACIONES
- **Licenciatura en Ingeniería de Software** — Universidad Nacional, 2019
- **AWS Certified Solutions Architect – Associate** — Amazon Web Services, 2023

---

## IDIOMAS
- **Español:** Nativo
- **Inglés:** C1 – Avanzado / Fluido Profesional
`;

export const App: React.FC = () => {
  const [files, setFiles] = useState<MarkdownFileItem[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('');
  const [markdownContent, setMarkdownContent] = useState<string>(DEFAULT_SAMPLE_MD);
  const [theme, setTheme] = useState<ThemeId>('modern-tech');

  // Load available files from local API
  useEffect(() => {
    fetch('/api/files')
      .then(res => res.json())
      .then((data: MarkdownFileItem[]) => {
        if (data && data.length > 0) {
          setFiles(data);
          setSelectedFilePath(data[0].path);
          setMarkdownContent(data[0].content);
        }
      })
      .catch(() => {
        // Fallback to sample if API not reachable
        setFiles([{ name: 'Ejemplo Base', path: 'sample.md', content: DEFAULT_SAMPLE_MD }]);
      });
  }, []);

  const handleFileChange = (path: string) => {
    setSelectedFilePath(path);
    const file = files.find(f => f.path === path);
    if (file) {
      setMarkdownContent(file.content);
    }
  };

  const parsedCv = useMemo(() => {
    return parseCvMarkdownToData(markdownContent);
  }, [markdownContent]);

  // Statistics
  const stats = useMemo(() => {
    const words = markdownContent.trim().split(/\s+/).length;
    let bulletsCount = 0;
    if (parsedCv.experience) {
      bulletsCount += parsedCv.experience.reduce((acc, curr) => acc + curr.bullets.length, 0);
    }
    if (parsedCv.projects) {
      bulletsCount += parsedCv.projects.reduce((acc, curr) => acc + curr.bullets.length, 0);
    }
    const skillsCount = parsedCv.skillGroups?.reduce((acc, curr) => acc + curr.skills.length, 0) || 0;

    return { words, bulletsCount, skillsCount, contactsCount: parsedCv.contacts.length };
  }, [markdownContent, parsedCv]);

  return (
    <div className="studio-app">
      {/* Top Navbar */}
      <header className="studio-navbar">
        <div className="studio-brand">
          <Icon type="sparkles" size={18} />
          <span className="brand-text">CV Studio Pro</span>
          <span className="badge-ts">React + TS</span>
        </div>

        <div className="studio-controls">
          {files.length > 0 && (
            <div className="control-item">
              <label htmlFor="file-select">📄 Archivo:</label>
              <select
                id="file-select"
                className="studio-select"
                value={selectedFilePath}
                onChange={e => handleFileChange(e.target.value)}
              >
                {files.map(f => (
                  <option key={f.path} value={f.path}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="theme-pills">
            <button
              className={`theme-pill ${theme === 'modern-tech' ? 'active' : ''}`}
              onClick={() => setTheme('modern-tech')}
            >
              Modern Tech
            </button>
            <button
              className={`theme-pill ${theme === 'executive' ? 'active' : ''}`}
              onClick={() => setTheme('executive')}
            >
              Executive
            </button>
            <button
              className={`theme-pill ${theme === 'minimal-ats' ? 'active' : ''}`}
              onClick={() => setTheme('minimal-ats')}
            >
              Minimal ATS
            </button>
            <button
              className={`theme-pill ${theme === 'two-column' ? 'active' : ''}`}
              onClick={() => setTheme('two-column')}
            >
              2 Columnas
            </button>
          </div>

          <button className="studio-btn" onClick={() => window.print()}>
            <Icon type="download" /> Imprimir / Guardar PDF
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="studio-body">
        <main className="preview-area">
          <div className="paper-sheet">
            <CVRenderer data={parsedCv} theme={theme} />
          </div>
        </main>

        {/* Sidebar Inspector */}
        <aside className="stats-sidebar">
          <div className="stats-card">
            <h4>📊 Métricas del CV</h4>
            <div className="stat-row">
              <span>Palabras totales:</span>
              <strong>{stats.words}</strong>
            </div>
            <div className="stat-row">
              <span>Logros (Bullets XYZ):</span>
              <strong>{stats.bulletsCount}</strong>
            </div>
            <div className="stat-row">
              <span>Habilidades listadas:</span>
              <strong>{stats.skillsCount}</strong>
            </div>
            <div className="stat-row">
              <span>Canales de contacto:</span>
              <strong>{stats.contactsCount}</strong>
            </div>
          </div>

          <div className="stats-card">
            <h4>🛡️ Reglas y ATS</h4>
            <div className="stat-row">
              <span>Fórmula Google XYZ:</span>
              <strong style={{ color: '#10b981' }}>✓ Activa</strong>
            </div>
            <div className="stat-row">
              <span>Sin foto ni edad:</span>
              <strong style={{ color: '#10b981' }}>✓ Cumple</strong>
            </div>
            <div className="stat-row">
              <span>Fuente de Verdad:</span>
              <strong>master-data.md</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
