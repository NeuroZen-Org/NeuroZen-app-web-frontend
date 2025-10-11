<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Sección Principal -->
      <div class="footer-main">
        <!-- Información de la Empresa -->
        <div class="footer-section company-info">
          <div class="company-brand">
            <div class="logo">
              <img src="/neurozen1_logo.png" alt="NeuroZen Logo" width="80" height="80" />
            </div>
            <h3>{{ $t('footer.company') }}</h3>
          </div>
          <p class="company-description">
            {{ $t('footer.description') }}
          </p>
          <div class="social-links">
            <a href="#" class="social-link" :aria-label="$t('footer.social.facebook')">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-link" :aria-label="$t('footer.social.twitter')">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-link" :aria-label="$t('footer.social.instagram')">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="social-link" :aria-label="$t('footer.social.linkedin')">
              <i class="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <!-- Enlaces Rápidos -->
        <div class="footer-section">
          <h4>{{ $t('footer.links.about') }}</h4>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">{{ $t('footer.links.about') }}</a></li>
            <li><a href="#" class="footer-link">{{ $t('footer.links.contact') }}</a></li>
            <li><a href="#" class="footer-link">{{ $t('footer.links.privacy') }}</a></li>
            <li><a href="#" class="footer-link">{{ $t('footer.links.terms') }}</a></li>
          </ul>
        </div>

        <!-- Soporte -->
        <div class="footer-section">
          <h4>{{ $t('footer.links.support') }}</h4>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">{{ $t('footer.links.support') }}</a></li>
            <li><a href="#" class="footer-link">{{ $t('header.help') }}</a></li>
            <li><a href="#" class="footer-link">{{ $t('footer.links.blog') }}</a></li>
            <li><router-link to="/professionals" class="footer-link">{{ $t('navigation.professionals') }}</router-link></li>
          </ul>
        </div>

        <!-- Información de Contacto -->
        <div class="footer-section">
          <h4>{{ $t('footer.contact.title') }}</h4>
          <div class="contact-info">
            <div class="contact-item">
              <i class="fas fa-envelope"></i>
              <span>{{ $t('footer.contact.email') }}</span>
            </div>
            <div class="contact-item">
              <i class="fas fa-phone"></i>
              <span>{{ $t('footer.contact.phone') }}</span>
            </div>
            <div class="contact-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>{{ $t('footer.contact.address') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Barra de Copyright -->
      <div class="footer-bottom">
        <div class="copyright">
          <p>{{ $t('footer.copyright') }}</p>
        </div>
        <div class="footer-meta">
          <span class="language-indicator">
            <i class="fas fa-globe"></i>
            {{ currentLanguage }}
          </span>
          <span class="version">v1.0.0</span>
        </div>
      </div>
    </div>

    <!-- Botón de Scroll to Top -->
    <button 
      class="scroll-to-top" 
      @click="scrollToTop" 
      v-show="showScrollTop"
      :aria-label="$t('common.back')"
    >
      <i class="fas fa-arrow-up"></i>
    </button>
  </footer>
</template>

<script>
/**
 * FooterComponent - Componente de pie de página de NeuroZen
 * Contiene información de la empresa, enlaces útiles y funcionalidad de scroll
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 */

export default {
  name: 'FooterComponent',
  data() {
    return {
      showScrollTop: false
    };
  },
  computed: {
    /**
     * Obtiene el nombre del idioma actual para mostrar en el footer
     * @returns {string} Nombre completo del idioma actual
     */
    currentLanguage() {
      const locale = this.$i18n.locale;
      return locale === 'es' ? 'Español' : 'English';
    }
  },
  methods: {
    /**
     * Hace scroll suave hacia el inicio de la página
     */
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
    
    /**
     * Maneja el evento de scroll para mostrar/ocultar el botón de scroll top
     */
    handleScroll() {
      this.showScrollTop = window.scrollY > 300;
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #1f372b 0%, #112719 100%);
  color: #f9fafb;
  margin-top: auto;
  position: relative;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1rem 1rem;
}

.footer-main {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

/* Información de la Empresa */
.company-info {
  max-width: 350px;
}

.company-brand {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.logo {
  margin-right: 0.75rem;
}

.company-brand h3 {
  color: #f9fafb;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.company-description {
  color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

/* Redes Sociales */
.social-links {
  display: flex;
  gap: 0.75rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  color: #d1d5db;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.social-link:hover {
  background: #44b961;
  color: white;
  transform: translateY(-2px);
}

/* Secciones del Footer */
.footer-section h4 {
  color: #f9fafb;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  position: relative;
}

.footer-section h4::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 30px;
  height: 2px;
  background: #197521;
  border-radius: 1px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-link {
  color: #d1d5db;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-link:hover {
  color: #64d464;
  transform: translateX(3px);
}

/* Información de Contacto */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: #d1d5db;
  font-size: 0.9rem;
  line-height: 1.5;
}

.contact-item i {
  color: #13880f;
  width: 16px;
  text-align: center;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

/* Barra Inferior */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright p {
  color: #9ca3af;
  font-size: 0.85rem;
  margin: 0;
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #9ca3af;
  font-size: 0.85rem;
}

.language-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.version {
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 0.75rem;
}

/* Botón Scroll to Top */
.scroll-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: #09551c;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 4px 20px rgba(4, 136, 22, 0.3);
  transition: all 0.3s ease;
  z-index: 100;
}

.scroll-to-top:hover {
  background: #087a24;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(5, 77, 14, 0.4);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .footer-main {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .footer-container {
    padding: 2rem 1rem 1rem;
  }
  
  .footer-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .company-info {
    max-width: none;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .scroll-to-top {
    bottom: 1rem;
    right: 1rem;
    width: 45px;
    height: 45px;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: 1.5rem 0.5rem 1rem;
  }
  
  .company-brand {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .logo {
    margin-right: 0;
  }
  
  .social-links {
    justify-content: center;
    margin-top: 1rem;
  }
  
  .contact-item {
    flex-wrap: wrap;
  }
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.footer-section {
  animation: fadeInUp 0.6s ease-out;
}

.footer-section:nth-child(2) {
  animation-delay: 0.1s;
}

.footer-section:nth-child(3) {
  animation-delay: 0.2s;
}

.footer-section:nth-child(4) {
  animation-delay: 0.3s;
}

/* Efectos de hover mejorados */
.footer-link {
  position: relative;
  overflow: hidden;
}

.footer-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #0a7719;
  transition: width 0.3s ease;
}

.footer-link:hover::before {
  width: 100%;
}

/* Modo oscuro mejorado */
.footer {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* Accesibilidad */
.footer-link:focus,
.social-link:focus,
.scroll-to-top:focus {
  outline: 2px solid #06750f;
  outline-offset: 2px;
}

/* Estados de loading para iconos */
.social-link i,
.contact-item i {
  transition: transform 0.3s ease;
}

.social-link:hover i {
  transform: scale(1.1);
}
</style>
