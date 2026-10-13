import React from 'react';
import { Heart, Sparkles, GraduationCap, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        {/* Main Clear Attribution Badge */}
        <div className="footer-attribution-wrapper">
          <div className="footer-attribution-card">
            <div className="footer-attribution-text">
              <span>Developed with</span>
              <span className="footer-heart-icon" role="img" aria-label="love">❤️</span>
              <span>by</span>
              <strong className="footer-author-name">Mehraj U Din Mir</strong>
              <span className="footer-hod-tag">(HOD ICT Department GVEI)</span>
            </div>
          </div>
        </div>

        {/* Supporting Meta & Platform Info */}
        <div className="footer-meta-row">
          <div className="footer-brand-summary">
            <span className="footer-brand-title">COVEQUIZ</span>
            <span className="footer-separator">•</span>
            <span>Next-Generation Mathematics Gaming & Classroom Intelligence</span>
          </div>

          <div className="footer-tags">
            <span className="footer-tag-pill">
              <GraduationCap size={13} /> GVEI ICT Department
            </span>
            <span className="footer-tag-pill">
              <ShieldCheck size={13} /> NEP 2020 & NCF-SE 2023 Aligned
            </span>
            <span className="footer-tag-pill">
              <Sparkles size={13} /> Levels 1–8 Interactive Curriculum
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <span>© {new Date().getFullYear()} COVEQUIZ • All rights reserved. Designed for excellence in STEM education.</span>
        </div>
      </div>
    </footer>
  );
};
