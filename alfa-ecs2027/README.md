# Alfa Kimya ECS 2027

Mobil stand microsite. Uygulama indirme ve hesap yok. Shortlist bu tarayıcının `localStorage` alanında durur. E-posta yalnızca mini katalog istenip onay kutusu işaretlenince kaydedilir.

## Çalıştırma

```bash
npm install
npm run dev
```

Telefonda aynı ağdan `http://<bilgisayar-ip>:5173` adresini açın.

```bash
npm test
npm run build
```

## NFC / QR

Her etiket dinamik bir URL kullanır.

- Duvar, high solid, NFC: `/?src=wall_hs&ch=nfc`
- Duvar, high solid, QR: `/?src=wall_hs&ch=qr`
- Duvar, water dilutable, NFC: `/?src=wall_wd&ch=nfc`
- Totem, water dilutable, QR: `/?src=totem_wd&ch=qr`

Üretim adresi `https://exp.alfakimya.com/ecs27` olarak varsayılır. Insights ekranındaki liste kopyalanabilir.

## E-posta

`.env` içine webhook yazın:

```
VITE_LEAD_WEBHOOK=https://example.com/hooks/alfa-ecs27
VITE_PUBLIC_BASE=https://exp.alfakimya.com/ecs27
```

Gönderilen JSON `ecs27.mini_catalog` olayıdır. Ziyaretçi HTML/metin katalog gövdesini ve satış bildirimi aynı paketin içindedir. Webhook boşsa adres yalnızca bu cihazda saklanır ve katalog önizlemesi ekranda kalır.

## Insights

Sağ alttaki Stand insights bağlantısı veya `#/insights`. Metrikler anonim oturum ve olay toplamıdır. Kayıtlı e-postalar varsayılan olarak maskelenir.
