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

      const erAapen = mobilMeny.classList.contains('aktiv');
      hamburger.setAttribute('aria-expanded', erAapen);
      hamburger.setAttribute('aria-label', erAapen ? 'Lukk meny' : 'Åpne meny');
    });

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

  /* ── 3. FADE-INN ANIMASJONER ── */
  const fadeElementer = document.querySelectorAll('.fade-inn');

  if ('IntersectionObserver' in window && fadeElementer.length > 0) {
    const observer = new IntersectionObserver(function (oppfoeringer) {
      oppfoeringer.forEach(function (oppfoering) {
        if (oppfoering.isIntersecting) {
          oppfoering.target.classList.add('synlig');
          observer.unobserve(oppfoering.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

    fadeElementer.forEach(function (el) { observer.observe(el); });
  } else {
    fadeElementer.forEach(function (el) { el.classList.add('synlig'); });
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

  /* ── 5. KONTAKTSKJEMA – sender til Formspree via fetch ── */
  const skjema = document.querySelector('.kontakt__skjema');
  if (skjema) {
    skjema.addEventListener('submit', function (e) {
      e.preventDefault();

      const navn = skjema.querySelector('#navn')?.value.trim();
      const epost = skjema.querySelector('#epost')?.value.trim();
      const melding = skjema.querySelector('#melding')?.value.trim();
      const knapp = skjema.querySelector('button[type="submit"]');

      if (!navn || !epost || !melding) {
        visVarsel('Vennligst fyll ut alle feltene.', 'feil');
        return;
      }
      if (!epost.includes('@') || !epost.includes('.')) {
        visVarsel('Sjekk at e-postadressen er riktig skrevet.', 'feil');
        return;
      }

      knapp.disabled = true;
      knapp.textContent = 'Sender...';

      fetch(skjema.action, {
        method: 'POST',
        body: new FormData(skjema),
        headers: { 'Accept': 'application/json' }
      })
      .then(function (res) {
        if (res.ok) {
          visVarsel('Takk! Jeg svarer deg så snart som mulig.', 'suksess');
          skjema.reset();
        } else {
          visVarsel('Noe gikk galt. Prøv igjen eller ring meg direkte.', 'feil');
        }
      })
      .catch(function () {
        visVarsel('Noe gikk galt. Prøv igjen eller ring meg direkte.', 'feil');
      })
      .finally(function () {
        knapp.disabled = false;
        knapp.textContent = 'Send melding →';
      });
    });
  }

  function visVarsel(tekst, type) {
    const skjema = document.querySelector('.kontakt__skjema');
    let varsel = skjema.querySelector('.varsel');
    if (!varsel) {
      varsel = document.createElement('div');
      varsel.className = 'varsel';
      skjema.appendChild(varsel);
    }
    varsel.textContent = tekst;
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
