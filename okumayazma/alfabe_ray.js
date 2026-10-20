/* =====================================================================
   ALFABE — HARF TANITIMI ARAÇ RAYI          (okumayazma/alfabe_ray.js)
   ---------------------------------------------------------------------
   Öğretmen (20.10.2026): "harf tanıtımında bi araç çubuğu vardı tam ekran
   yazılışı ve okunuşu benzer harfleri sınıflandıran tuşlar".

   NE OLMUŞTU
   Araç şeridi (#p1-switch: okunuşu benzer · yazılışı benzer · diziliş ·
   yazılış animasyonu · tam ekran) kumandanın içinde, en altta duruyor.
   09.10.2026 kuralı: "kumanda açıkken görünmesin, kapatılırsa ve harf
   tanıtımı kısmındaysa görünsün". Kumanda 14.10.2026'da soldan açılan
   çekmeceye dönünce kapalı kumanda ekran DIŞINA kayıyor; şerit de onunla
   birlikte gidiyordu — açıkken gizli, kapalıyken ekran dışında: hiç
   görünmüyordu.

   ŞİMDİ
   · Çekmece KAPALIYKEN ve Harf Tanıtımı açıkken şerit sol kenarda, kumanda
     okunun altında dikey bir RAY olur. İçerik bu rayın sağından başlar
     (üstüne binmez); tablo yeniden ölçülür.
   · Çekmece açılınca şerit yerine (çekmecenin dibine) döner; 09.10 kuralı
     aynen geçerli.
   · Telefonda (en çok 600px) ray yok: şerit açık çekmecenin dibinde durur.
   · Yüzen kumandada (çekmeceden koparılınca) eski davranış sürer.
   alfabe.html'e yalnız bu dosyanın etiketi eklendi; alfabe.js, alfabe.css
   ve öteki dosyalara dokunulmadı. Şeridin düğmeleri ve kimlikleri aynı
   (tahtaya yansıtma kimlikten yol bulduğu için yer değişmesi sorun değil).
   ===================================================================== */
(function () {
    'use strict';
    if (window.alfabeRay) return;

    function kur() {
        var sw = document.getElementById('p1-switch');
        var mini = document.getElementById('navMini');
        var app = document.querySelector('.main-app');
        if (!sw || !mini || !app) return;
        var yuva = sw.parentNode, sonraki = sw.nextSibling;
        var mq = window.matchMedia ? window.matchMedia('(max-width: 600px)') : null;

        var st = document.createElement('style');
        st.id = 'alfabeRayStil';
        st.textContent = [
            '#harfRay{display:none;}',
            'body.harf-ray #harfRay{display:flex; position:fixed; left:0; top:calc(50% + 44px); z-index:61;',
            '  padding:6px 4px; background:rgba(255,255,255,.97); border:1px solid #D7E6E1; border-left:0;',
            '  border-radius:0 14px 14px 0; box-shadow:3px 0 14px rgba(17,122,101,.22);}',
            /* şerit rayda: dikey, yalnız simgeler (anahtar ve ayıraç gizli —
               kalem ve hoparlör simgeleri zaten kendi kipini seçiyor) */
            'body.harf-ray #harfRay .hdr-switch{display:flex !important; flex-direction:column; align-items:center; gap:6px;',
            '  position:static !important; inset:auto; transform:none; margin:0; padding:0 !important; width:auto; height:auto;',
            '  background:transparent; border:0; box-shadow:none;}',
            'body.harf-ray #harfRay .hdr-switch .switch,',
            'body.harf-ray #harfRay .hdr-switch .hdr-ayirac{display:none !important;}',
            'body.harf-ray #harfRay .grp-ico{width:34px; height:34px; padding:3px; border-radius:10px;}',
            /* seçili kip (kalem / hoparlör) rayda daha belirgin */
            'body.harf-ray #harfRay .grp-ico--yazi.on{box-shadow:inset 0 0 0 2px rgba(22,160,133,.55);}',
            'body.harf-ray #harfRay .grp-ico--ses.on{box-shadow:inset 0 0 0 2px rgba(230,126,34,.6);}',
            /* ok ile ray aynı genişlikte, alt alta */
            'body.harf-ray #navKol,body.harf-ray #navKol:hover{width:43px;}',
            /* içerik rayın sağından başlar */
            'body.harf-ray .content-area{padding-left:48px !important;}',
            /* telefonda: şerit açık çekmecenin dibinde görünsün */
            '@media (max-width:600px){',
            '  .main-app:not(.nav-gizli) .nav-mini.nm-kenar .hdr-switch:not(.gizli){display:flex !important;}',
            '}'
        ].join('\n');
        document.head.appendChild(st);

        var ray = document.createElement('div');
        ray.id = 'harfRay';
        ray.setAttribute('role', 'toolbar');
        ray.setAttribute('aria-label', 'Harf tanıtımı araçları');
        /* .main-app içinde: sayfanın "kumanda açık / kapalı" kuralları rayı da kapsar */
        app.appendChild(ray);

        function gerekli() {
            return mini.classList.contains('nm-kenar') && app.classList.contains('nav-gizli') &&
                !sw.classList.contains('gizli') && !(mq && mq.matches);
        }
        var son = null, zaman = 0;
        function guncelle() {
            var g = gerekli();
            if (g === son) return;
            son = g;
            if (g) {
                ray.appendChild(sw);
                document.body.classList.add('harf-ray');
            } else {
                if (sw.parentNode !== yuva) yuva.insertBefore(sw, (sonraki && sonraki.parentNode === yuva) ? sonraki : null);
                document.body.classList.remove('harf-ray');
            }
            /* içerik alanı daraldı / genişledi: tablo kendini yeniden ölçsün */
            clearTimeout(zaman);
            zaman = setTimeout(function () {
                try { window.dispatchEvent(new Event('resize')); } catch (e) { }
            }, 30);
        }
        var gozcu = new MutationObserver(guncelle);
        gozcu.observe(app, { attributes: true, attributeFilter: ['class'] });
        gozcu.observe(mini, { attributes: true, attributeFilter: ['class'] });
        gozcu.observe(sw, { attributes: true, attributeFilter: ['class'] });
        if (mq) {
            if (mq.addEventListener) mq.addEventListener('change', guncelle);
            else if (mq.addListener) mq.addListener(guncelle);
        }
        guncelle();
        window.alfabeRay = { guncelle: guncelle, acikMi: function () { return !!son; } };
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', kur);
    else kur();
})();
