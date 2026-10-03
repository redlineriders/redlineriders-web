// Redline Riders weboldal - kozos mag (2026-09-30).
// MIERT KOZOS: a /join es a /route oldal ugyanazt a nyelvvalasztast, bolt-gombot es RPC-hivast
// hasznalja; az App Store / Google Play link elesitesekor EGY helyen kell atirni (BOLT).
// A kulcs PUBLISHABLE: nyilvanosnak keszult (az appban is benne van); a 128 ota az anon
// szerep csak a ket nyilvanos DEFINER fuggvenyt hivhatja (136).
(function () {
  var SB_URL = 'https://uhikqhpaafgkhbqeurpa.supabase.co';
  var SB_KEY = 'sb_publishable_QVw4zARsatpfjw2lVXeXBg_Js3bOXEp';
  var NYELVEK = ['hu', 'de', 'en'];
  // Sorrend: URL ?lang= > a latogato korabbi valasztasa > a telefon/bongeszo nyelve > angol.
  // MIERT a latogato nyelve (Zsolt 2026-09-30): az oldalt a MEGHIVOTT / a posztert beolvaso olvassa.
  function nyelvValaszt() {
    var p = new URLSearchParams(location.search).get('lang');
    if (p && NYELVEK.indexOf(p) >= 0) return p;
    try { var m = localStorage.getItem('rr_lang'); if (m && NYELVEK.indexOf(m) >= 0) return m; } catch (e) {}
    var lista = navigator.languages || [navigator.language || 'en'];
    for (var i = 0; i < lista.length; i++) {
      var k = String(lista[i]).slice(0, 2).toLowerCase();
      if (NYELVEK.indexOf(k) >= 0) return k;
    }
    return 'en';
  }
  function nyelvSav(hely, aktiv, valt) {
    hely.textContent = '';
    NYELVEK.forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = k.toUpperCase();
      if (k === aktiv) b.className = 'aktiv';
      b.onclick = function () { try { localStorage.setItem('rr_lang', k); } catch (e) {} valt(k); };
      hely.appendChild(b);
    });
  }
  function platform() {
    var ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
    if (/Android/.test(ua)) return 'android';
    if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return 'ios'; // iPadOS asztali UA-val
    return 'desktop';
  }
  // Amikor az app elesedik: ide jon az url, es a gomb link lesz. Egy QR - minden platform.
  var BOLT = {
    ios: { hu: 'Hamarosan az App Store-ban', de: 'Bald im App Store', en: 'Coming soon to the App Store' },
    android: { hu: 'Hamarosan Androidra', de: 'Bald für Android', en: 'Coming soon for Android' }
  };
  function boltGombok(nyelv) {
    var p = platform();
    var melyik = p === 'desktop' ? ['ios', 'android'] : [p];
    return melyik.map(function (k) {
      var d = document.createElement('div');
      d.className = 'gomb masodlagos';
      d.textContent = BOLT[k][nyelv];
      return d;
    });
  }
  function rpc(nev, parameterek) {
    return fetch(SB_URL + '/rest/v1/rpc/' + nev, {
      method: 'POST',
      headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(parameterek)
    }).then(function (v) {
      if (!v.ok) throw new Error('HTTP ' + v.status);
      return v.json();
    });
  }
  // Csak a sajat Storage-bol jovo kepet engedjuk be (a DB-ben tarolt URL ne vihessen mashova).
  function biztonsagosKep(u) {
    return typeof u === 'string' && u.indexOf(SB_URL + '/storage/') === 0 ? u : null;
  }
  window.RR = { nyelvValaszt: nyelvValaszt, nyelvSav: nyelvSav, platform: platform,
    boltGombok: boltGombok, rpc: rpc, biztonsagosKep: biztonsagosKep };
})();
