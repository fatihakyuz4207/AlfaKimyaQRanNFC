import { useStand } from '../stand.jsx'

const BEATS = [
  'High Solid Alkyd Resins kartını seç.',
  'Industrial Coatings dalına gir.',
  'ALFAKYD F37 X75 sayfasında videoyu ve TDS indirmeyi göster, sonra sepete ekle.',
  'Sepeti aç. Onay kutusunu boş bırakıp gönder; e-posta kaydedilmez. Sonra iş e-postası ve onayı işaretle.',
  'Mini katalog önizlemesinden sonra stand panosunda bu ziyaretin NFC ve lead sayısına düştüğünü göster.',
]

function openScenario(src, ch) {
  const url = new URL(window.location.href)
  url.hash = '#/'
  url.search = ''
  url.searchParams.set('src', src)
  url.searchParams.set('ch', ch)
  url.searchParams.set('utm_source', 'ecs2027')
  url.searchParams.set('utm_medium', ch)
  url.searchParams.set('utm_campaign', src)
  url.searchParams.set('replay', String(Date.now()))
  window.location.assign(url.toString())
}

export function Demo() {
  const { loadSample } = useStand()
  const origin = window.location.origin
  const onThisMachine = /localhost|127\.0\.0\.1/.test(window.location.hostname)

  return (
    <div className="px-5 pb-10">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">ECS 2027 · sunum</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Stand demosu</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Dört dakika. Önce ziyaretçi telefonunu, sonra stand panosunu göster. Ziyaretçi ekranı İngilizce kalır; fuar anlatımı buradan yürür.
      </p>

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => openScenario('wall_hs', 'nfc')}
          className="rounded-[24px] bg-alfa px-4 py-4 text-left text-white"
        >
          <span className="block text-[11px] uppercase tracking-[0.14em] text-white/70">Senaryo 1</span>
          <span className="mt-2 block text-lg font-semibold">High Solid duvar, NFC</span>
          <span className="mt-1 block text-sm text-white/80">Ziyaretçi akışını buradan başlat.</span>
        </button>
        <button
          type="button"
          onClick={() => openScenario('totem_wd', 'qr')}
          className="rounded-[24px] bg-eco px-4 py-4 text-left text-white"
        >
          <span className="block text-[11px] uppercase tracking-[0.14em] text-white/70">Senaryo 2</span>
          <span className="mt-2 block text-lg font-semibold">Water Dilutable totem, QR</span>
          <span className="mt-1 block text-sm text-white/80">İkinci temas noktasını göster.</span>
        </button>
        <a href="#/insights" className="rounded-[24px] bg-white px-4 py-4 shadow-card">
          <span className="block text-[11px] uppercase tracking-[0.14em] text-slate-500">Pano</span>
          <span className="mt-2 block text-lg font-semibold">Stand insights</span>
          <span className="mt-1 block text-sm text-slate-600">NFC, QR, aile ve lead toplamları.</span>
        </a>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <ol className="grid gap-3">
          {BEATS.map((beat, index) => (
            <li key={beat} className="flex gap-3 rounded-2xl bg-white p-4 shadow-card">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-alfa text-sm font-semibold text-white">
                {index + 1}
              </span>
              <p className="pt-1 text-sm leading-relaxed">{beat}</p>
            </li>
          ))}
        </ol>
        <aside className="rounded-[24px] bg-alfa-deep p-5 text-white">
          <h2 className="text-lg font-semibold">Söylenecek cümle</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            Katalog için kayıt yok. Ziyaretçi aileyi ve dalı seçer, beğendiğini telefonda tutar. E-posta yalnızca mini katalogu ister ve onay kutusunu işaretlerse alınır.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            Webhook bağlı değilse e-posta kutuya gitmez; katalog bu cihazda hazırlanır. Bunu demoda açık söyle.
          </p>
          <button
            type="button"
            className="mt-5 h-11 w-full rounded-2xl bg-white text-sm font-semibold text-alfa"
            onClick={() => {
              loadSample()
              window.location.hash = '#/insights'
            }}
          >
            Örnek stand gününü yükle
          </button>
          <p className="mt-3 text-xs leading-relaxed text-white/60">
            Pano boşsa bunu kullan. Örnek adresler visitor.n@example.com şeklindedir.
          </p>
        </aside>
      </section>

      <section className="mt-8 rounded-[24px] bg-white p-5 shadow-card">
        <h2 className="text-lg font-semibold">Telefonda göstermek</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Bilgisayar ve telefon aynı Wi‑Fi ağında olsun. Bu sekme:{' '}
          <span className="font-medium text-ink">{origin}/#/demo</span>
        </p>
        {onThisMachine && (
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Telefonda localhost açılmaz. Geliştirme sunucusunun yazdığı Network adresini kullan, sonuna /#/demo ekle.
          </p>
        )}
      </section>
    </div>
  )
}
