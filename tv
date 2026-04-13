(function () {
    'use strict';

    Lampa.Template.add('trakt_progress', `
        <div class="trakt-progress">
            <div class="trakt-progress__title"></div>
            <div class="trakt-progress__descr"></div>
            <div class="trakt-progress__bar"><div class="trakt-progress__line"></div></div>
        </div>
    `);

    $('<style>.trakt-progress{padding:1em}.trakt-progress__title{font-size:1.2em;margin-bottom:.5em}.trakt-progress__descr{color:rgba(255,255,255,.5);margin-bottom:1em;height:3.5em;overflow:hidden;line-height:1.2}.trakt-progress__bar{height:.5em;background:rgba(255,255,255,.1);border-radius:.5em;overflow:hidden}.trakt-progress__line{height:100%;background:#fff;width:0;transition:width .2s}.sync-result{padding:20px;text-align:center}.sync-result__item{margin:10px 0;font-size:1.1em}</style>').appendTo('body');

    function startPlugin() {
        var network = new Lampa.Reguest();
        var api_url = 'http://192.168.1.54:8000/sync/watchlist';
        var my_token = 'any_token_here';

        var selected_categories = {
            'wath': true, 'like': true, 'book': true, 'history': true,
            'look': true, 'viewed': true, 'continued': true
        };

        var category_map = {
            'wath': 'Подивитись пізніше', 'like': 'Подобається', 'book': 'Закладки',
            'history': 'Історія', 'look': 'Дивлюсь', 'viewed': 'Переглянуто', 'continued': 'Продовжити'
        };

        function showCategorySelector() {
            var all_favorites = Lampa.Favorite.all();
            var items = [];
            for (var cat in all_favorites) {
                if (Array.isArray(all_favorites[cat]) && all_favorites[cat].length > 0) {
                    items.push({
                        title: (selected_categories[cat] ? '✅ ' : '⬜ ') + (category_map[cat] || cat),
                        category: cat
                    });
                }
            }
            items.push({ title: '🚀 ПОЧАТИ ВІДПРАВКУ', confirm: true });

            Lampa.Select.show({
                title: 'Виберіть категорії',
                items: items,
                onSelect: function (item) {
                    if (item.confirm) {
                        var export_list = [];
                        items.forEach(function(el) {
                            if (el.category && selected_categories[el.category]) {
                                all_favorites[el.category].forEach(function(f) {
                                    var id = f.id || (f.ids ? f.ids.tmdb : 0);
                                    if (id) export_list.push({
                                        tmdb_id: id,
                                        type: f.type == 'tv' ? 'show' : 'movie',
                                        category: el.category,
                                        title: f.name || f.title
                                    });
                                });
                            }
                        });
                        if (export_list.length) runProgress('Синхронізація', export_list, false);
                        else Lampa.Noty.show('Нічого не вибрано');
                    } else {
                        selected_categories[item.category] = !selected_categories[item.category];
                        showCategorySelector();
                    }
                },
                onBack: showMainMenu
            });
        }

        function showMainMenu() {
            Lampa.Select.show({
                title: 'Trakt Local Sync',
                items: [
                    { title: '📤 Відправити на сервер...', action: 'select' },
                    { title: '📥 Імпортувати з сервера', action: 'import' }
                ],
                onSelect: function (item) {
                    if (item.action === 'select') showCategorySelector();
                    else if (item.action === 'import') {
                        Lampa.Noty.show('Завантаження...');
                        network.native(api_url, function(result) {
                            if (result && result.length) runProgress('Імпорт', result, true);
                        }, function(){ Lampa.Noty.show('Сервер недоступний'); }, false, { headers: { 'Authorization': 'Bearer ' + my_token } });
                    }
                },
                onBack: function () { Lampa.Controller.toggle('head'); }
            });
        }

        function runProgress(title, items, isImport) {
            var progress_html = Lampa.Template.get('trakt_progress');
            progress_html.find('.trakt-progress__title').text(title);

            Lampa.Modal.open({
                title: 'Зачекайте...',
                html: progress_html,
                onBack: function () {
                    Lampa.Modal.close();
                    network.clear();
                }
            });

            var index = 0;
            var errors = 0;
            var success = 0;

            var next = function() {
                if (index >= items.length) {
                    // Очищення та закриття прогресу
                    progress_html.remove();
                    Lampa.Modal.close();

                    setTimeout(function() {
                        Lampa.Modal.close(); // Страховка

                        var result_html = $(`
                            <div class="sync-result">
                                <div class="sync-result__item">Успішно: ${success}</div>
                                <div class="sync-result__item">Помилок: ${errors}</div>
                                <div class="simple-button selector" style="margin-top: 20px">Закрити</div>
                            </div>
                        `);

                        result_html.find('.selector').on('hover:enter', function() {
                            Lampa.Modal.close();
                            Lampa.Controller.toggle('head');
                        });

                        Lampa.Modal.open({
                            title: 'Результат',
                            html: result_html,
                            onBack: function() {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('head');
                            }
                        });
                    }, 300);
                    return;
                }

                var current = items[index];
                var percent = Math.round((index / items.length) * 100);

                progress_html.find('.trakt-progress__descr').html(
                    `Прогрес: ${percent}% | Помилок: ${errors}<br>Поточний: ${current.title || 'ID:' + current.tmdb_id}`
                );
                progress_html.find('.trakt-progress__line').css('width', percent + '%');

                if (isImport) {
                    try {
                        Lampa.Favorite.add(current.category || 'book', current);
                        success++;
                    } catch(e) { errors++; }
                    index++; setTimeout(next, 10);
                } else {
                    network.native(api_url, function() {
                        success++; index++; next();
                    }, function() {
                        errors++; index++; setTimeout(next, 100);
                    }, JSON.stringify({ tmdb_id: current.tmdb_id, type: current.type, category: current.category }), {
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + my_token }
                    });
                }
            };
            next();
        }

        // ПОВЕРНУТО ОРИГІНАЛЬНУ ІКОНКУ
        var menu_item = $(`
            <div class="head__action selector">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/>
                </svg>
            </div>
        `);

        menu_item.on('hover:enter', showMainMenu);
        $('.head .head__actions').append(menu_item);
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow('app', function (e) { if (e.type == 'ready') startPlugin(); });
})();
