import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">🚀</span>
              <span className="logo-text">Nexus SCM</span>
            </div>
            <p className="footer-tagline">
              Streamlining supply chains with intelligent solutions
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Twitter">
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="GitHub">
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3 className="footer-heading">Product</h3>
              <ul className="footer-list">
                <li><Link to="/features" className="footer-link">Features</Link></li>
                <li><Link to="/pricing" className="footer-link">Pricing</Link></li>
                <li><Link to="/integrations" className="footer-link">Integrations</Link></li>
                <li><Link to="/updates" className="footer-link">Updates</Link></li>
                <li><Link to="/api" className="footer-link">API</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Company</h3>
              <ul className="footer-list">
                <li><Link to="/about" className="footer-link">About Us</Link></li>
                <li><Link to="/careers" className="footer-link">Careers</Link></li>
                <li><Link to="/blog" className="footer-link">Blog</Link></li>
                <li><Link to="/press" className="footer-link">Press</Link></li>
                <li><Link to="/contact" className="footer-link">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Resources</h3>
              <ul className="footer-list">
                <li><Link to="/documentation" className="footer-link">Documentation</Link></li>
                <li><Link to="/help-center" className="footer-link">Help Center</Link></li>
                <li><Link to="/community" className="footer-link">Community</Link></li>
                <li><Link to="/partners" className="footer-link">Partners</Link></li>
                <li><Link to="/webinars" className="footer-link">Webinars</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">Legal</h3>
              <ul className="footer-list">
                <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
                <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
                <li><Link to="/cookies" className="footer-link">Cookie Policy</Link></li>
                <li><Link to="/gdpr" className="footer-link">GDPR</Link></li>
                <li><Link to="/security" className="footer-link">Security</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© {currentYear} Nexus SCM. All rights reserved.</p>
            <p className="footer-subtext">
              Streamlining supply chains for businesses worldwide
            </p>
          </div>

          <div className="footer-bottom-links">
            <div className="footer-app-links">
              <a href="#" className="app-link" aria-label="Download on App Store">
                <svg className="app-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.665 16.811a10.316 10.316 0 0 1-1.021 1.837c-.537.767-.978 1.297-1.316 1.592-.585.5-1.212.757-1.878.77-.507 0-1.113-.144-1.818-.437-.705-.293-1.353-.44-1.943-.44-.62 0-1.279.147-1.981.44-.702.293-1.286.445-1.75.456-.64.017-1.275-.26-1.901-.83-.371-.315-.83-.867-1.377-1.654-.587-.84-1.072-1.814-1.454-2.924-.401-1.169-.602-2.3-.602-3.393 0-1.472.334-2.74 1.003-3.802.632-1.003 1.471-1.582 2.518-1.736.64-.064 1.467.193 2.48.771 1.013.578 1.663.869 1.949.869.23 0 .853-.277 1.873-.83 1.02-.554 1.877-.832 2.57-.832.435 0 .99.104 1.667.313.676.209 1.232.314 1.666.314.37 0 .848-.115 1.434-.344.586-.23 1.148-.344 1.686-.344 1.082 0 1.924.416 2.527 1.248-1.002.578-1.792 1.387-2.37 2.427-.577 1.041-.866 2.158-.866 3.352 0 1.239.334 2.385 1.003 3.439.677 1.062 1.497 1.673 2.461 1.835-.197.578-.41 1.108-.64 1.592zM15.998 2.38c0 .95-.348 1.838-1.039 2.659-.836.976-1.846 1.541-2.941 1.452a2.955 2.955 0 0 1-.021-.36c0-.913.396-1.889 1.103-2.688.352-.404.8-.743 1.343-1.015.542-.271 1.053-.409 1.534-.409.014.128.021.255.021.38z"></path>
                </svg>
                <span>App Store</span>
              </a>
              <a href="#" className="app-link" aria-label="Get it on Google Play">
                <svg className="app-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a1.8 1.8 0 0 1-.36-.366L11.647 12 3.249 2.18a1.8 1.8 0 0 1 .36-.366zM14.423 12l4.952 4.955L21.415 18 14.423 12zM21.415 6l-2.04 1.045L14.423 12l4.952 4.955L21.415 18a1.8 1.8 0 0 0 0-12z"></path>
                </svg>
                <span>Google Play</span>
              </a>
            </div>

            <div className="footer-legal-links">
              <Link to="/sitemap" className="footer-legal-link">Sitemap</Link>
              <span className="footer-separator">•</span>
              <Link to="/accessibility" className="footer-legal-link">Accessibility</Link>
              <span className="footer-separator">•</span>
              <Link to="/status" className="footer-legal-link">System Status</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <svg className="arrow-up" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;