const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
$('#year').textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = $('#menuToggle');
const nav = $('#mainNav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
$$('#mainNav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Scroll progress
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  $('#scrollProgress').style.width = (scrollable > 0 ? window.scrollY / scrollable * 100 : 0) + '%';
}
window.addEventListener('scroll', updateProgress, {passive:true});
updateProgress();

// Reveal-on-scroll animations with a reduced-motion fallback
const revealEls = $$('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 70 + 'ms';
    observer.observe(el);
  });
} else revealEls.forEach(el => el.classList.add('is-visible'));

// Certificate lightbox
const lightbox = $('#lightbox');
$$('.certificate-card[data-image]').forEach(card => card.addEventListener('click', () => {
  $('#lightboxImage').src = card.dataset.image;
  $('#lightboxTitle').textContent = card.dataset.title;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}));
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  $('#lightboxImage').src = '';
}
$('#lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

// Case study modals
$$('[data-modal]').forEach(button => button.addEventListener('click', () => openModal($('#' + button.dataset.modal))));
function openModal(modal) {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}
function closeModal(modal) {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}
$$('[data-close]').forEach(button => button.addEventListener('click', () => closeModal(button.closest('.modal'))));
$$('.modal').forEach(modal => modal.addEventListener('click', e => { if (e.target === modal) closeModal(modal); }));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeLightbox();
    $$('.modal.open').forEach(closeModal);
  }
});

// Contact form: prepare a draft email; configure the address before publishing.
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const subject = encodeURIComponent('Portfolio enquiry: ' + form.get('reason'));
  const body = encodeURIComponent(
    'Name: ' + form.get('name') + '\n' +
    'Email: ' + form.get('email') + '\n' +
    'Reason: ' + form.get('reason') + '\n\n' +
    form.get('message')
  );
  const recipient = 'ashwinid1701@gmail.com'; // Taken from the supplied resume.
  if (!recipient) {
    $('#formHint').textContent = 'Contact form is ready. Add Ashwini’s real email address in script.js to enable the email draft action.';
    $('#formHint').style.color = '#b35b18';
    return;
  }
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});


// Interactive illustrative campaign scenario calculator (not actual performance data).
const budgetRange = $('#budgetRange');
const cpcRange = $('#cpcRange');
const conversionRange = $('#conversionRange');
function formatNumber(n){ return Math.round(n).toLocaleString('en-IN'); }
function updateScenario(){
  if(!budgetRange || !cpcRange || !conversionRange) return;
  const budget = Number(budgetRange.value), cpc = Number(cpcRange.value), rate = Number(conversionRange.value)/100;
  const clicks = budget/cpc;
  const leads = clicks*rate;
  const cpl = leads > 0 ? budget/leads : 0;
  $('#budgetValue').textContent = '₹'+formatNumber(budget);
  $('#cpcValue').textContent = '₹'+cpc;
  $('#conversionValue').textContent = Math.round(rate*100)+'%';
  $('#clickEstimate').textContent = formatNumber(clicks);
  $('#leadEstimate').textContent = formatNumber(leads);
  $('#cplEstimate').textContent = '₹'+formatNumber(cpl);
  $('#rateEstimate').textContent = Math.round(rate*100)+'%';
}
[budgetRange,cpcRange,conversionRange].forEach(input => input && input.addEventListener('input',updateScenario));
updateScenario();
