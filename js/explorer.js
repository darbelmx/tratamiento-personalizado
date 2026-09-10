(function () {
  var panel = document.getElementById('explorer-panel');
  if (!panel) return;

  var ROOT_LABEL = 'Padecimientos y áreas de aplicación';

  var ICON = {
    onco: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none"/></svg>',
    autoinmune: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5c-3 3.8-5.5 7-5.5 10a5.5 5.5 0 0 0 11 0c0-3-2.5-6.2-5.5-10z"/><path d="M12 12.5c-1 1.2-1.6 2-1.6 3a1.6 1.6 0 0 0 3.2 0c0-1-.6-1.8-1.6-3z"/></svg>',
    inmune: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5l7 2.5v5c0 4.5-3 7.7-7 9.5-4-1.8-7-5-7-9.5V6z"/><path d="M9 12l2 2 4-4.2"/></svg>',
    regen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 0 1 13.6-5.7M20 12a8 8 0 0 1-13.6 5.7"/><path d="M17.6 4v3.2h-3.2M6.4 20v-3.2h3.2"/></svg>',
    metab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h3.5l1.8-5 3.4 10 2-8.5 1.4 3.5H21"/></svg>'
  };

  var ARROW_RIGHT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var ARROW_LEFT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';

  var DATA = [
    {
      name: 'Inmuno-Oncología',
      icon: ICON.onco,
      subcats: [
        { name: 'Tipos de cáncer', items: [
          'Cáncer de pulmón', 'Cáncer de mama', 'Cáncer colorrectal', 'Cáncer gástrico',
          'Cáncer de hígado', 'Cáncer renal', 'Cáncer de vejiga', 'Cáncer cervicouterino',
          'Melanoma', 'Cáncer de cabeza y cuello', 'Linfoma de Hodgkin'
        ]}
      ]
    },
    {
      name: 'Enfermedades Autoinmunes',
      icon: ICON.autoinmune,
      subcats: [
        { name: 'Reumatológicas', items: ['Artritis reumatoide', 'Lupus eritematoso sistémico', 'Síndrome de Sjögren', 'Esclerodermia'] },
        { name: 'Neurológicas', items: ['Esclerosis múltiple', 'Miastenia gravis', 'Neuromielitis óptica'] },
        { name: 'Endocrinas', items: ['Diabetes mellitus tipo 1', 'Tiroiditis de Hashimoto', 'Enfermedad de Graves', 'Enfermedad de Addison autoinmune'] },
        { name: 'Digestivas', items: ['Enfermedad de Crohn', 'Colitis ulcerosa', 'Enfermedad celíaca'] },
        { name: 'Dermatológicas', items: ['Psoriasis', 'Vitíligo', 'Alopecia areata'] }
      ]
    },
    {
      name: 'Sistema Inmunológico',
      icon: ICON.inmune,
      subcats: [
        { name: 'Inmunodeficiencias', items: ['Inmunodeficiencias primarias', 'Inmunodeficiencias secundarias'] },
        { name: 'Alteraciones inmunológicas', items: ['Alteraciones de la respuesta inmunitaria'] },
        { name: 'Infecciones recurrentes', items: ['Infecciones recurrentes asociadas a alteraciones inmunológicas'] }
      ]
    },
    {
      name: 'Medicina Regenerativa y Musculoesquelética',
      icon: ICON.regen,
      subcats: [
        { name: 'Articulaciones', items: ['Osteoartritis de rodilla', 'Osteoartritis de cadera', 'Degeneración articular'] },
        { name: 'Tendones', items: ['Tendinopatías', 'Epicondilitis', 'Tendinopatía de Aquiles', 'Tendinopatía del manguito rotador'] },
        { name: 'Músculos', items: ['Lesiones musculares'] },
        { name: 'Ligamentos y tejidos', items: ['Lesiones ligamentarias', 'Reparación tisular'] }
      ]
    },
    {
      name: 'Neuroendocrino y Metabólico',
      icon: ICON.metab,
      subcats: [
        { name: 'Metabólicas', items: ['Diabetes mellitus tipo 2', 'Resistencia a la insulina', 'Alteraciones metabólicas'] },
        { name: 'Neuroendocrinas', items: ['Alteraciones de regulación hormonal', 'Alteraciones del eje hipotálamo-hipófisis'] },
        { name: 'Ritmos biológicos', items: ['Alteraciones del ritmo circadiano', 'Alteraciones del ciclo sueño-vigilia'] }
      ]
    }
  ];

  var state = { level: 1, areaIndex: null, subcatIndex: null };

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderLevel1() {
    var cards = DATA.map(function (area, i) {
      var num = String(i + 1).padStart(2, '0');
      return (
        '<button type="button" class="explorer-area-card" data-area="' + i + '">' +
          '<span class="explorer-area-top">' +
            '<span class="explorer-num">' + num + '</span>' +
            '<span class="icon-wrap">' + area.icon + '</span>' +
          '</span>' +
          '<span class="explorer-area-name">' + escapeHtml(area.name) + '</span>' +
          '<span class="explorer-cta">Explorar ' + ARROW_RIGHT + '</span>' +
        '</button>'
      );
    }).join('');
    return '<div class="explorer-grid explorer-grid-areas">' + cards + '</div>';
  }

  function renderLevel2() {
    var area = DATA[state.areaIndex];
    var crumb =
      '<div class="explorer-crumb">' +
        '<button type="button" class="explorer-back" data-go="1">' + ARROW_LEFT + ' Regresar</button>' +
        '<p class="explorer-path">' + escapeHtml(ROOT_LABEL) + ' <span>&rsaquo;</span> ' + escapeHtml(area.name) + '</p>' +
      '</div>';
    var subcats = area.subcats.map(function (sc, i) {
      return (
        '<button type="button" class="explorer-subcat-card" data-subcat="' + i + '">' +
          '<span>' + escapeHtml(sc.name) + '</span>' + ARROW_RIGHT +
        '</button>'
      );
    }).join('');
    return crumb +
      '<h3 class="explorer-level-title">' + escapeHtml(area.name) + '</h3>' +
      '<div class="explorer-grid explorer-grid-subcats">' + subcats + '</div>';
  }

  function renderLevel3() {
    var area = DATA[state.areaIndex];
    var subcat = area.subcats[state.subcatIndex];
    var singleSubcat = area.subcats.length === 1;
    var backLevel = singleSubcat ? 1 : 2;
    var crumb =
      '<div class="explorer-crumb">' +
        '<button type="button" class="explorer-back" data-go="' + backLevel + '">' + ARROW_LEFT + ' Regresar</button>' +
        '<p class="explorer-path">' + escapeHtml(ROOT_LABEL) + ' <span>&rsaquo;</span> ' + escapeHtml(area.name) + (singleSubcat ? '' : ' <span>&rsaquo;</span> ' + escapeHtml(subcat.name)) + '</p>' +
      '</div>';
    var pills = subcat.items.map(function (name) {
      return '<li class="pill">' + escapeHtml(name) + '</li>';
    }).join('');
    return crumb +
      '<h3 class="explorer-level-title">' + escapeHtml(subcat.name) + '</h3>' +
      '<ul class="pills explorer-conditions">' + pills + '</ul>' +
      '<button type="button" class="explorer-other-cats" data-go="' + backLevel + '">' + ARROW_LEFT + ' Ver otras categorías</button>';
  }

  function renderCurrent() {
    if (state.level === 1) return renderLevel1();
    if (state.level === 2) return renderLevel2();
    return renderLevel3();
  }

  function bindPanelEvents() {
    panel.querySelectorAll('[data-area]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var areaIndex = Number(btn.getAttribute('data-area'));
        if (DATA[areaIndex].subcats.length === 1) {
          goTo({ level: 3, areaIndex: areaIndex, subcatIndex: 0 });
        } else {
          goTo({ level: 2, areaIndex: areaIndex, subcatIndex: null });
        }
      });
    });
    panel.querySelectorAll('[data-subcat]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        goTo({ level: 3, areaIndex: state.areaIndex, subcatIndex: Number(btn.getAttribute('data-subcat')) });
      });
    });
    panel.querySelectorAll('[data-go]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var level = Number(btn.getAttribute('data-go'));
        if (level === 1) goTo({ level: 1, areaIndex: null, subcatIndex: null });
        else goTo({ level: 2, areaIndex: state.areaIndex, subcatIndex: null });
      });
    });
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function applyRender(moveFocus) {
    panel.innerHTML = renderCurrent();
    bindPanelEvents();
    if (moveFocus) panel.focus({ preventScroll: false });
  }

  function goTo(nextState) {
    state = nextState;
    if (reduceMotion) {
      applyRender(true);
      return;
    }
    panel.classList.add('is-leaving');
    setTimeout(function () {
      applyRender(true);
      panel.classList.remove('is-leaving');
      panel.classList.add('is-entering-start');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          panel.classList.remove('is-entering-start');
        });
      });
    }, 180);
  }

  applyRender(false);
})();
