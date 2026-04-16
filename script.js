/* ============================================
   ENKELT FOR DEG – Felles JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. MOBILMENY TOGGLE ── */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobilMeny = document.querySelector('.nav__mobil');

  if (hamburger && mobilMeny) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('aapen');
      mobilMeny.classList.toggle('aktiv');

      // Tilgjengelighet
      const erAapen = mobilMeny.classList.contains('aktiv');
      hamburger.setAttribute('aria-expanded', erAapen);
      hamburger.setAttribute('aria-label', erAapen ? 'Lukk meny' : 'Åpne meny');
    });

    // Lukk meny når en lenke trykkes
    mobilMeny.querySelectorAll('a').forEach(function (lenke) {
      lenke.addEventListener('click', function () {
        hamburger.classList.remove('aapen');
        mobilMeny.classList.remove('aktiv');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ── 2. AKTIV NAVIGASJONSLENKE ── */
  const gjeldendeSide = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__lenker a, .nav__mobil a').forEach(function (lenke) {
    const href = lenke.getAttribute('href');
    if (href === gjeldendeSide || (gjeldendeSide === '' && href === 'index.html')) {
      lenke.classList.add('aktiv');
    }
  });

  /* ── 3. FADE-INN ANIMASJONER MED INTERSECTION OBSERVER ── */
  const fadeElementer = document.querySelectorAll('.fade-inn');

  if ('IntersectionObserver' in window && fadeElementer.length > 0) {
    const observerValg = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function (oppfoeringer) {
      oppfoeringer.forEach(function (oppfoering) {
        if (oppfoering.isIntersecting) {
          oppfoering.target.classList.add('synlig');
          observer.unobserve(oppfoering.target);
        }
      });
    }, observerValg);

    fadeElementer.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback for eldre nettlesere
    fadeElementer.forEach(function (el) {
      el.classList.add('synlig');
    });
  }

  /* ── 4. JEVN SKROLLING FOR ANKERLENKER ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (lenke) {
    lenke.addEventListener('click', function (e) {
      const maal = document.querySelector(this.getAttribute('href'));
      if (maal) {
        e.preventDefault();
        const navHoyde = document.querySelector('.nav')?.offsetHeight || 0;
        const posisjon = maal.getBoundingClientRect().top + window.pageYOffset - navHoyde - 16;
        window.scrollTo({ top: posisjon, behavior: 'smooth' });
      }
    });
  });

  /* ── 5. KONTAKTSKJEMA (enkel validering) ── */
  const skjema = document.querySelector('.kontakt__skjema');
  if (skjema) {
    skjema.addEventListener('submit', function (e) {
      e.preventDefault();

      const navn = skjema.querySelector('#navn')?.value.trim();
      const epost = skjema.querySelector('#epost')?.value.trim();
      const melding = skjema.querySelector('#melding')?.value.trim();

      if (!navn || !epost || !melding) {
        visVarsel(skjema, 'Vennligst fyll ut alle feltene.', 'feil');
        return;
      }

      if (!epost.includes('@') || !epost.includes('.')) {
        visVarsel(skjema, 'Sjekk at e-postadressen er riktig skrevet.', 'feil');
        return;
      }

      // Simulert innsending (bytt ut med ekte backend / Formspree e.l.)
      visVarsel(skjema, '✅ Takk! Vi tar kontakt med deg snart.', 'suksess');
      skjema.reset();
    });
  }

  function visVarsel(skjema, tekst, type) {
    let varsel = skjema.querySelector('.varsel');
    if (!varsel) {
      varsel = document.createElement('div');
      varsel.className = 'varsel';
      skjema.appendChild(varsel);
    }
    varsel.textContent = tekst;
    varsel.className = 'varsel varsel--' + type;
    varsel.style.cssText = 'margin-top:16px;padding:14px 20px;border-radius:10px;font-weight:600;font-size:1rem;';
    if (type === 'suksess') {
      varsel.style.background = '#E8F5F0';
      varsel.style.color = '#124D36';
      varsel.style.border = '2px solid #B8DDD0';
    } else {
      varsel.style.background = '#FEE8E8';
      varsel.style.color = '#8B1A1A';
      varsel.style.border = '2px solid #F5B8B8';
    }
  }

});
