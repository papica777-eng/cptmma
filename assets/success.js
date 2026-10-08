/* CPT MMA Form Success Overlay (Lightweight & Self-Contained)
 * Displays a sleek native confirmation card when an enquiry or intake is submitted.
 */
(function () {
  'use strict';
  if (window.CPTSuccess) return;

  function show(formEl, customMsg) {
    if (!formEl) return;
    
    // Create card if not present
    var card = formEl.parentElement.querySelector('.cpt-success-card');
    if (!card) {
      card = document.createElement('div');
      card.className = 'cpt-success-card';
      card.style.cssText = 'background:#111216;border:1px solid #242730;border-radius:12px;padding:32px 24px;text-align:center;animation:cptFadeUp 0.35s ease-out forwards;';
      card.innerHTML = [
        '<div style="width:56px;height:56px;margin:0 auto 18px;border-radius:50%;background:rgba(31,209,95,0.12);display:flex;align-items:center;justify-content:center;color:#1fd15f;">',
        '  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
        '</div>',
        '<h3 style="font-family:Barlow Condensed,Anton,sans-serif;font-size:26px;text-transform:uppercase;letter-spacing:0.04em;color:#fff;margin:0 0 8px;">THANK YOU FOR YOUR ENQUIRY</h3>',
        '<p style="color:#9da2b4;font-size:15px;line-height:1.5;margin:0 0 20px;">' + (customMsg || 'Your message has been sent directly to Sotir. He will get back to you shortly.') + '</p>',
        '<div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">',
        '  <a href="https://wa.me/61423269586?text=Hi%20Sotir,%20I%20just%20submitted%20an%20enquiry%20on%20cptmma.com" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;background:#1fd15f;color:#0a0a0c;padding:10px 18px;border-radius:6px;font-weight:700;font-size:13.5px;text-transform:uppercase;letter-spacing:0.05em;text-decoration:none;">',
        '    <span>Chat on WhatsApp</span>',
        '  </a>',
        '  <button type="button" class="cpt-reset-btn" style="background:transparent;border:1px solid #333846;color:#9da2b4;padding:10px 16px;border-radius:6px;font-size:13px;cursor:pointer;">Send another message</button>',
        '</div>'
      ].join('');

      var styleTag = document.getElementById('cpt-success-css');
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'cpt-success-css';
        styleTag.textContent = '@keyframes cptFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}';
        document.head.appendChild(styleTag);
      }

      formEl.style.display = 'none';
      formEl.parentElement.appendChild(card);

      var resetBtn = card.querySelector('.cpt-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          card.remove();
          formEl.reset();
          formEl.style.display = '';
        });
      }
    }
  }

  window.CPTSuccess = { show: show };
  // Backwards compatibility for existing hooks
  window.ScalusSuccess = { show: show };
})();
