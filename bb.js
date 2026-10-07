/*!
 * Lampa Backup — імпорт / експорт закладок, історії, таймкодів і налаштувань.
 *
 * Де живуть кнопки:
 *   Налаштування → «Бекап даних»   та пункт «Бекап» у лівому меню.
 *
 * Що вміє:
 *   • Експорт у JSON-файл / імпорт з файлу (у браузері, на ПК, телефоні).
 *   • Збереження бекапу на сервер Lampac / відновлення з сервера (для ТВ без файлів).
 *   • Вибір категорій, режим «Об'єднати» або «Замінити».
 *   • Перед кожним імпортом знімок поточного стану кладеться на сервер →
 *     кнопка «Відкотити останній імпорт».
 *   • Після імпорту дані проштовхуються в серверну синхронізацію Lampac
 *     (bookmark / timecode / sync_view), щоб синк не затер імпорт при перезавантаженні.
 *   • Розуміє також «сирі» дампи localStorage (стандартний backup.js Lampac, бекап CUB).
 *
 * Тільки ES5 — щоб працювало на старих ТВ.
 */
(function () {
  'use strict';

  if (window.lampa_backup_plugin) return;
  window.lampa_backup_plugin = true;

  var VERSION = '1.3.0';
  var FORMAT = 'lampa-backup';
  var SERVER_PATH = 'lampabackup';       // сервер пропускає лише [a-z0-9-]
  var SERVER_UNDO = 'lampabackup-undo';
  var SERVER_LAMPAC = 'backup';          // стандартний backup.js від Lampac

  // ---------------------------------------------------------------------------
  // Адреса Lampac: з атрибута src цього скрипта, інакше — origin сторінки.
  // ---------------------------------------------------------------------------
  var SCRIPT_HOST = (function () {
    var src = '';
    try { if (document.currentScript && document.currentScript.src) src = document.currentScript.src; } catch (e) {}
    if (!src) {
      var list = document.getElementsByTagName('script');
      for (var i = list.length - 1; i >= 0; i--) {
        if (/lampa_backup/.test(list[i].src || '')) { src = list[i].src; break; }
      }
    }
    var m = (src || '').match(/^(https?:\/\/[^\/?#]+)/i);
    if (m) return m[1];
    if (/^https?:/.test(window.location.protocol)) return window.location.protocol + '//' + window.location.host;
    return '';
  })();

  function host() {
    var manual = (Lampa.Storage.get('lampa_backup_host', '') + '').replace(/\/+$/, '');
    return manual || SCRIPT_HOST;
  }

  // ---------------------------------------------------------------------------
  // Категорії
  // ---------------------------------------------------------------------------
  var CATS = [
    { id: 'favorite', def: true },
    { id: 'timeline', def: true },
    { id: 'online',   def: true },
    { id: 'torrents', def: true },
    { id: 'search',   def: true },
    { id: 'plugins',  def: false },
    { id: 'settings', def: false }
  ];

  var FAV_CATS = ['like', 'wath', 'watch', 'book', 'history', 'look', 'viewed', 'scheduled', 'continued', 'thrown'];

  // Ключі, яких у бекапі бути не повинно: ідентичність пристрою/акаунта, курсори синхронізації, кеші.
  var EXCLUDE_EXACT = {
    'lampac_unic_id': 1, 'lampa_uid': 1, 'account': 1, 'account_user': 1, 'account_email': 1,
    'account_bookmarks': 1, 'account_plugins': 1, 'account_extensions': 1, 'account_notice': 1,
    'activity': 1, 'app.js': 1, 'aesgcmkey': 1, 'testsize': 1, 'timetable': 1,
    'recomends_list': 1, 'recomends_scan': 1, 'cub_alive': 1, 'cub_notice_time': 1,
    'lampa_backup_host': 1, 'lampa_backup_menu': 1, 'lampa_backup_undo_info': 1
  };
  var EXCLUDE_PREFIX = ['metric_', 'vast_', 'storage_', 'player_segments_'];

  function catOf(key) {
    if (!key || EXCLUDE_EXACT[key]) return null;
    for (var i = 0; i < EXCLUDE_PREFIX.length; i++) if (key.indexOf(EXCLUDE_PREFIX[i]) === 0) return null;

    if (key === 'favorite') return 'favorite';
    if (/^file_view(_.+)?$/.test(key) || key === 'lampac_timecode_cards') return 'timeline';
    if (/^online_(view|last_balanser|watched_last|balanser)$/.test(key) || key.indexOf('online_choice_') === 0 ||
        key === 'active_balanser' || key === 'clarification_search') return 'online';
    if (key === 'torrents_view' || key === 'torrents_filter_data') return 'torrents';
    if (key === 'search_history') return 'search';
    if (key === 'plugins') return 'plugins';
    // Службові ключі Lampac (курсори синку, профіль, ініціалізація) — не переносимо.
    if (key.indexOf('lampac_') === 0) return null;
    return 'settings';
  }

  // Ключі даних, які можуть лежати в IndexedDB-резерві Lampa (при переповненні localStorage),
  // тому їх читаємо через Lampa.Storage навіть якщо в localStorage їх немає.
  function knownDataKeys() {
    var keys = ['favorite', 'file_view', 'search_history', 'online_view', 'online_last_balanser',
      'online_watched_last', 'torrents_view', 'torrents_filter_data', 'plugins'];
    var tf = timelineFile();
    if (keys.indexOf(tf) < 0) keys.push(tf);
    return keys;
  }

  function timelineFile() {
    try { if (Lampa.Timeline && Lampa.Timeline.filename) return Lampa.Timeline.filename(); } catch (e) {}
    return 'file_view';
  }

  // ---------------------------------------------------------------------------
  // Переклади
  // ---------------------------------------------------------------------------
  Lampa.Lang.add({
    lbk_title:            { uk: 'Бекап даних', ru: 'Бекап данных', en: 'Data backup' },
    lbk_menu:             { uk: 'Бекап', ru: 'Бекап', en: 'Backup' },
    lbk_export_file:      { uk: 'Експорт у файл', ru: 'Экспорт в файл', en: 'Export to file' },
    lbk_import_file:      { uk: 'Імпорт з файлу', ru: 'Импорт из файла', en: 'Import from file' },
    lbk_export_server:    { uk: 'Зберегти на сервер', ru: 'Сохранить на сервер', en: 'Save to server' },
    lbk_import_server:    { uk: 'Відновити з сервера', ru: 'Восстановить с сервера', en: 'Restore from server' },
    lbk_undo:             { uk: 'Відкотити останній імпорт', ru: 'Откатить последний импорт', en: 'Undo last import' },
    lbk_files_title:      { uk: 'Файл', ru: 'Файл', en: 'File' },
    lbk_server_title:     { uk: 'Сервер Lampac', ru: 'Сервер Lampac', en: 'Lampac server' },
    lbk_other_title:      { uk: 'Інше', ru: 'Прочее', en: 'Other' },
    lbk_host:             { uk: 'Адреса Lampac (необов\'язково)', ru: 'Адрес Lampac (необязательно)', en: 'Lampac address (optional)' },
    lbk_host_descr:       { uk: 'Порожньо — визначається автоматично', ru: 'Пусто — определяется автоматически', en: 'Empty — detected automatically' },
    lbk_show_menu:        { uk: 'Кнопка в лівому меню', ru: 'Кнопка в левом меню', en: 'Button in side menu' },
    lbk_export_descr:     { uk: 'Завантажити JSON з вибраними даними', ru: 'Скачать JSON с выбранными данными', en: 'Download JSON with selected data' },
    lbk_import_descr:     { uk: 'Вибрати JSON-файл бекапу', ru: 'Выбрать JSON-файл бекапа', en: 'Pick a backup JSON file' },
    lbk_server_descr:     { uk: 'Зручно для ТВ: бекап прив\'язаний до вашого акаунта Lampac', ru: 'Удобно для ТВ: бекап привязан к вашему аккаунту Lampac', en: 'Handy on TV: tied to your Lampac account' },
    lbk_undo_descr:       { uk: 'Повернути стан, який був перед останнім імпортом', ru: 'Вернуть состояние до последнего импорта', en: 'Restore state before the last import' },

    lbk_cat_favorite:     { uk: 'Закладки та історія карток', ru: 'Закладки и история карточек', en: 'Bookmarks & card history' },
    lbk_cat_timeline:     { uk: 'Таймкоди (прогрес перегляду)', ru: 'Таймкоды (прогресс просмотра)', en: 'Timecodes (watch progress)' },
    lbk_cat_online:       { uk: 'Онлайн: переглянуті серії, вибір балансера', ru: 'Онлайн: просмотренные серии, выбор балансера', en: 'Online: watched episodes, balancer choice' },
    lbk_cat_torrents:     { uk: 'Історія торрентів', ru: 'История торрентов', en: 'Torrent history' },
    lbk_cat_search:       { uk: 'Історія пошуку', ru: 'История поиска', en: 'Search history' },
    lbk_cat_plugins:      { uk: 'Встановлені плагіни', ru: 'Установленные плагины', en: 'Installed plugins' },
    lbk_cat_settings:     { uk: 'Налаштування інтерфейсу та плеєра', ru: 'Настройки интерфейса и плеера', en: 'Interface & player settings' },

    lbk_what_export:      { uk: 'Що експортувати?', ru: 'Что экспортировать?', en: 'What to export?' },
    lbk_what_import:      { uk: 'Що імпортувати?', ru: 'Что импортировать?', en: 'What to import?' },
    lbk_next:             { uk: 'Далі →', ru: 'Далее →', en: 'Next →' },
    lbk_cancel:           { uk: 'Скасувати', ru: 'Отмена', en: 'Cancel' },
    lbk_mode:             { uk: 'Як імпортувати?', ru: 'Как импортировать?', en: 'Import mode' },
    lbk_mode_merge:       { uk: 'Об\'єднати з поточними', ru: 'Объединить с текущими', en: 'Merge with current' },
    lbk_mode_merge_d:     { uk: 'Нічого не видаляється, додається відсутнє', ru: 'Ничего не удаляется, добавляется недостающее', en: 'Nothing is removed, missing items are added' },
    lbk_mode_replace:     { uk: 'Замінити поточні', ru: 'Заменить текущие', en: 'Replace current' },
    lbk_mode_replace_d:   { uk: 'Вибрані категорії стануть точно як у бекапі', ru: 'Выбранные категории станут точно как в бекапе', en: 'Selected categories become exactly as in backup' },
    lbk_items:            { uk: 'записів', ru: 'записей', en: 'items' },
    lbk_nothing:          { uk: 'Нічого не вибрано', ru: 'Ничего не выбрано', en: 'Nothing selected' },
    lbk_bad_file:         { uk: 'Файл не схожий на бекап Lampa', ru: 'Файл не похож на бекап Lampa', en: 'Not a Lampa backup file' },
    lbk_read_err:         { uk: 'Не вдалося прочитати файл', ru: 'Не удалось прочитать файл', en: 'Could not read file' },
    lbk_exported:         { uk: 'Файл бекапу збережено', ru: 'Файл бекапа сохранён', en: 'Backup file saved' },
    lbk_export_fail:      { uk: 'Не вдалося зберегти файл. На ТВ/в додатку використайте «Зберегти на сервер»', ru: 'Не удалось сохранить файл. На ТВ/в приложении используйте «Сохранить на сервер»', en: 'Could not save file. On TV/app use “Save to server”' },
    lbk_saved_server:     { uk: 'Бекап збережено на сервер', ru: 'Бекап сохранён на сервер', en: 'Backup saved to server' },
    lbk_server_fail:      { uk: 'Сервер недоступний або модуль Storage вимкнено', ru: 'Сервер недоступен или модуль Storage отключён', en: 'Server unavailable or Storage module disabled' },
    lbk_server_empty:     { uk: 'На сервері немає бекапу', ru: 'На сервере нет бекапа', en: 'No backup on server' },
    lbk_src_plugin:       { uk: 'Бекап цього плагіна', ru: 'Бекап этого плагина', en: 'This plugin\'s backup' },
    lbk_src_lampac:       { uk: 'Стандартний бекап Lampac (backup.js)', ru: 'Стандартный бекап Lampac (backup.js)', en: 'Standard Lampac backup (backup.js)' },
    lbk_src_undo:         { uk: 'Знімок перед останнім імпортом', ru: 'Снимок перед последним импортом', en: 'Snapshot before last import' },
    lbk_choose_src:       { uk: 'Звідки відновити?', ru: 'Откуда восстановить?', en: 'Restore from?' },
    lbk_importing:        { uk: 'Імпорт…', ru: 'Импорт…', en: 'Importing…' },
    lbk_pushing:          { uk: 'Синхронізація з сервером…', ru: 'Синхронизация с сервером…', en: 'Syncing with server…' },
    lbk_done:             { uk: 'Імпортовано. Перезавантаження…', ru: 'Импортировано. Перезагрузка…', en: 'Imported. Reloading…' },
    lbk_last:             { uk: 'Останній', ru: 'Последний', en: 'Last' },
    lbk_none:             { uk: 'немає', ru: 'нет', en: 'none' },
    lbk_tc_fetch:         { uk: 'Таймкоди з сервера…', ru: 'Таймкоды с сервера…', en: 'Server timecodes…' },
    lbk_tc_server:        { uk: 'таймкодів із сервера', ru: 'таймкодов с сервера', en: 'server timecodes' },
    lbk_created:          { uk: 'Створено', ru: 'Создан', en: 'Created' }
  });

  function t(k) { return Lampa.Lang.translate(k); }

  // ---------------------------------------------------------------------------
  // Утиліти
  // ---------------------------------------------------------------------------
  function isObj(v) { return v !== null && typeof v === 'object' && Object.prototype.toString.call(v) === '[object Object]'; }
  function isArr(v) { return Object.prototype.toString.call(v) === '[object Array]'; }
  function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }
  function keys(o) { var r = []; for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) r.push(k); return r; }

  function parseRaw(raw) {
    if (raw === null || typeof raw === 'undefined') return raw;
    if (typeof raw !== 'string') return raw;
    var c = raw.charAt(0);
    if (c === '{' || c === '[') { try { return JSON.parse(raw); } catch (e) {} }
    return raw;
  }

  function toRaw(v) {
    if (typeof v === 'string') return v;
    if (v === null || typeof v === 'undefined') return '';
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
  }

  function readRaw(key) {
    var raw = null;
    try { raw = window.localStorage.getItem(key); } catch (e) {}
    if (raw === null || raw === '') {
      // Може лежати в резерві IndexedDB (QuotaExceeded) — Lampa.Storage знає про нього.
      try {
        var v = Lampa.Storage.get(key, '');
        if (v !== '' && v !== null && typeof v !== 'undefined') raw = toRaw(v);
      } catch (e) {}
    }
    return raw;
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function stamp(d) {
    d = d || new Date();
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + pad(d.getHours()) + pad(d.getMinutes());
  }
  function human(ms) {
    if (!ms) return '';
    var d = new Date(ms);
    return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function controllerName() {
    try { return Lampa.Controller.enabled().name; } catch (e) { return 'content'; }
  }
  function back(name) {
    try { Lampa.Controller.toggle(name || 'content'); } catch (e) {}
  }

  // ---------------------------------------------------------------------------
  // Мережа (ідентичність — як у sync.js / timecode.js Lampac)
  // ---------------------------------------------------------------------------
  function withAccount(url) {
    var email = Lampa.Storage.get('account_email', '');
    if (email && url.indexOf('account_email=') < 0) url = Lampa.Utils.addUrlComponent(url, 'account_email=' + encodeURIComponent(email));
    var uid = Lampa.Storage.get('lampac_unic_id', '');
    if (uid && url.indexOf('uid=') < 0) url = Lampa.Utils.addUrlComponent(url, 'uid=' + encodeURIComponent(uid));
    var token = Lampa.Storage.get('lampac_token', '');
    if (token && url.indexOf('token=') < 0) url = Lampa.Utils.addUrlComponent(url, 'token=' + encodeURIComponent(token));
    if (window.lwsEvent && window.lwsEvent.connectionId) url = Lampa.Utils.addUrlComponent(url, 'connectionId=' + encodeURIComponent(window.lwsEvent.connectionId));
    return url;
  }

  function bookmarkProfile() { return Lampa.Storage.get('lampac_profile_id', '') + ''; }

  // Та сама логіка, що й у timecode.js: ручний профіль Lampac або не-головний профіль CUB.
  function timecodeProfile() {
    var manual = Lampa.Storage.get('lampac_profile_id', '');
    if (manual !== '' && manual !== 0 && manual !== '0') return String(manual);
    try {
      var permit = Lampa.Account.Permit;
      if (!permit.sync) return '';
      var profile = permit.account.profile;
      if (!profile || !profile.id || profile.main) return '';
      return String(profile.id);
    } catch (e) { return ''; }
  }

  function api(path) { return withAccount(host() + path); }

  function xhr(method, url, body, ok, fail, timeout) {
    var req;
    try {
      req = new XMLHttpRequest();
      req.open(method, url, true);
      req.timeout = timeout || 60000;
      var form = body && typeof body === 'object' && body.__form;
      if (form) {
        var parts = [];
        keys(body).forEach(function (k) { if (k !== '__form') parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(body[k])); });
        body = parts.join('&');
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
      } else if (body !== null && typeof body !== 'undefined') req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      req.onreadystatechange = function () {
        if (req.readyState !== 4) return;
        var json = null;
        try { json = JSON.parse(req.responseText); } catch (e) {}
        if (req.status >= 200 && req.status < 300 && json) ok(json);
        else if (fail) fail(req.status, json);
      };
      req.ontimeout = function () { if (fail) fail(0, null); };
      req.send(body !== null && typeof body !== 'undefined' ? (typeof body === 'string' ? body : JSON.stringify(body)) : null);
    } catch (e) {
      if (fail) fail(0, null);
    }
  }

  function storageGet(path, ok, fail, infoOnly) {
    if (!host()) return fail && fail();
    var url = api('/storage/get?path=' + path + (infoOnly ? '&responseInfo=true' : ''));
    xhr('GET', url, null, function (j) {
      if (j && j.success) ok(j); else fail && fail(j);
    }, function () { fail && fail(); });
  }

  function storageSet(path, payload, ok, fail, pathfile) {
    if (!host()) return fail && fail();
    var url = api('/storage/set?path=' + path + (pathfile ? '&pathfile=' + encodeURIComponent(pathfile) : ''));
    xhr('POST', url, typeof payload === 'string' ? payload : JSON.stringify(payload), function (j) {
      if (j && j.success) ok(j); else fail && fail(j);
    }, function () { fail && fail(); });
  }

  // ---------------------------------------------------------------------------
  // Збір бекапу
  // ---------------------------------------------------------------------------
  function allLocalKeys() {
    var list = [], seen = {};
    try {
      for (var i = 0; i < window.localStorage.length; i++) {
        var k = window.localStorage.key(i);
        if (k && !seen[k]) { seen[k] = 1; list.push(k); }
      }
    } catch (e) {}
    knownDataKeys().forEach(function (k) { if (!seen[k]) { seen[k] = 1; list.push(k); } });
    return list;
  }

  // Закладки в режимі синхронізації CUB живуть не в localStorage — збираємо їх у формат `favorite`.
  function cubFavorite() {
    try {
      if (!(Lampa.Account && Lampa.Account.Permit && Lampa.Account.Permit.sync)) return null;
      var all = Lampa.Favorite.all();
      var fav = { card: [] }, seen = {};
      keys(all).forEach(function (cat) {
        fav[cat] = [];
        (all[cat] || []).forEach(function (card) {
          if (!card || card.id == null) return;
          fav[cat].push(card.id);
          if (!seen[card.id]) { seen[card.id] = 1; fav.card.push(clearCard(card)); }
        });
      });
      return fav.card.length ? fav : null;
    } catch (e) { return null; }
  }

  function clearCard(card) {
    try { return Lampa.Utils.clearCard(Lampa.Arrays.clone(card)); } catch (e) { return clone(card); }
  }

  function collect(selected) {
    var data = {};
    allLocalKeys().forEach(function (k) {
      var cat = catOf(k);
      if (!cat || !selected[cat]) return;
      var raw = readRaw(k);
      if (raw === null || raw === '') return;
      data[k] = raw;
    });

    if (selected.favorite) {
      var cub = cubFavorite();
      if (cub) {
        // Поєднуємо з локальним (на випадок, якщо там теж щось є).
        var local = parseRaw(data.favorite || '');
        data.favorite = JSON.stringify(isObj(local) ? mergeFavorite(local, cub) : cub);
      }
    }

    return {
      format: FORMAT,
      version: 1,
      plugin: VERSION,
      created: Date.now(),
      timeline_file: timelineFile(),
      device: {
        platform: (function () { try { return Lampa.Platform.get(); } catch (e) { return ''; } })(),
        origin: window.location.origin || ''
      },
      categories: keys(selected).filter(function (c) { return selected[c]; }),
      data: data,
      server: {}
    };
  }

  // Серверні таймкоди Lampac зберігають ідентичність серії (tv-ID-sXeY), якої немає в локальних хешах.
  function attachServerTimecodes(backup, done) {
    if (!backup.categories || backup.categories.indexOf('timeline') < 0 || !window.lampac_timecode_plugin || !host()) return done(backup);
    var pid = timecodeProfile();
    var withProfile = function (url) { return pid ? Lampa.Utils.addUrlComponent(url, 'profile_id=' + encodeURIComponent(pid)) : url; };

    // Новий Lampac віддає все одним запитом.
    xhr('GET', withProfile(api('/timecode/dump')), null, function (j) {
      if (j && isArr(j.rows) && j.rows.length) {
        backup.server.timecode = { rows: j.rows, source: 'dump' };
        return done(backup);
      }
      perCard();
    }, perCard, 30000);

    // Старий Lampac (або порожній dump): питаємо /timecode/all по кожній картці із закладок.
    // Саме звідти Лампа малює таймлайни серій, коли відкриваєш картку.
    function perCard() {
      var fav = normFav(parseRaw(backup.data.favorite || readRaw('favorite') || '') || {});
      var list = [], seen = {};
      fav.card.forEach(function (c) {
        if (!c || !c.id) return;
        var type = (c.name || c.original_name || c.first_air_date || c.number_of_seasons) ? 'tv' : 'movie';
        var key = c.id + '_' + type;
        if (!seen[key]) { seen[key] = 1; list.push(key); }
      });
      if (!list.length) return done(backup);
      var rows = [], i = 0;
      (function step() {
        if (i >= list.length) {
          if (rows.length) backup.server.timecode = { rows: rows, source: 'all' };
          return done(backup);
        }
        var card = list[i++];
        if (Lampa.Loading.setText) Lampa.Loading.setText(t('lbk_tc_fetch') + ' ' + i + '/' + list.length);
        var url = withProfile(Lampa.Utils.addUrlComponent(api('/timecode/all'), 'card_id=' + encodeURIComponent(card)));
        xhr('GET', url, null, function (res) {
          if (isObj(res) && !res.accsdb) {
            keys(res).forEach(function (h) {
              var road = parseRaw(res[h]);
              if (!isObj(road)) return;
              rows.push({
                hash: h, card: card,
                position: +road.time || 0, duration: +road.duration || 0, percent: +road.percent || 0,
                profile: road.profile || 0, watched_at: +road.updated || 0,
                id: typeof road.id === 'string' ? road.id : undefined
              });
            });
          }
          setTimeout(step, 110);           // WAF Lampac ~10 запитів/с
        }, function () { setTimeout(step, 110); }, 15000);
      })();
    }
  }


  // Нормалізувати будь-який вхід (наш формат або «сирий» дамп localStorage) до нашого формату.
  function normalizeBackup(json) {
    if (!isObj(json)) return null;
    if (json.format === FORMAT && isObj(json.data)) {
      json.server = isObj(json.server) ? json.server : {};
      return json;
    }
    // «Сирий» дамп: {key: "string", ...} — backup.js Lampac або CUB.
    var data = {}, count = 0;
    keys(json).forEach(function (k) {
      var v = json[k];
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') { data[k] = String(v); count++; }
      else if (isObj(v) || isArr(v)) { data[k] = JSON.stringify(v); count++; }
    });
    if (!count) return null;
    return { format: FORMAT, version: 1, plugin: 'raw', created: 0, timeline_file: 'file_view', categories: [], data: data, server: {} };
  }

  function summary(backup) {
    var res = {};
    CATS.forEach(function (c) { res[c.id] = 0; });
    keys(backup.data).forEach(function (k) {
      var cat = catOf(k);
      if (!cat) return;
      var v = parseRaw(backup.data[k]);
      if (cat === 'favorite') res[cat] += isObj(v) && isArr(v.card) ? v.card.length : 0;
      else if (cat === 'timeline') res[cat] += k === 'lampac_timecode_cards' ? 0 : (isObj(v) ? keys(v).length : 0);
      else if (cat === 'settings') res[cat] += 1;
      else res[cat] += isArr(v) ? v.length : (isObj(v) ? keys(v).length : 1);
    });
    if (backup.server && backup.server.timecode && backup.server.timecode.rows && !res.timeline) res.timeline = backup.server.timecode.rows.length;
    return res;
  }

  function currentSummary() {
    var sel = {};
    CATS.forEach(function (c) { sel[c.id] = true; });
    return summary(collect(sel));
  }

  // ---------------------------------------------------------------------------
  // Злиття
  // ---------------------------------------------------------------------------
  function normFav(f) {
    f = isObj(f) ? f : {};
    if (!isArr(f.card)) f.card = [];
    FAV_CATS.forEach(function (c) { if (!isArr(f[c])) f[c] = []; });
    return f;
  }

  function mergeFavorite(cur, imp) {
    var res = normFav(clone(cur) || {});
    imp = normFav(clone(imp) || {});
    var have = {};
    res.card.forEach(function (c) { if (c && c.id != null) have[String(c.id)] = 1; });
    imp.card.forEach(function (c) {
      if (c && c.id != null && !have[String(c.id)]) { res.card.push(c); have[String(c.id)] = 1; }
    });
    keys(imp).forEach(function (cat) {
      if (cat === 'card') return;
      if (!isArr(imp[cat])) { if (typeof res[cat] === 'undefined') res[cat] = imp[cat]; return; }
      if (!isArr(res[cat])) res[cat] = [];
      var set = {};
      res[cat].forEach(function (id) { set[String(id)] = 1; });
      imp[cat].forEach(function (id) {
        if (!set[String(id)]) { res[cat].push(id); set[String(id)] = 1; }
      });
    });
    return res;
  }

  function roadScore(r) {
    if (typeof r === 'number') return { u: 0, p: r };
    if (!isObj(r)) return { u: 0, p: 0 };
    return { u: +r.updated || 0, p: +r.percent || 0 };
  }

  function mergeTimeline(cur, imp) {
    var res = isObj(cur) ? clone(cur) : {};
    if (!isObj(imp)) return res;
    keys(imp).forEach(function (h) {
      if (typeof res[h] === 'undefined') { res[h] = imp[h]; return; }
      var a = roadScore(res[h]), b = roadScore(imp[h]);
      if (b.u > a.u || (b.u === a.u && b.p > a.p)) res[h] = imp[h];
    });
    return res;
  }

  function mergeArray(cur, imp) {
    var res = isArr(cur) ? cur.slice() : [];
    if (!isArr(imp)) return res;
    var seen = {};
    res.forEach(function (v) { seen[typeof v === 'object' ? JSON.stringify(v) : String(v)] = 1; });
    imp.forEach(function (v) {
      var k = typeof v === 'object' ? JSON.stringify(v) : String(v);
      if (!seen[k]) { seen[k] = 1; res.push(v); }
    });
    return res;
  }

  function mergePlugins(cur, imp) {
    var res = isArr(cur) ? cur.slice() : [];
    if (!isArr(imp)) return res;
    var seen = {};
    res.forEach(function (p) { seen[isObj(p) ? p.url : String(p)] = 1; });
    imp.forEach(function (p) {
      var k = isObj(p) ? p.url : String(p);
      if (k && !seen[k]) { seen[k] = 1; res.push(p); }
    });
    return res;
  }

  function mergeValue(key, cat, curRaw, impRaw) {
    var cur = parseRaw(curRaw), imp = parseRaw(impRaw);
    if (curRaw === null || curRaw === '' || typeof curRaw === 'undefined') return imp;
    if (cat === 'favorite') return mergeFavorite(cur, imp);
    if (cat === 'timeline' && key !== 'lampac_timecode_cards') return mergeTimeline(cur, imp);
    if (cat === 'plugins') return mergePlugins(cur, imp);
    if (cat === 'settings') return imp;               // налаштування завжди беремо з бекапу
    if (isArr(cur) && isArr(imp)) return mergeArray(cur, imp);
    if (isObj(cur) && isObj(imp)) {
      var res = clone(imp);
      keys(cur).forEach(function (k) { res[k] = cur[k]; }); // поточні значення мають пріоритет
      return res;
    }
    return cur;
  }

  // ---------------------------------------------------------------------------
  // Застосування імпорту
  // ---------------------------------------------------------------------------
  function writeKey(key, value) {
    try { Lampa.Storage.set(key, value, true); }           // true = без подій, щоб синк не смикався на кожен ключ
    catch (e) { try { window.localStorage.setItem(key, toRaw(value)); } catch (e2) {} }
  }

  function applyImport(backup, selected, mode, done) {
    var before = { favorite: parseRaw(readRaw('favorite') || '') };
    var cubSync = false;
    try { cubSync = !!(Lampa.Account.Permit && Lampa.Account.Permit.sync); } catch (e) {}

    var curTL = timelineFile();
    var srcTL = backup.timeline_file || 'file_view';
    var pending = {};      // target key -> value
    var pendingCat = {};
    var order = [];

    keys(backup.data).forEach(function (k) {
      var cat = catOf(k);
      if (!cat || !selected[cat]) return;
      var impRaw = backup.data[k];

      // Основний таймлайн бекапу (file_view або file_view_<профіль CUB>) кладемо в поточний
      // файл Lampa на цьому пристрої — інакше після імпорту прогрес «не видно».
      var target = (cat === 'timeline' && k === srcTL) ? curTL : k;

      if (typeof pending[target] === 'undefined') {
        var base = mode === 'replace' ? null : readRaw(target);
        pending[target] = mergeValue(target, cat, base, impRaw);
        pendingCat[target] = cat;
        order.push(target);
      } else {
        // Кілька ключів бекапу ведуть в один локальний — зливаємо між собою.
        pending[target] = mergeValue(target, cat, toRaw(pending[target]), impRaw);
      }
    });

    order.forEach(function (k) { writeKey(k, pending[k]); });
    var written = order.length;

    // Режим «Замінити»: категорії, вибрані користувачем, але відсутні в бекапі — очищаємо.
    if (mode === 'replace') {
      allLocalKeys().forEach(function (k) {
        var cat = catOf(k);
        if (!cat || !selected[cat] || cat === 'settings' || cat === 'plugins') return;
        if (typeof pending[k] !== 'undefined' || typeof backup.data[k] !== 'undefined') return;
        if (k === 'lampac_timecode_cards') return;
        var cur = parseRaw(readRaw(k));
        writeKey(k, isArr(cur) ? [] : (isObj(cur) ? (cat === 'favorite' ? normFav({}) : {}) : ''));
      });
    }

    if (selected.timeline) mergeServerRowsLocal(backup, curTL, mode);

    try { if (Lampa.Favorite.read) Lampa.Favorite.read(true); else Lampa.Favorite.init(); } catch (e) {}

    var after = { favorite: parseRaw(readRaw('favorite') || '') };

    if (Lampa.Loading.setText) Lampa.Loading.setText(t('lbk_pushing'));

    var steps = [];
    if (selected.favorite) {
      if (cubSync) steps.push(function (next) { pushCubBookmarks(backup, next); });
      steps.push(function (next) { pushLampacBookmarks(before.favorite, after.favorite, mode, next); });
    }
    if (selected.online || selected.torrents) steps.push(pushSyncView);
    if (selected.timeline) steps.push(function (next) { pushTimecodes(backup, next); });

    runSeq(steps, function () { done(written); });
  }


  // Серверні рядки таймкодів → локальний file_view (той, з якого Лампа малює смужки прогресу).
  function rowToRoad(r) {
    var road = { time: +r.position || 0, duration: +r.duration || 0, percent: +r.percent || 0, profile: r.profile || 0, updated: +r.watched_at || 0 };
    if (r.id) road.id = r.id;
    return road;
  }

  function mergeServerRowsLocal(backup, file, mode) {
    var rows = backup.server && backup.server.timecode && backup.server.timecode.rows;
    if (!isArr(rows) || !rows.length) return;
    var viewed = parseRaw(readRaw(file) || '');
    if (!isObj(viewed)) viewed = {};
    var add = {};
    rows.forEach(function (r) {
      if (!r || !r.hash || r.deleted) return;
      add[r.hash] = rowToRoad(r);
    });
    writeKey(file, mergeTimeline(viewed, add));
  }

  function runSeq(steps, done) {
    var i = 0;
    (function next() {
      if (i >= steps.length) return done();
      var fn = steps[i++];
      var called = false;
      var guard = setTimeout(function () { if (!called) { called = true; next(); } }, 900000);
      try {
        fn(function () { if (called) return; called = true; clearTimeout(guard); next(); });
      } catch (e) {
        console.log('LampaBackup', 'step error', e && e.message);
        if (!called) { called = true; clearTimeout(guard); next(); }
      }
    })();
  }

  // --- закладки → модуль Sync Lampac (/bookmark/sync: батч «бажаний стан картки») -------------
  function pushLampacBookmarks(beforeFav, fav, mode, next) {
    if (!window.lampacBookmarkSyncInitialized || !host()) return next();
    fav = normFav(isObj(fav) ? fav : {});
    var base = Date.now();
    var byId = {};

    fav.card.forEach(function (card) {
      if (card && card.id != null) byId[String(card.id)] = { id: String(card.id), card: card, categories: {} };
    });
    keys(fav).forEach(function (cat) {
      if (cat === 'card' || !isArr(fav[cat])) return;
      var list = fav[cat];
      for (var i = 0; i < list.length; i++) {
        var id = String(list[i]);
        if (!byId[id]) continue;                       // без опису картки сервер її не покаже
        byId[id].categories[cat] = base + (list.length - i); // ключ порядку: вище = ближче до початку
      }
    });

    var rows = [];
    keys(byId).forEach(function (id) { if (keys(byId[id].categories).length) rows.push(byId[id]); });

    // «Замінити»: те, що було, а тепер зникло — надгробок (порожні категорії).
    if (mode === 'replace' && isObj(beforeFav) && isArr(beforeFav.card)) {
      beforeFav.card.forEach(function (c) {
        if (c && c.id != null && !byId[String(c.id)]) rows.push({ id: String(c.id), categories: {} });
      });
    }
    if (!rows.length) return next();

    var url = api('/bookmark/sync');
    var pid = bookmarkProfile();
    if (pid) url = Lampa.Utils.addUrlComponent(url, 'profile_id=' + encodeURIComponent(pid));

    // Нове API (/bookmark/sync). Старі збірки Lampac його не мають (404) —
    // тоді йдемо по-старому: /bookmark/add і /bookmark/remove по одній картці.
    xhr('POST', url, JSON.stringify(rows.slice(0, 1)), function (j) {
      if (!j || j.accsdb || typeof j.version === 'undefined') return legacyBookmarks(fav, mode, next);
      sendBatches(url, rows, 300, function () {
        try { Lampa.Listener.send('lampac', { name: 'bookmark_pullFromServer' }); } catch (e) {}
        next();
      });
    }, function () { legacyBookmarks(fav, mode, next); });
  }

  function bookmarkUrl(path) {
    var url = api('/bookmark' + path);
    var pid = bookmarkProfile();
    if (pid) url = Lampa.Utils.addUrlComponent(url, 'profile_id=' + encodeURIComponent(pid));
    return url;
  }

  // Старий протокол: сервер тримає весь об'єкт favorite, а bookmark.js при старті
  // ПЕРЕЗАПИСУЄ локальні закладки серверними. Тож доносимо різницю на сервер явно.
  function legacyBookmarks(fav, mode, next) {
    xhr('GET', bookmarkUrl('/list'), null, function (server) {
      if (!isObj(server) || server.accsdb) return next();
      server = normFav(server);
      var cards = {};
      fav.card.forEach(function (c) { if (c && c.id != null) cards[String(c.id)] = c; });
      var serverCards = {};
      server.card.forEach(function (c) { if (c && c.id != null) serverCards[String(c.id)] = c; });

      var has = function (list, id) {
        for (var i = 0; i < list.length; i++) if (String(list[i]) === String(id)) return true;
        return false;
      };

      var ops = [];
      keys(fav).forEach(function (cat) {
        if (cat === 'card' || !isArr(fav[cat])) return;
        var srv = isArr(server[cat]) ? server[cat] : [];
        // Сервер вставляє на початок — тому йдемо з кінця, щоб зберегти порядок.
        for (var i = fav[cat].length - 1; i >= 0; i--) {
          var id = fav[cat][i];
          var card = cards[String(id)];
          if (!card || has(srv, id)) continue;
          ops.push({ path: '/add', body: { where: cat, card: card, card_id: card.id, id: card.id } });
        }
      });

      if (mode === 'replace') {
        keys(server).forEach(function (cat) {
          if (cat === 'card' || !isArr(server[cat])) return;
          var mine = isArr(fav[cat]) ? fav[cat] : [];
          server[cat].forEach(function (id) {
            if (has(mine, id)) return;
            var body = { where: cat, method: 'id', card_id: id, id: id };
            if (serverCards[String(id)]) body.card = serverCards[String(id)];
            ops.push({ path: '/remove', body: body });
          });
        });
      }

      // /add приймає масив — шлемо пачками по 50, щоб 500+ карток не йшли хвилинами.
      // Якщо пачку не прийняли — та сама пачка по одній.
      var groups = [], cur = null;
      ops.forEach(function (op) {
        if (op.path === '/add') {
          if (!cur || cur.length >= 50) { cur = []; groups.push({ path: '/add', items: cur }); }
          cur.push(op.body);
        } else { cur = null; groups.push({ path: op.path, items: [op.body] }); }
      });

      var done = 0, g = 0;
      var progress = function () {
        if (Lampa.Loading.setText) Lampa.Loading.setText(t('lbk_pushing') + ' ' + done + '/' + ops.length);
      };
      var single = function (items, cb) {
        var k = 0;
        (function one() {
          if (k >= items.length) return cb();
          var body = items[k++];
          xhr('POST', bookmarkUrl('/add'), JSON.stringify(body), function () { done++; progress(); setTimeout(one, 150); },
            function () { done++; progress(); setTimeout(one, 150); });
        })();
      };
      (function step() {
        if (g >= groups.length) return next();
        var grp = groups[g++];
        var body = grp.items.length === 1 ? grp.items[0] : grp.items;
        xhr('POST', bookmarkUrl(grp.path), JSON.stringify(body), function (j) {
          if (j && j.success === false && grp.items.length > 1) return single(grp.items, function () { setTimeout(step, 150); });
          done += grp.items.length; progress();
          setTimeout(step, 150);           // WAF Lampac: ~10 запитів/с на /bookmark
        }, function () {
          if (grp.items.length > 1) return single(grp.items, function () { setTimeout(step, 150); });
          done++; progress(); setTimeout(step, 150);
        });
      })();
    }, function () { next(); });
  }

  // --- закладки → CUB (коли увімкнена синхронізація акаунта) ---------------------------------
  function pushCubBookmarks(backup, next) {
    var fav = parseRaw(backup.data.favorite || '');
    if (!isObj(fav)) return next();
    fav = normFav(fav);
    var cards = {};
    fav.card.forEach(function (c) { if (c && c.id != null) cards[String(c.id)] = c; });
    var queue = [];
    keys(fav).forEach(function (cat) {
      if (cat === 'card' || !isArr(fav[cat]) || FAV_CATS.indexOf(cat) < 0) return;
      // Додаємо з кінця, щоб найсвіжіші опинилися першими.
      for (var i = fav[cat].length - 1; i >= 0; i--) {
        var card = cards[String(fav[cat][i])];
        if (!card) continue;
        try { if (Lampa.Favorite.check(card)[cat]) continue; } catch (e) {}
        queue.push({ cat: cat, card: card });
      }
    });
    if (!queue.length) return next();
    var i = 0;
    (function step() {
      if (i >= queue.length) return setTimeout(next, 500);
      var q = queue[i++];
      try { Lampa.Favorite.add(q.cat, q.card); } catch (e) {}
      if (Lampa.Loading.setText) Lampa.Loading.setText(t('lbk_pushing') + ' CUB ' + i + '/' + queue.length);
      setTimeout(step, 250);
    })();
  }

  // --- online_view / torrents_view → Storage-синк Lampac (sync_view) --------------------------
  function pushSyncView(next) {
    if (!window.sync_init || !host()) return next();
    var value = {};
    ['online_view', 'online_last_balanser', 'online_watched_last', 'torrents_view', 'torrents_filter_data'].forEach(function (f) {
      value[f] = Lampa.Storage.get(f, '');
    });
    var url = api('/storage/set?path=sync_view&pathfile=' + encodeURIComponent(bookmarkProfile()));
    xhr('POST', url, JSON.stringify(value), function (j) {
      // Позначаємо, що локальна копія вже актуальна — інакше sync.js перезапише її старою з сервера.
      if (j && j.success && j.fileInfo) Lampa.Storage.set('lampac_sync_view', j.fileInfo.changeTime, true);
      next();
    }, function () { next(); });
  }

  // --- таймкоди → модуль TimeCode Lampac (/timecode/set) --------------------------------------
  function pushTimecodes(backup, next) {
    var rows = backup.server && backup.server.timecode && backup.server.timecode.rows;
    if (!window.lampac_timecode_plugin || !host()) return next();
    var sent = {};
    var finish = function () { legacyTimecodes(backup, next, sent); };
    if (!isArr(rows) || !rows.length) return finish();

    var pid = timecodeProfile();
    var url = api('/timecode/set');
    if (pid) url = Lampa.Utils.addUrlComponent(url, 'profile_id=' + encodeURIComponent(pid));
    var clean = rows.map(function (r) {
      var o = {};
      ['id', 'hash', 'card', 'position', 'duration', 'percent', 'watched_at', 'deleted', 'profile', 'extra'].forEach(function (f) {
        if (typeof r[f] !== 'undefined' && r[f] !== null) o[f] = r[f];
      });
      if (r.hash) sent[r.hash] = 1;
      return o;
    });

    // Пробуємо нове API першою пачкою; старий сервер відповість 404 — тоді по одному через /timecode/add.
    xhr('POST', url, JSON.stringify({ rows: clean.slice(0, 200) }), function (j) {
      if (j && typeof j.version !== 'undefined') return sendBatches(url, clean.slice(200), 200, finish, true);
      legacyRows();
    }, legacyRows);

    function legacyRows() {
      var list = rows.filter(function (r) { return r && r.hash && r.card && !r.deleted; });
      var i = 0;
      (function step() {
        if (i >= list.length) return finish();
        var r = list[i++];
        var u = Lampa.Utils.addUrlComponent(api('/timecode/add'), 'card_id=' + encodeURIComponent(r.card));
        if (pid) u = Lampa.Utils.addUrlComponent(u, 'profile_id=' + encodeURIComponent(pid));
        if (Lampa.Loading.setText) Lampa.Loading.setText(t('lbk_pushing') + ' ' + i + '/' + list.length);
        xhr('POST', u, { __form: 1, id: r.hash, data: JSON.stringify(rowToRoad(r)) },
          function () { setTimeout(step, 110); }, function () { setTimeout(step, 110); });
      })();
    }
  }


  // Старий (і новий теж) /timecode/add: form id=<хеш>, data=<road>, card_id=<id>_<tv|movie>.
  // Хеш не знає, чия це серія, тому підбираємо його по оригінальних назвах карток із закладок —
  // так само рахує сама Лампа.
  function legacyTimecodes(backup, next, skip) {
    var needed = {};
    skip = skip || {};
    keys(backup.data).forEach(function (k) {
      if (!/^file_view/.test(k)) return;
      var v = parseRaw(backup.data[k]);
      if (isObj(v)) keys(v).forEach(function (h) { if (!skip[h]) needed[h] = 1; });
    });
    var left = keys(needed).length;
    if (!left) return next();

    var viewed = parseRaw(readRaw(timelineFile()) || '') || {};
    var fav = normFav(parseRaw(readRaw('favorite') || '') || {});
    var hash = function (str) { try { return String(Lampa.Utils.hash(str)); } catch (e) { return ''; } };
    var found = [];

    // 1) Новий timecode.js Lampac пише в road ідентичність: "tv-96402-s1e1" / "movie-603".
    keys(needed).forEach(function (h) {
      var road = viewed[h];
      var m = isObj(road) && typeof road.id === 'string' ? road.id.match(/^(tv|movie)-(\d+)/) : null;
      if (m) { needed[h] = 2; left--; found.push({ hash: h, card_id: m[2] + '_' + m[1] }); }
    });

    // 2) Решту — підбором хешу за оригінальними назвами (картки закладок + індекс timecode.js).
    var pool = fav.card.slice();
    var idx = parseRaw(readRaw('lampac_timecode_cards') || '') || [];
    if (isArr(idx)) idx.forEach(function (x) {
      if (x && x.i && x.o) pool.push(x.t === 'tv' ? { id: x.i, original_name: x.o, number_of_seasons: x.s || 0 } : { id: x.i, original_title: x.o });
    });

    for (var c = 0; c < pool.length && left > 0; c++) {
      var card = pool[c];
      if (!card || !card.id) continue;
      var isTv = !!(card.name || card.original_name || card.first_air_date || card.number_of_seasons);
      if (isTv) {
        var original = card.original_name || card.original_title;
        if (!original) continue;
        var seasons = card.number_of_seasons > 0 ? Math.min(card.number_of_seasons + 1, 60) : 30;
        for (var s = 0; s <= seasons && left > 0; s++) {
          for (var e = 1; e <= 200 && left > 0; e++) {
            var h = hash([s, s > 10 ? ':' : '', e, original].join(''));
            if (needed[h] === 1) { needed[h] = 2; left--; found.push({ hash: h, card_id: card.id + '_tv' }); }
          }
        }
      } else if (card.original_title) {
        var hm = hash(card.original_title);
        if (needed[hm] === 1) { needed[hm] = 2; left--; found.push({ hash: hm, card_id: card.id + '_movie' }); }
      }
    }
    if (!found.length) return next();

    var i = 0;
    (function step() {
      if (i >= found.length) return next();
      var f = found[i++];
      var road = viewed[f.hash];
      if (!isObj(road)) return step();
      var url = api('/timecode/add');
      url = Lampa.Utils.addUrlComponent(url, 'card_id=' + encodeURIComponent(f.card_id));
      var pid = timecodeProfile();
      if (pid) url = Lampa.Utils.addUrlComponent(url, 'profile_id=' + encodeURIComponent(pid));
      if (Lampa.Loading.setText) Lampa.Loading.setText(t('lbk_pushing') + ' ' + i + '/' + found.length);
      xhr('POST', url, { __form: 1, id: f.hash, data: JSON.stringify(road) }, function () {
        setTimeout(step, 150);
      }, function () { setTimeout(step, 150); });
    })();
  }

  function sendBatches(url, rows, size, done, wrap) {
    var offset = 0;
    (function send() {
      if (offset >= rows.length) return done();
      var chunk = rows.slice(offset, offset + size);
      offset += size;
      if (Lampa.Loading.setText) Lampa.Loading.setText(t('lbk_pushing') + ' ' + Math.min(offset, rows.length) + '/' + rows.length);
      xhr('POST', url, JSON.stringify(wrap ? { rows: chunk } : chunk), function () {
        setTimeout(send, 250);              // WAF Lampac: ~10 запитів/с
      }, function () {
        setTimeout(send, 250);
      });
    })();
  }

  // ---------------------------------------------------------------------------
  // Файли
  // ---------------------------------------------------------------------------
  function downloadText(name, text) {
    try {
      var blob = new Blob([text], { type: 'application/json;charset=utf-8' });
      if (window.navigator && window.navigator.msSaveOrOpenBlob) { window.navigator.msSaveOrOpenBlob(blob, name); return true; }
      var url = (window.URL || window.webkitURL).createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        try { document.body.removeChild(a); (window.URL || window.webkitURL).revokeObjectURL(url); } catch (e) {}
      }, 3000);
      return true;
    } catch (e) {
      console.log('LampaBackup', 'download error', e && e.message);
      return false;
    }
  }

  function pickFile(callback) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json,text/plain';
    input.style.position = 'fixed';
    input.style.left = '-1000px';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      try { document.body.removeChild(input); } catch (e) {}
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () { callback(String(reader.result || '')); };
      reader.onerror = function () { Lampa.Noty.show(t('lbk_read_err')); };
      reader.readAsText(file);
    });
    input.click();
  }

  // ---------------------------------------------------------------------------
  // Діалоги
  // ---------------------------------------------------------------------------
  function chooseCategories(title, counts, defaults, ctrl, onDone) {
    var items = [];
    CATS.forEach(function (c) {
      if (counts && !counts[c.id]) return;
      items.push({
        title: t('lbk_cat_' + c.id),
        subtitle: counts ? counts[c.id] + ' ' + (c.id === 'settings' ? '' : t('lbk_items')) : '',
        checkbox: true,
        checked: defaults ? !!defaults[c.id] : c.def,
        cat: c.id
      });
    });
    if (!items.length) { Lampa.Noty.show(t('lbk_nothing')); return back(ctrl); }
    items.push({ title: t('lbk_next'), next: true });
    items.push({ title: t('lbk_cancel'), cancel: true });

    Lampa.Select.show({
      title: title,
      items: items,
      onSelect: function (a) {
        if (!a.next) return back(ctrl);
        var sel = {}, any = false;
        items.forEach(function (it) { if (it.cat) { sel[it.cat] = !!it.checked; if (it.checked) any = true; } });
        if (!any) { Lampa.Noty.show(t('lbk_nothing')); return back(ctrl); }
        onDone(sel);
      },
      onBack: function () { back(ctrl); }
    });
  }

  function chooseMode(ctrl, onDone) {
    Lampa.Select.show({
      title: t('lbk_mode'),
      items: [
        { title: t('lbk_mode_merge'), subtitle: t('lbk_mode_merge_d'), mode: 'merge', selected: true },
        { title: t('lbk_mode_replace'), subtitle: t('lbk_mode_replace_d'), mode: 'replace' },
        { title: t('lbk_cancel') }
      ],
      onSelect: function (a) {
        if (!a.mode) return back(ctrl);
        onDone(a.mode);
      },
      onBack: function () { back(ctrl); }
    });
  }

  function tcInfo(backup) {
    var n = backup.server && backup.server.timecode && backup.server.timecode.rows ? backup.server.timecode.rows.length : 0;
    return backup.categories && backup.categories.indexOf('timeline') >= 0 ? ' (' + t('lbk_tc_server') + ': ' + n + ')' : '';
  }

  function buildBackup(selected, done) {
    attachServerTimecodes(collect(selected), done);
  }

  // --- експорт -----------------------------------------------------------------------------
  function exportFile() {
    var ctrl = controllerName();
    chooseCategories(t('lbk_what_export'), currentSummary(), null, ctrl, function (sel) {
      Lampa.Loading.start(function () { Lampa.Loading.stop(); });
      buildBackup(sel, function (backup) {
        Lampa.Loading.stop();
        var ok = downloadText('lampa-backup-' + stamp() + '.json', JSON.stringify(backup));
        Lampa.Noty.show(ok ? t('lbk_exported') + tcInfo(backup) : t('lbk_export_fail'));
        back(ctrl);
      });
    });
  }

  function exportServer() {
    var ctrl = controllerName();
    chooseCategories(t('lbk_what_export'), currentSummary(), null, ctrl, function (sel) {
      Lampa.Loading.start(function () { Lampa.Loading.stop(); });
      buildBackup(sel, function (backup) {
        storageSet(SERVER_PATH, backup, function () {
          Lampa.Loading.stop();
          Lampa.Noty.show(t('lbk_saved_server') + tcInfo(backup));
          back(ctrl);
          refreshInfo();
        }, function () {
          Lampa.Loading.stop();
          Lampa.Noty.show(t('lbk_server_fail'));
          back(ctrl);
        });
      });
    });
  }

  // --- імпорт ------------------------------------------------------------------------------
  function startImport(json, ctrl, forced) {
    var backup = normalizeBackup(json);
    if (!backup) { Lampa.Noty.show(t('lbk_bad_file')); return back(ctrl); }

    var counts = summary(backup);
    var title = t('lbk_what_import') + (backup.created ? ' (' + human(backup.created) + ')' : '');

    var go = function (sel, mode) {
      Lampa.Loading.start(function () {}, t('lbk_importing'));
      // Знімок поточного стану на сервер — для «Відкотити».
      var snap = collect(sel);
      snap.undo_of = backup.created || 0;
      var proceed = function () {
        applyImport(backup, sel, mode, function () {
          Lampa.Loading.stop();
          Lampa.Noty.show(t('lbk_done'));
          setTimeout(function () { window.location.reload(); }, 2500);
        });
      };
      if (forced && forced.noUndo) proceed();
      else attachServerTimecodes(snap, function (s) { storageSet(SERVER_UNDO, s, proceed, proceed); });
    };

    if (forced) return go(forced.selected || allPresent(counts), forced.mode || 'replace');

    chooseCategories(title, counts, defaultsFor(counts), ctrl, function (sel) {
      chooseMode(ctrl, function (mode) { go(sel, mode); });
    });
  }

  function allPresent(counts) { var s = {}; keys(counts).forEach(function (k) { s[k] = counts[k] > 0; }); return s; }
  function defaultsFor(counts) {
    var s = {};
    CATS.forEach(function (c) { s[c.id] = c.def && counts[c.id] > 0; });
    return s;
  }

  function importFile() {
    var ctrl = controllerName();
    pickFile(function (text) {
      var json = null;
      try { json = JSON.parse(text); } catch (e) {}
      startImport(json, ctrl);
    });
  }

  function importServer() {
    var ctrl = controllerName();
    Lampa.Loading.start(function () { Lampa.Loading.stop(); });

    var sources = [
      { path: SERVER_PATH, title: t('lbk_src_plugin') },
      { path: SERVER_LAMPAC, title: t('lbk_src_lampac') }
    ];
    var found = [], left = sources.length;

    sources.forEach(function (s) {
      storageGet(s.path, function (j) {
        found.push({ title: s.title, subtitle: human(j.fileInfo && j.fileInfo.changeTime), path: s.path, time: j.fileInfo ? j.fileInfo.changeTime : 0 });
        if (--left === 0) chooseSource();
      }, function () { if (--left === 0) chooseSource(); }, true);
    });

    function chooseSource() {
      Lampa.Loading.stop();
      if (!found.length) { Lampa.Noty.show(t('lbk_server_empty')); return back(ctrl); }
      found.sort(function (a, b) { return a.path === SERVER_PATH ? -1 : (b.path === SERVER_PATH ? 1 : 0); });
      var load = function (path) {
        Lampa.Loading.start(function () { Lampa.Loading.stop(); });
        storageGet(path, function (j) {
          Lampa.Loading.stop();
          var json = null;
          try { json = JSON.parse(j.data); } catch (e) {}
          startImport(json, ctrl);
        }, function () {
          Lampa.Loading.stop();
          Lampa.Noty.show(t('lbk_server_fail'));
          back(ctrl);
        });
      };
      if (found.length === 1) return load(found[0].path);
      Lampa.Select.show({
        title: t('lbk_choose_src'),
        items: found,
        onSelect: function (a) { load(a.path); },
        onBack: function () { back(ctrl); }
      });
    }
  }

  function undoImport() {
    var ctrl = controllerName();
    Lampa.Loading.start(function () { Lampa.Loading.stop(); });
    storageGet(SERVER_UNDO, function (j) {
      Lampa.Loading.stop();
      var json = null;
      try { json = JSON.parse(j.data); } catch (e) {}
      if (!json) { Lampa.Noty.show(t('lbk_server_empty')); return back(ctrl); }
      Lampa.Select.show({
        title: t('lbk_undo') + '?',
        items: [
          { title: t('lbk_undo'), subtitle: t('lbk_created') + ': ' + human(json.created), ok: true },
          { title: t('lbk_cancel') }
        ],
        onSelect: function (a) {
          if (!a.ok) return back(ctrl);
          var sel = {};
          (json.categories || []).forEach(function (c) { sel[c] = true; });
          startImport(json, ctrl, { selected: sel, mode: 'replace', noUndo: true });
        },
        onBack: function () { back(ctrl); }
      });
    }, function () {
      Lampa.Loading.stop();
      Lampa.Noty.show(t('lbk_server_empty'));
      back(ctrl);
    });
  }

  function openMenu() {
    var ctrl = controllerName();
    Lampa.Select.show({
      title: t('lbk_title'),
      items: [
        { title: t('lbk_export_file'), subtitle: t('lbk_export_descr'), fn: exportFile },
        { title: t('lbk_import_file'), subtitle: t('lbk_import_descr'), fn: importFile },
        { title: t('lbk_export_server'), subtitle: t('lbk_server_descr'), fn: exportServer },
        { title: t('lbk_import_server'), fn: importServer },
        { title: t('lbk_undo'), subtitle: t('lbk_undo_descr'), fn: undoImport }
      ],
      onSelect: function (a) { if (a.fn) a.fn(); else back(ctrl); },
      onBack: function () { back(ctrl); }
    });
  }

  // ---------------------------------------------------------------------------
  // Інтерфейс: налаштування + ліве меню
  // ---------------------------------------------------------------------------
  var infoNodes = [];
  function refreshInfo() {
    infoNodes = infoNodes.filter(function (n) { return n.closest('body').length; });
    if (!infoNodes.length) return;
    var show = function (txt) { infoNodes.forEach(function (n) { n.text(txt); }); };
    storageGet(SERVER_PATH, function (j) {
      show(t('lbk_last') + ': ' + human(j.fileInfo && j.fileInfo.changeTime));
    }, function () { show(t('lbk_last') + ': ' + t('lbk_none')); }, true);
  }

  var ICON = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v11m0 0l-4-4m4 4l4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 15v3a3 3 0 003 3h10a3 3 0 003-3v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  function addSettings() {
    Lampa.SettingsApi.addComponent({ component: 'lampa_backup', icon: ICON, name: t('lbk_title') });

    var btn = function (name, title, descr, fn, render) {
      Lampa.SettingsApi.addParam({
        component: 'lampa_backup',
        param: { name: name, type: 'button' },
        field: { name: title, description: descr },
        onRender: render,
        onChange: fn
      });
    };
    var ttl = function (name, title) {
      Lampa.SettingsApi.addParam({ component: 'lampa_backup', param: { name: name, type: 'title' }, field: { name: title } });
    };

    ttl('lbk_t_file', t('lbk_files_title'));
    btn('lbk_export_file', t('lbk_export_file'), t('lbk_export_descr'), exportFile);
    btn('lbk_import_file', t('lbk_import_file'), t('lbk_import_descr'), importFile);

    ttl('lbk_t_server', t('lbk_server_title'));
    btn('lbk_export_server', t('lbk_export_server'), t('lbk_server_descr'), exportServer, function (item) {
      var info = $('<div class="settings-param__descr" style="opacity:.7"></div>');
      item.append(info);
      infoNodes.push(info);
      setTimeout(refreshInfo, 50);
    });
    btn('lbk_import_server', t('lbk_import_server'), '', importServer);
    btn('lbk_undo', t('lbk_undo'), t('lbk_undo_descr'), undoImport);

    ttl('lbk_t_other', t('lbk_other_title'));
    Lampa.SettingsApi.addParam({
      component: 'lampa_backup',
      param: { name: 'lampa_backup_menu', type: 'trigger', default: true },
      field: { name: t('lbk_show_menu') },
      onChange: function () { toggleMenuButton(); }
    });
    Lampa.SettingsApi.addParam({
      component: 'lampa_backup',
      param: { name: 'lampa_backup_host', type: 'input', values: '', default: '', placeholder: SCRIPT_HOST || 'http://192.168.1.10:9118' },
      field: { name: t('lbk_host'), description: t('lbk_host_descr') + (SCRIPT_HOST ? ' (' + SCRIPT_HOST + ')' : '') }
    });
  }

  var menuButton = null;
  function toggleMenuButton() {
    var want = Lampa.Storage.get('lampa_backup_menu', true) !== false;
    if (want && !menuButton) {
      try {
        if (Lampa.Menu && Lampa.Menu.addButton) menuButton = Lampa.Menu.addButton(ICON, t('lbk_menu'), openMenu);
        else {
          menuButton = $('<li class="menu__item selector"><div class="menu__ico">' + ICON + '</div><div class="menu__text">' + t('lbk_menu') + '</div></li>');
          menuButton.on('hover:enter', openMenu);
          $('.menu .menu__list').eq(0).append(menuButton);
        }
        if (menuButton) menuButton.attr('data-action', 'lampa_backup');
      } catch (e) { menuButton = null; }
    } else if (!want && menuButton) {
      menuButton.remove();
      menuButton = null;
    }
  }

  function start() {
    addSettings();
    toggleMenuButton();
    // Публічний API — можна викликати з консолі або з інших плагінів.
    window.LampaBackup = {
      version: VERSION,
      open: openMenu,
      exportFile: exportFile,
      importFile: importFile,
      exportServer: exportServer,
      importServer: importServer,
      undo: undoImport,
      // importJson(obj) — показати діалог імпорту для готового об'єкта; opts = {selected, mode, noUndo} — без діалогу.
      importJson: function (json, opts) { startImport(json, controllerName(), opts); },
      collect: function (cats) {
        var sel = {};
        (cats || CATS.map(function (c) { return c.id; })).forEach(function (c) { sel[c] = true; });
        return collect(sel);
      }
    };
  }

  if (window.appready) start();
  else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') start(); });
})();
