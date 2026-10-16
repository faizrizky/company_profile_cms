/**
 * The guided tour of the admin: one spotlight per step, gliding from element
 * to element across pages. Admins edit the steps in Settings → Tutorial; these
 * are the defaults (and what runs until that page is first saved).
 *
 * Each step says what the thing does in the admin and what it changes on the
 * website. In the text, lines starting with "- " are shown as bullet points.
 *
 * Route placeholders (resolved by the tour): `{first}` opens the collection's
 * first document (never `/create`: on collections with autosave that would
 * make a draft), `{version}` an earlier version of a document.
 *
 * Shared by the server and the browser, so no imports.
 */

export type TutorialRole = 'admin' | 'editor'

/** `admin`: an element of the admin page. `editor`: inside the visual editor (the website's studio, in an iframe). */
export type TutorialFrame = 'admin' | 'editor'

export type TutorialStep = {
  id: string
  enabled?: boolean | null
  roles?: TutorialRole[] | null
  /** Admin path the step happens on, after /admin: '' (Statistics), '/collections/pages', '/account'… */
  route?: string | null
  frame?: TutorialFrame | null
  /** CSS selector of the highlighted element; several matches are highlighted together. Empty: a centred card. */
  target?: string | null
  /** Clicked before highlighting, e.g. a tab to open (CSS selector, same frame). */
  clickFirst?: string | null
  titleEn?: string | null
  titleId?: string | null
  bodyEn?: string | null
  bodyId?: string | null
}

const ALL: TutorialRole[] = ['admin', 'editor']
const ADMIN: TutorialRole[] = ['admin']
/** The home page: always there, and it opens in the visual editor. */
const HOME_PAGE = '/collections/pages/1'
const HOME_FORM = `${HOME_PAGE}/form`
const DRAG = '#heading-_dragHandle, .cell-_dragHandle'
/** The n-th tab of a document's tab row (Hero, Challenges…). */
const tab = (n: number) => `.tabs-field__tabs .tabs-field__tab-button:nth-child(${n})`
/** Form tab, sections: collapse every section, open one, and the parts inside it. */
const COLLAPSE_ALL = '#field-layout .blocks-field__header-action'
const openSection = (n: number) => `#layout-row-${n} .collapsible__toggle`
/** First step of a section: only that section open. */
const onlySection = (n: number) => [tab(1), COLLAPSE_ALL, openSection(n)].join(' ;; ')
/** Later steps of a section: make sure it is still open (after Back…). */
const inSection = (n: number) => [tab(1), openSection(n)].join(' ;; ')
/** A card (Content, Media…) inside section n, by its position. */
const sectionCard = (n: number, i: number) => `#field-collapsible-layout__${n}___index-${i}`
/** A field inside section n. */
const sectionField = (n: number, name: string) => `#field-layout__${n}__${name}`
/** A card (group of fields) that contains the field `name`. */
const cardWith = (name: string) => `.collapsible-field:has(#field-${name})`
/** A field by its name, label included. */
const field = (name: string) => `.field-type:has(#field-${name}), #field-${name}.field-type`

const lines = (...l: string[]) => l.join('\n')

const step = (s: TutorialStep): TutorialStep => ({ enabled: true, roles: ALL, frame: 'admin', ...s })

export const DEFAULT_TUTORIAL_STEPS: TutorialStep[] = [
  // ── Introduction ──────────────────────────────────────────────────────
  step({
    id: 'welcome',
    route: '',
    titleEn: 'Welcome to Falah CMS!',
    titleId: 'Selamat datang di Falah CMS!',
    bodyEn: lines(
      'This tour shows every part of the CMS and what it changes on the website.',
      '- Next / Back (or the arrow keys) to move',
      '- Skip tutorial (or Esc) to stop',
      '- Replay it any time from your Account page',
    ),
    bodyId: lines(
      'Tutorial ini menunjukkan setiap bagian CMS dan pengaruhnya ke website.',
      '- Lanjut / Kembali (atau tombol panah) untuk berpindah',
      '- Lewati tutorial (atau Esc) untuk berhenti',
      '- Bisa diulang kapan saja dari halaman Akun',
    ),
  }),
  step({
    id: 'sidebar',
    route: '',
    target: '.nav .nav__wrap',
    titleEn: 'The menu',
    titleId: 'Menu',
    bodyEn: lines(
      'Everything is here, grouped by section:',
      '- Overview: statistics',
      '- Content: pages, media, partners, certifications',
      '- Solutions: categories and products',
      '- Inbox: messages from the website',
      '- System and Settings',
      'The icon at the top folds the menu into a row of icons.',
    ),
    bodyId: lines(
      'Semua menu ada di sini, dikelompokkan per bagian:',
      '- Ringkasan: statistik',
      '- Konten: halaman, media, partner, sertifikasi',
      '- Solusi: kategori dan produk',
      '- Inbox: pesan dari website',
      '- Sistem dan Pengaturan',
      'Ikon di atas menciutkan menu jadi deretan ikon.',
    ),
  }),

  // ── Statistics ────────────────────────────────────────────────────────
  step({
    id: 'statistics',
    route: '',
    target: '.falah-stat-card, .falah-stats__message',
    titleEn: 'Statistics: key numbers',
    titleId: 'Statistik: angka utama',
    bodyEn: lines(
      'Website visitors over the last 3 days, from Microsoft Clarity:',
      '- Sessions: visits (bots not counted)',
      '- Pages per session: pages seen in one visit',
      '- Scroll depth: how far down pages people read',
      '- Active time: time actually spent interacting',
      'Hover the ⓘ next to a number for what it means.',
    ),
    bodyId: lines(
      'Pengunjung website 3 hari terakhir dari Microsoft Clarity:',
      '- Kunjungan: jumlah kunjungan (bot tidak dihitung)',
      '- Halaman per kunjungan: halaman yang dilihat dalam satu kunjungan',
      '- Kedalaman scroll: seberapa jauh halaman dibaca',
      '- Waktu aktif: waktu benar-benar berinteraksi',
      'Arahkan kursor ke ⓘ untuk penjelasan tiap angka.',
    ),
  }),
  step({
    id: 'statistics-users',
    route: '',
    target: '.falah-stat-panel:has(.falah-users)',
    titleEn: 'Visitors overview',
    titleId: 'Ringkasan pengunjung',
    bodyEn: lines(
      '- Unique users: people, each counted once',
      '- Sessions per user: how often they come back',
      '- Sessions per device: the share of PC, mobile and tablet',
    ),
    bodyId: lines(
      '- Pengunjung unik: jumlah orang, masing-masing dihitung sekali',
      '- Kunjungan per pengunjung: seberapa sering mereka kembali',
      '- Kunjungan per perangkat: porsi PC, HP, dan tablet',
    ),
  }),
  step({
    id: 'statistics-insights',
    route: '',
    target: '.falah-stat-panel:has(.falah-insights)',
    titleEn: 'Insights',
    titleId: 'Insight',
    bodyEn: lines(
      'Signs that visitors struggle (share of sessions):',
      '- Rage click: clicking the same spot again and again',
      '- Dead click: clicking something that does nothing',
      '- Excessive scroll: scrolling without finding what they want',
      '- Quick back: leaving a page right after opening it',
      '- JavaScript / click errors: something broke',
      'High numbers point at a page worth checking.',
    ),
    bodyId: lines(
      'Tanda pengunjung kesulitan (persentase kunjungan):',
      '- Rage click: klik berulang di titik yang sama',
      '- Dead click: klik pada sesuatu yang tidak bereaksi',
      '- Scroll berlebihan: scroll tanpa menemukan yang dicari',
      '- Quick back: langsung meninggalkan halaman',
      '- Error JavaScript / klik: ada yang rusak',
      'Angka tinggi menandakan halaman yang perlu dicek.',
    ),
  }),
  step({
    id: 'statistics-technology',
    route: '',
    target: '.falah-stat-grid:not(.falah-stat-grid--wide) > :last-child',
    titleEn: 'Technology & location',
    titleId: 'Teknologi & lokasi',
    bodyEn: lines(
      'Switch between the tabs:',
      '- Browser: Chrome, Safari…',
      '- Device: PC, mobile, tablet',
      '- OS: Windows, Android, iOS…',
      '- Country: where visitors are',
    ),
    bodyId: lines(
      'Pindah antar tab:',
      '- Browser: Chrome, Safari, …',
      '- Perangkat: PC, HP, tablet',
      '- OS: Windows, Android, iOS, …',
      '- Negara: lokasi pengunjung',
    ),
  }),
  step({
    id: 'statistics-acquisition',
    route: '',
    target: '.falah-stat-grid--wide > :first-child',
    titleEn: 'Traffic sources',
    titleId: 'Sumber kunjungan',
    bodyEn: lines(
      'Where visitors come from:',
      '- Channel: search, direct, social, referral…',
      '- Source: the site that sent them (google, instagram…)',
      '- Medium and Campaign: from links tagged for a campaign',
    ),
    bodyId: lines(
      'Dari mana pengunjung datang:',
      '- Channel: pencarian, langsung, media sosial, rujukan, …',
      '- Sumber: situs pengirimnya (google, instagram, …)',
      '- Medium dan Kampanye: dari link yang diberi tag kampanye',
    ),
  }),
  step({
    id: 'statistics-pages',
    route: '',
    target: '.falah-stat-panel--table',
    titleEn: 'Popular pages',
    titleId: 'Halaman populer',
    bodyEn: lines(
      'The most visited pages, with for each:',
      '- Sessions and share of all visits',
      '- Scroll depth',
      '- Active time',
    ),
    bodyId: lines(
      'Halaman yang paling banyak dikunjungi, dengan untuk tiap halaman:',
      '- Kunjungan dan porsinya',
      '- Kedalaman scroll',
      '- Waktu aktif',
    ),
  }),
  step({
    id: 'statistics-updated',
    route: '',
    target: '.falah-stats__updated',
    titleEn: 'When the numbers were updated',
    titleId: 'Kapan data diperbarui',
    bodyEn: lines(
      '- The overview refreshes every 4 hours, browsers and sources every 12 hours',
      '- Amber: Clarity’s daily limit is reached, the last saved data is shown',
      '- “Open Clarity” has recordings and heatmaps',
    ),
    bodyId: lines(
      '- Ringkasan diperbarui tiap 4 jam, browser dan sumber kunjungan tiap 12 jam',
      '- Kuning: batas harian Clarity tercapai, yang tampil data terakhir',
      '- “Buka Clarity” berisi rekaman dan heatmap',
    ),
  }),

  // ── Website pages: list ───────────────────────────────────────────────
  step({
    id: 'pages',
    route: '/collections/pages',
    target: '#nav-pages',
    titleEn: 'Pages',
    titleId: 'Halaman',
    bodyEn: 'Every page of the website (Home, About, Contact…) is managed here.',
    bodyId: 'Setiap halaman website (Beranda, Tentang, Kontak, …) diatur di sini.',
  }),
  step({
    id: 'list-controls',
    route: '/collections/pages',
    target: '.list-controls',
    titleEn: 'Search, columns and filters',
    titleId: 'Cari, kolom, dan filter',
    bodyEn: lines(
      'Every list in the CMS (pages, media, products, messages…) has the same tools:',
      '- Search: type part of the title',
      '- Columns: what the table shows',
      '- Filters: only the rows that match',
    ),
    bodyId: lines(
      'Semua daftar di CMS (halaman, media, produk, pesan, …) punya alat yang sama:',
      '- Cari: ketik sebagian judul',
      '- Kolom: apa saja yang tampil di tabel',
      '- Filter: hanya baris yang sesuai',
    ),
  }),
  step({
    id: 'list-columns',
    route: '/collections/pages',
    clickFirst: '.list-controls__toggle-columns',
    target: '.list-controls__columns',
    titleEn: 'Columns',
    titleId: 'Kolom',
    bodyEn: lines(
      '- Click a column to show or hide it in the table',
      '- Drag them to change their order',
      'Your choice is remembered for you only; the website is not affected.',
    ),
    bodyId: lines(
      '- Klik nama kolom untuk menampilkan atau menyembunyikannya',
      '- Seret untuk mengubah urutannya',
      'Pilihan ini hanya diingat untuk Anda; website tidak terpengaruh.',
    ),
  }),
  step({
    id: 'list-filters',
    route: '/collections/pages',
    clickFirst: '.list-controls__toggle-where',
    target: '.list-controls__where',
    titleEn: 'Filters',
    titleId: 'Filter',
    bodyEn: lines(
      '- Add filter: pick a field (e.g. Status), a condition (equals, contains…) and a value',
      '- Several filters together narrow the list ("and"), “or” widens it',
      '- Remove a filter with its ✕',
      'Handy to find, for example, every page still in draft.',
    ),
    bodyId: lines(
      '- Tambah filter: pilih field (mis. Status), kondisi (sama dengan, mengandung, …), dan nilainya',
      '- Beberapa filter sekaligus mempersempit daftar ("dan"), “atau” memperluasnya',
      '- Hapus filter dengan ✕',
      'Berguna misalnya untuk mencari semua halaman yang masih draft.',
    ),
  }),
  step({
    id: 'row-actions',
    route: '/collections/pages',
    target: '#heading-rowActions, .cell-rowActions',
    titleEn: 'Actions',
    titleId: 'Aksi',
    bodyEn: lines('- Edit: open the page', '- Delete: administrators only, after a confirmation'),
    bodyId: lines('- Edit: buka halamannya', '- Hapus: hanya Admin, setelah konfirmasi'),
  }),
  step({
    id: 'pages-create',
    route: '/collections/pages',
    target: '.list-create-new-doc__create-new-button',
    titleEn: 'A new page',
    titleId: 'Halaman baru',
    bodyEn:
      'Creates a page with a title and an address (slug). It appears on the website at that address once published; to put it in the top menu, add it in Navigation.',
    bodyId:
      'Membuat halaman baru dengan judul dan alamat (slug). Halaman tampil di website pada alamat itu setelah dipublish. Supaya muncul di menu atas, tambahkan di Navigasi.',
  }),
  step({
    id: 'doc-tabs',
    route: HOME_PAGE,
    target: '.doc-tabs',
    titleEn: 'Visual, Form, Versions, API',
    titleId: 'Visual, Form, Versions, API',
    bodyEn: lines(
      '- Visual: edit the page directly, with drag & drop',
      '- Form: the same page as a form, with its address and SEO',
      '- Versions: the history of changes',
      '- API: the raw data, for developers',
    ),
    bodyId: lines(
      '- Visual: edit langsung dengan drag & drop',
      '- Form: halaman yang sama dalam bentuk formulir, beserta alamat dan SEO',
      '- Versions: riwayat perubahan',
      '- API: data mentah, untuk developer',
    ),
  }),

  // ── Visual editor ─────────────────────────────────────────────────────
  step({
    id: 'editor-blocks',
    route: HOME_PAGE,
    frame: 'editor',
    clickFirst: '[class*="_NavItem_"]:nth-child(1) [class*="_NavItem-link_"]',
    target: '[class*="_PuckLayout-nav_"], [class*="_PuckPluginTab--visible_"]',
    titleEn: 'Blocks',
    titleId: 'Blok',
    bodyEn: lines(
      'Drag a block onto the page to add it:',
      '- Layout: free section with columns, spacing',
      '- Text: badge, heading, paragraph',
      '- Actions and media: button, image, card',
      '- Ready-made sections: Hero, FAQ, Partners, Contact form, Office map…',
    ),
    bodyId: lines(
      'Seret blok ke halaman untuk menambahkannya:',
      '- Tata letak: section bebas berkolom, jarak',
      '- Teks: badge, judul, paragraf',
      '- Aksi dan media: tombol, gambar, kartu',
      '- Section siap pakai: Hero, FAQ, Partner, Form kontak, Peta kantor, …',
    ),
  }),
  step({
    id: 'editor-canvas',
    route: HOME_PAGE,
    frame: 'editor',
    target: '[class*="_PuckCanvas-inner_"]',
    titleEn: 'The page',
    titleId: 'Halaman',
    bodyEn: lines(
      'The page as visitors will see it.',
      '- Click a part to select it',
      '- Drag it to move it',
      '- Its text and settings open on the right',
    ),
    bodyId: lines(
      'Tampilan halaman seperti yang dilihat pengunjung.',
      '- Klik bagian untuk memilihnya',
      '- Seret untuk memindahkannya',
      '- Teks dan pengaturannya terbuka di panel kanan',
    ),
  }),
  step({
    id: 'editor-fields',
    route: HOME_PAGE,
    frame: 'editor',
    target: '[class*="_PuckFields_"]',
    titleEn: 'Properties',
    titleId: 'Properti',
    bodyEn: lines(
      '- Nothing selected: the page title and the editor’s own language',
      '- A part selected: all its text, images, links and styles',
      '- Links: picked from a list of pages, or typed for anything else',
    ),
    bodyId: lines(
      '- Tidak ada yang dipilih: judul halaman dan bahasa tampilan editor',
      '- Bagian dipilih: semua teks, gambar, link, dan gayanya',
      '- Link: dipilih dari daftar halaman, atau diketik untuk alamat lain',
    ),
  }),
  step({
    id: 'editor-outline',
    route: HOME_PAGE,
    frame: 'editor',
    clickFirst: '[class*="_NavItem_"]:nth-child(2) [class*="_NavItem-link_"]',
    target: '[class*="_PuckLayout-nav_"], [class*="_PuckPluginTab--visible_"]',
    titleEn: 'Structure',
    titleId: 'Struktur',
    bodyEn: 'All the sections of the page, in order. Drag them to reorder: the website shows the sections in exactly this order.',
    bodyId: 'Semua bagian halaman secara berurutan. Seret untuk mengubah urutan: website menampilkan bagian-bagian persis dalam urutan ini.',
  }),
  step({
    id: 'editor-language',
    route: HOME_PAGE,
    frame: 'editor',
    target: '.studio-select',
    titleEn: 'Content language',
    titleId: 'Bahasa konten',
    bodyEn: lines(
      'The website is in Indonesian and English.',
      '- The layout is shared, the text is per language',
      '- Empty Indonesian text falls back to English',
    ),
    bodyId: lines(
      'Website punya versi Indonesia dan Inggris.',
      '- Susunan bagian sama, teksnya per bahasa',
      '- Teks Indonesia yang kosong memakai versi Inggris',
    ),
  }),
  step({
    id: 'editor-viewports',
    route: HOME_PAGE,
    frame: 'editor',
    target: '[class*="_PuckCanvas-controls_"]',
    titleEn: 'Desktop, tablet, phone',
    titleId: 'Desktop, tablet, HP',
    bodyEn: 'Check how the page looks on a phone, a tablet and a desktop, and zoom in or out.',
    bodyId: 'Cek tampilan halaman di HP, tablet, dan desktop, serta perbesar atau perkecil tampilannya.',
  }),
  step({
    id: 'editor-save',
    route: HOME_PAGE,
    frame: 'editor',
    target: '.studio-actions',
    titleEn: 'Save or publish',
    titleId: 'Simpan atau publish',
    bodyEn: lines(
      '- Save draft: keeps your changes without showing them',
      '- Publish: puts them live, the website updates within seconds',
      '- View page: opens the live page in a new tab',
    ),
    bodyId: lines(
      '- Simpan draft: menyimpan perubahan tanpa menampilkannya',
      '- Publish: langsung tayang, website ikut berubah dalam hitungan detik',
      '- Lihat halaman: membuka halaman di website pada tab baru',
    ),
  }),

  // ── Form tab: page settings ───────────────────────────────────────────
  step({
    id: 'form-general',
    route: HOME_FORM,
    target: '#field-collapsible-_index-0, .field-type:has(#field-slug)',
    titleEn: 'Title and address (slug)',
    titleId: 'Judul dan alamat (slug)',
    bodyEn: lines(
      '- Title: the page’s name in the CMS and in the browser tab',
      '- Slug: its address on the website (about → /about), filled in from the title',
      'Changing the slug moves the page: old links to it stop working.',
    ),
    bodyId: lines(
      '- Judul: nama halaman di CMS dan di tab browser',
      '- Slug: alamatnya di website (about → /about), terisi otomatis dari judul',
      'Mengubah slug memindahkan halaman: link lama ke halaman itu tidak berfungsi lagi.',
    ),
  }),
  step({
    id: 'form-sections',
    route: HOME_FORM,
    clickFirst: [tab(1), COLLAPSE_ALL].join(' ;; '),
    target: '#field-layout',
    titleEn: 'Sections (as a form)',
    titleId: 'Bagian (dalam bentuk formulir)',
    bodyEn: lines(
      'The same sections as in Visual, top to bottom as on the website:',
      '- Add section: a new one at the end',
      '- Click a section to open its fields',
      '- Drag the ⠿ handle to reorder',
      '- ⋯ to duplicate or remove',
    ),
    bodyId: lines(
      'Bagian yang sama seperti di Visual, dari atas ke bawah persis seperti di website:',
      '- Tambah bagian: bagian baru di paling bawah',
      '- Klik bagian untuk membuka isiannya',
      '- Seret pegangan ⠿ untuk mengubah urutan',
      '- ⋯ untuk menduplikat atau menghapus',
    ),
  }),

  // ── Form tab: the home page's sections, one at a time ─────────────────
  // Hero
  step({
    id: 'form-hero',
    route: HOME_FORM,
    clickFirst: onlySection(0),
    target: sectionCard(0, 0),
    titleEn: 'Hero: content',
    titleId: 'Hero: konten',
    bodyEn: lines(
      'The first thing visitors see. Every section is closed; only this one is open.',
      '- Variant: Home (left, with partner logos), Centered, or Page (with a small label)',
      '- Title: the big headline (Enter for a new line)',
      '- Description: the text under it',
    ),
    bodyId: lines(
      'Bagian pertama yang dilihat pengunjung. Semua section ditutup, hanya yang ini dibuka.',
      '- Varian: Home (rata kiri + logo partner), Centered, atau Page (dengan label kecil)',
      '- Judul: tulisan besar (Enter untuk pindah baris)',
      '- Deskripsi: teks di bawahnya',
    ),
  }),
  step({
    id: 'form-hero-media',
    route: HOME_FORM,
    clickFirst: inSection(0),
    target: sectionCard(0, 1),
    titleEn: 'Hero: background',
    titleId: 'Hero: latar',
    bodyEn: lines(
      '- Background: the image (or video) behind the text',
      '- Background (mobile): optional, a version cropped for phones',
      'Use “Choose from existing” to reuse a file from Media.',
    ),
    bodyId: lines(
      '- Latar belakang: gambar (atau video) di belakang teks',
      '- Latar belakang (HP): opsional, versi yang dipotong untuk HP',
      'Pakai “Pilih dari yang sudah ada” untuk memakai file dari Media.',
    ),
  }),
  step({
    id: 'form-hero-buttons',
    route: HOME_FORM,
    clickFirst: inSection(0),
    target: sectionField(0, 'buttons'),
    titleEn: 'Hero: buttons',
    titleId: 'Hero: tombol',
    bodyEn: lines(
      'Up to 4 buttons under the text. Each one has:',
      '- Label: the text on the button',
      '- Link: a page, or your own address',
      '- Style: Fill (main) or Outline',
      'Drag them to change their order.',
    ),
    bodyId: lines(
      'Maks. 4 tombol di bawah teks. Masing-masing punya:',
      '- Label: tulisan di tombol',
      '- Link: halaman tujuan, atau alamat sendiri',
      '- Gaya: Fill (utama) atau Outline',
      'Seret untuk mengubah urutannya.',
    ),
  }),
  step({
    id: 'form-hero-marquee',
    route: HOME_FORM,
    clickFirst: inSection(0),
    target: sectionCard(0, 3),
    titleEn: 'Hero: partner logos',
    titleId: 'Hero: logo partner',
    bodyEn: lines(
      '- Partner logo marquee: the row of logos moving to the left, under the text',
      '- Partner logos: pick which ones; empty = every partner ticked “Show in hero”',
      '- Partner description on hover: a card with the partner’s description above its logo',
      '- Scroll icon: the arrow inviting visitors to scroll down',
    ),
    bodyId: lines(
      '- Marquee logo partner: deretan logo yang bergerak ke kiri, di bawah teks',
      '- Logo partner: pilih logo yang tampil; kosong = semua partner yang dicentang “Tampil di Hero”',
      '- Keterangan partner saat hover: kartu berisi deskripsi partner di atas logonya',
      '- Ikon scroll: panah ajakan menggulir ke bawah',
    ),
  }),

  // Problems + image
  step({
    id: 'form-problems',
    route: HOME_FORM,
    clickFirst: onlySection(1),
    target: sectionField(1, 'header'),
    titleEn: 'Problems: header',
    titleId: 'Daftar masalah: header',
    bodyEn: lines(
      'Every section starts with the same header:',
      '- Small label (eyebrow): the short text above the title',
      '- Title: Enter for a new line',
      '- Description: the introduction under it',
    ),
    bodyId: lines(
      'Setiap section diawali header yang sama:',
      '- Label kecil (eyebrow): teks pendek di atas judul',
      '- Judul: Enter untuk pindah baris',
      '- Deskripsi: pengantar di bawahnya',
    ),
  }),
  step({
    id: 'form-problems-items',
    route: HOME_FORM,
    clickFirst: inSection(1),
    target: sectionField(1, 'items'),
    titleEn: 'Problems: items',
    titleId: 'Daftar masalah: item',
    bodyEn: lines(
      'Up to 6 problems, each with:',
      '- Title and description',
      '- Image: shown on the right while this item is open (empty = the section image)',
      'On the website, hovering or clicking an item opens it.',
    ),
    bodyId: lines(
      'Maks. 6 masalah, masing-masing dengan:',
      '- Judul dan deskripsi',
      '- Gambar: tampil di kanan saat item ini dibuka (kosong = gambar section)',
      'Di website, hover atau klik item untuk membukanya.',
    ),
  }),
  step({
    id: 'form-problems-media',
    route: HOME_FORM,
    clickFirst: inSection(1),
    target: `${sectionCard(1, 1)}, ${sectionCard(1, 3)}`,
    titleEn: 'Problems: images',
    titleId: 'Daftar masalah: gambar',
    bodyEn: lines('- Background: behind the whole section', '- Image: the picture on the right, shown when no item has its own'),
    bodyId: lines('- Latar belakang: di belakang seluruh section', '- Gambar: gambar di kanan, dipakai bila item tidak punya gambar sendiri'),
  }),

  // Video showcase
  step({
    id: 'form-video',
    route: HOME_FORM,
    clickFirst: onlySection(2),
    target: sectionField(2, 'header'),
    titleEn: 'Video showcase: header',
    titleId: 'Video showcase: header',
    bodyEn: 'The small label, title and introduction above the video.',
    bodyId: 'Label kecil, judul, dan pengantar di atas video.',
  }),
  step({
    id: 'form-video-media',
    route: HOME_FORM,
    clickFirst: inSection(2),
    target: sectionCard(2, 1),
    titleEn: 'Video showcase: poster and video',
    titleId: 'Video showcase: poster dan video',
    bodyEn: lines(
      '- Poster: the image shown before playing',
      '- Video: MP4/WebM, played right on the page when the play button is clicked',
    ),
    bodyId: lines(
      '- Poster: gambar yang tampil sebelum diputar',
      '- Video: MP4/WebM, diputar langsung di halaman saat tombol play diklik',
    ),
  }),
  step({
    id: 'form-video-caption',
    route: HOME_FORM,
    clickFirst: inSection(2),
    target: sectionCard(2, 2),
    titleEn: 'Video showcase: caption and link',
    titleId: 'Video showcase: keterangan dan link',
    bodyEn: lines(
      '- Caption title and text: shown over the video',
      '- Video link: an outside video (YouTube…), used when no video is uploaded',
    ),
    bodyId: lines(
      '- Judul dan teks keterangan: tampil di atas video',
      '- Link video: video luar (YouTube, …), dipakai bila video tidak diunggah',
    ),
  }),

  // Solution highlights
  step({
    id: 'form-highlights',
    route: HOME_FORM,
    clickFirst: onlySection(3),
    target: `${sectionField(3, 'header')}, ${sectionCard(3, 1)}`,
    titleEn: 'Solution highlights: header and background',
    titleId: 'Sorotan solusi: header dan latar',
    bodyEn: lines('- Header: small label, title and introduction', '- Background: behind the section'),
    bodyId: lines('- Header: label kecil, judul, dan pengantar', '- Latar belakang: di belakang section'),
  }),
  step({
    id: 'form-highlights-featured',
    route: HOME_FORM,
    clickFirst: inSection(3),
    target: sectionField(3, 'featured'),
    titleEn: 'Solution highlights: featured card',
    titleId: 'Sorotan solusi: kartu utama',
    bodyEn: lines(
      'The large card:',
      '- Image, title and description',
      '- Tags label and tags: shown on hover',
      '- Button: label and link',
    ),
    bodyId: lines(
      'Kartu besar:',
      '- Gambar, judul, dan deskripsi',
      '- Label tag dan tag: tampil saat di-hover',
      '- Tombol: label dan link',
    ),
  }),
  step({
    id: 'form-highlights-items',
    route: HOME_FORM,
    clickFirst: inSection(3),
    target: sectionField(3, 'items'),
    titleEn: 'Solution highlights: other cards',
    titleId: 'Sorotan solusi: kartu lainnya',
    bodyEn: 'Up to 7 smaller cards next to the featured one, each with an image, a title, a text and tags. Drag them to reorder.',
    bodyId: 'Maks. 7 kartu lebih kecil di samping kartu utama, masing-masing dengan gambar, judul, teks, dan tag. Seret untuk mengubah urutan.',
  }),

  // Expertise + stats
  step({
    id: 'form-expertise',
    route: HOME_FORM,
    clickFirst: onlySection(4),
    target: `${sectionField(4, 'header')}, ${sectionCard(4, 1)}`,
    titleEn: 'Expertise: header and background',
    titleId: 'Keahlian: header dan latar',
    bodyEn: lines('- Header: small label, title and introduction', '- Background: behind the section'),
    bodyId: lines('- Header: label kecil, judul, dan pengantar', '- Latar belakang: di belakang section'),
  }),
  step({
    id: 'form-expertise-stats',
    route: HOME_FORM,
    clickFirst: inSection(4),
    target: sectionField(4, 'stats'),
    titleEn: 'Expertise: numbers',
    titleId: 'Keahlian: angka',
    bodyEn: lines(
      'Up to 4 numbers that count up when they come into view:',
      '- Value: the number',
      '- Suffix: +, %, K+ Hour…',
      '- Label: what it counts',
    ),
    bodyId: lines(
      'Maks. 4 angka yang bergerak naik saat terlihat:',
      '- Nilai: angkanya',
      '- Akhiran: +, %, K+ Hour, …',
      '- Label: yang dihitung',
    ),
  }),
  step({
    id: 'form-expertise-cards',
    route: HOME_FORM,
    clickFirst: inSection(4),
    target: sectionField(4, 'cards'),
    titleEn: 'Expertise: cards',
    titleId: 'Keahlian: kartu',
    bodyEn: 'Up to 6 cards, each with an image or icon, a title and a text. Drag them to reorder.',
    bodyId: 'Maks. 6 kartu, masing-masing dengan gambar atau ikon, judul, dan teks. Seret untuk mengubah urutan.',
  }),

  // Certifications
  step({
    id: 'form-certifications',
    route: HOME_FORM,
    clickFirst: onlySection(5),
    target: `${sectionCard(5, 0)}, ${sectionField(5, 'header')}`,
    titleEn: 'Certifications: style and header',
    titleId: 'Sertifikasi: gaya dan header',
    bodyEn: lines(
      '- Variant: Cards (icon + description) or Gallery (certificate photos that can be enlarged)',
      '- Header: small label, title and introduction',
    ),
    bodyId: lines(
      '- Varian: Cards (ikon + deskripsi) atau Gallery (foto sertifikat yang bisa diperbesar)',
      '- Header: label kecil, judul, dan pengantar',
    ),
  }),
  step({
    id: 'form-certifications-items',
    route: HOME_FORM,
    clickFirst: inSection(5),
    target: sectionCard(5, 3),
    titleEn: 'Certifications: which ones',
    titleId: 'Sertifikasi: yang ditampilkan',
    bodyEn: 'Pick up to 6 certifications, in the order shown. Empty: all of them, in their order under Certifications.',
    bodyId: 'Pilih maks. 6 sertifikasi, sesuai urutan yang tampil. Kosong: semuanya, sesuai urutan di menu Sertifikasi.',
  }),

  // FAQ
  step({
    id: 'form-faq',
    route: HOME_FORM,
    clickFirst: onlySection(6),
    target: sectionField(6, 'header'),
    titleEn: 'FAQ: header',
    titleId: 'FAQ: header',
    bodyEn: 'The small label, title and introduction above the questions.',
    bodyId: 'Label kecil, judul, dan pengantar di atas daftar pertanyaan.',
  }),
  step({
    id: 'form-faq-items',
    route: HOME_FORM,
    clickFirst: inSection(6),
    target: sectionField(6, 'items'),
    titleEn: 'FAQ: questions',
    titleId: 'FAQ: pertanyaan',
    bodyEn: lines(
      'Up to 20 questions, each with:',
      '- Question',
      '- Answer: opens when visitors click the question',
      'Drag them to change their order.',
    ),
    bodyId: lines(
      'Maks. 20 pertanyaan, masing-masing dengan:',
      '- Pertanyaan',
      '- Jawaban: terbuka saat pengunjung mengklik pertanyaannya',
      'Seret untuk mengubah urutannya.',
    ),
  }),

  // Call to action
  step({
    id: 'form-cta',
    route: HOME_FORM,
    clickFirst: onlySection(7),
    target: `${sectionCard(7, 0)}, ${sectionField(7, 'header')}`,
    titleEn: 'Call to action: style and header',
    titleId: 'Ajakan (CTA): gaya dan header',
    bodyEn: lines(
      'The closing invitation, usually at the bottom of the page.',
      '- Variant: Simple, or With media / video',
      '- Header: small label, title and introduction',
    ),
    bodyId: lines(
      'Ajakan penutup, biasanya di bagian bawah halaman.',
      '- Varian: Simple, atau Dengan media / video',
      '- Header: label kecil, judul, dan pengantar',
    ),
  }),
  step({
    id: 'form-cta-media',
    route: HOME_FORM,
    clickFirst: inSection(7),
    target: `${sectionCard(7, 2)}, ${sectionCard(7, 4)}, ${sectionCard(7, 5)}`,
    titleEn: 'Call to action: background and media',
    titleId: 'Ajakan (CTA): latar dan media',
    bodyEn: lines(
      '- Background, and its version for phones',
      '- Media (With media variant): an image next to the text',
      '- Video: played on the page (the media image is its poster), or an outside video link',
    ),
    bodyId: lines(
      '- Latar belakang, dan versinya untuk HP',
      '- Media (varian dengan media): gambar di samping teks',
      '- Video: diputar di halaman (gambar media jadi posternya), atau link video luar',
    ),
  }),
  step({
    id: 'form-cta-buttons',
    route: HOME_FORM,
    clickFirst: inSection(7),
    target: sectionField(7, 'buttons'),
    titleEn: 'Call to action: buttons',
    titleId: 'Ajakan (CTA): tombol',
    bodyEn: 'The buttons of the invitation, e.g. “Contact us”: label, link and style (Fill or Outline).',
    bodyId: 'Tombol ajakan, misalnya “Hubungi kami”: label, link, dan gaya (Fill atau Outline).',
  }),
  step({
    id: 'form-seo',
    route: HOME_FORM,
    clickFirst: tab(2),
    target: '#field-meta',
    titleEn: 'SEO',
    titleId: 'SEO',
    bodyEn: lines(
      '- Title (up to 70 characters) and description (up to 160): what Google shows',
      '- Share image: shown when the link is shared on WhatsApp or social media',
      'Empty: the page title and the site’s description are used.',
    ),
    bodyId: lines(
      '- Judul (maks. 70 karakter) dan deskripsi (maks. 160): yang tampil di Google',
      '- Gambar share: tampil saat link dibagikan di WhatsApp atau media sosial',
      'Kosong: memakai judul halaman dan deskripsi situs.',
    ),
  }),
  step({
    id: 'form-publish',
    route: HOME_FORM,
    target: '.doc-controls__controls',
    titleEn: 'Status and publishing',
    titleId: 'Status dan publish',
    bodyEn: lines(
      '- Changes are saved as a draft every 2 seconds',
      '- Save draft: saves the draft right away, without publishing',
      '- Publish: puts them on the website',
      '- The arrow next to it: schedule publishing for a date and time',
      '- Status: whether the live page has unpublished changes',
    ),
    bodyId: lines(
      '- Perubahan otomatis tersimpan sebagai draft tiap 2 detik',
      '- Simpan Draf: simpan draft saat itu juga, tanpa menayangkan',
      '- Publish: menayangkannya di website',
      '- Panah di sampingnya: jadwalkan tayang pada tanggal dan jam tertentu',
      '- Status: ada perubahan yang belum dipublish atau tidak',
    ),
  }),

  // ── Versions ──────────────────────────────────────────────────────────
  step({
    id: 'versions',
    route: HOME_PAGE,
    target: '[data-falah-tab="versions"]',
    titleEn: 'Versions',
    titleId: 'Versions',
    bodyEn: 'Every save is kept (up to 50 per page). The number is how many there are.',
    bodyId: 'Setiap simpanan tercatat (sampai 50 per halaman). Angkanya adalah jumlah versi yang ada.',
  }),
  step({
    id: 'versions-list',
    route: `${HOME_PAGE}/versions`,
    target: '.versions table',
    titleEn: 'The list of versions',
    titleId: 'Daftar versi',
    bodyEn: lines(
      '- Updated at: when it was saved; click it to open that version',
      '- Version ID: its number',
      '- Status: draft, published, or currently live',
      'Newest first; more pages at the bottom.',
    ),
    bodyId: lines(
      '- Diperbarui pada: waktu disimpan; klik untuk membuka versi itu',
      '- ID versi: nomornya',
      '- Status: draft, dipublish, atau sedang tayang',
      'Yang terbaru di atas; halaman berikutnya ada di bawah.',
    ),
  }),
  step({
    id: 'versions-pick',
    route: `${HOME_PAGE}/versions/{version}`,
    target: '.view-version-controls-bottom',
    titleEn: 'Moving between versions',
    titleId: 'Pindah antar versi',
    bodyEn: lines(
      'This page compares two versions.',
      '- Left: the older version',
      '- Right: the newer one',
      'Change either dropdown to compare other versions; the time between them shows in the middle.',
    ),
    bodyId: lines(
      'Halaman ini membandingkan dua versi.',
      '- Kiri: versi yang lebih lama',
      '- Kanan: versi yang lebih baru',
      'Ganti salah satu pilihan untuk membandingkan versi lain; selisih waktunya tampil di tengah.',
    ),
  }),
  step({
    id: 'versions-options',
    route: `${HOME_PAGE}/versions/{version}`,
    target: '.view-version-controls-top',
    titleEn: 'What to compare',
    titleId: 'Yang dibandingkan',
    bodyEn: lines(
      '- Modified only: hides everything that didn’t change',
      '- Languages: compare the English text, the Indonesian, or both',
    ),
    bodyId: lines(
      '- Hanya yang berubah: menyembunyikan semua yang tidak berubah',
      '- Bahasa: bandingkan teks Inggris, Indonesia, atau keduanya',
    ),
  }),
  step({
    id: 'versions-diff',
    route: `${HOME_PAGE}/versions/{version}`,
    target: '.view-version__diff-wrap',
    titleEn: 'The changes',
    titleId: 'Item perubahan',
    bodyEn: lines(
      '- Groups (General, Sections, SEO) with the number of changes in each',
      '- Sections are listed as Block 01, Block 02… in page order',
      '- For each field: the old value on the left (red), the new one on the right (green)',
      '- Added or removed sections and items are marked as such',
    ),
    bodyId: lines(
      '- Grup (Umum, Bagian, SEO) dengan jumlah perubahan di tiap grup',
      '- Bagian halaman ditulis Blok 01, Blok 02, … sesuai urutan di halaman',
      '- Tiap field: nilai lama di kiri (merah), nilai baru di kanan (hijau)',
      '- Bagian atau item yang ditambah atau dihapus diberi tanda',
    ),
  }),
  step({
    id: 'versions-restore',
    route: `${HOME_PAGE}/versions/{version}`,
    target: '.restore-version',
    titleEn: 'Restoring a version',
    titleId: 'Memulihkan versi',
    bodyEn: lines(
      '- Restore this version: the page goes back to it',
      '- The arrow next to it: restore it as a draft first',
      'Then check the page and publish to show it on the website.',
    ),
    bodyId: lines(
      '- Pulihkan versi ini: halaman kembali ke versi tersebut',
      '- Panah di sampingnya: pulihkan sebagai draft dulu',
      'Setelah itu cek halamannya, lalu publish supaya tampil di website.',
    ),
  }),

  // ── Media ─────────────────────────────────────────────────────────────
  step({
    id: 'media',
    route: '/collections/media',
    target: '.collection-list .table',
    titleEn: 'Media',
    titleId: 'Media',
    bodyEn: lines(
      'All images, videos and PDFs used on the website:',
      '- File name: the readable name it was uploaded with',
      '- Size in MB and type',
      '- Last changed',
    ),
    bodyId: lines(
      'Semua gambar, video, dan PDF yang dipakai di website:',
      '- Nama file: nama asli saat diunggah',
      '- Ukuran dalam MB dan jenis file',
      '- Terakhir diubah',
    ),
  }),
  step({
    id: 'media-upload',
    route: '/collections/media',
    target: '.list-create-new-doc__create-new-button',
    titleEn: 'Uploading',
    titleId: 'Mengunggah',
    bodyEn: lines(
      '- One file, or several at once',
      '- Up to 50 MB per file, checked before saving',
      '- Images get smaller copies for the website automatically, so pages stay fast',
    ),
    bodyId: lines(
      '- Satu file, atau banyak sekaligus',
      '- Maks. 50 MB per file, dicek sebelum disimpan',
      '- Gambar otomatis dibuatkan versi lebih kecil untuk website, supaya halaman tetap cepat',
    ),
  }),
  step({
    id: 'media-file',
    route: '/collections/media/{first}',
    target: '.file-details',
    titleEn: 'The file',
    titleId: 'File',
    bodyEn: lines(
      '- Preview, size and type',
      '- Replace the file: it changes everywhere it is used on the website',
      '- Edit image: crop it or set its focus point',
    ),
    bodyId: lines(
      '- Pratinjau, ukuran, dan jenis file',
      '- Ganti file: berubah di semua bagian website yang memakainya',
      '- Edit gambar: potong atau atur titik fokusnya',
    ),
  }),
  step({
    id: 'media-details',
    route: '/collections/media/{first}',
    target: cardWith('displayName'),
    titleEn: 'File details',
    titleId: 'Detail file',
    bodyEn: lines(
      '- File name: as shown in the media library (a name already used gets -1, -2…)',
      '- Alternative text (alt): describes the image; screen readers read it and Google uses it',
    ),
    bodyId: lines(
      '- Nama file: yang tampil di pustaka media (nama yang sudah dipakai diberi -1, -2, …)',
      '- Teks alternatif (alt): deskripsi gambar; dibacakan pembaca layar dan dipakai Google',
    ),
  }),

  // ── Partners ──────────────────────────────────────────────────────────
  step({
    id: 'partners',
    route: '/collections/partners',
    target: '#nav-partners, #nav-certifications',
    titleEn: 'Partners & certifications',
    titleId: 'Partner & sertifikasi',
    bodyEn: 'The logos of partners and of certifications shown on the website.',
    bodyId: 'Logo partner dan sertifikasi yang tampil di website.',
  }),
  step({
    id: 'partners-order',
    route: '/collections/partners',
    target: DRAG,
    titleEn: 'Order of the partners',
    titleId: 'Urutan partner',
    bodyEn: 'Drag a row by its handle to move it up or down. The website shows the partner logos (the moving logo strip) in this order.',
    bodyId: 'Seret baris lewat pegangannya untuk menaikkan atau menurunkan. Website menampilkan logo partner (deretan logo yang bergerak) dalam urutan ini.',
  }),
  step({
    id: 'partners-content',
    route: '/collections/partners/{first}',
    target: '#field-collapsible-_index-1',
    titleEn: 'A partner',
    titleId: 'Data partner',
    bodyEn: lines(
      '- Name and website of the partner',
      '- Description: on the home page hero, shown in a card when the logo is hovered',
      '- Show in hero: the logo also runs in the hero’s logo strip',
    ),
    bodyId: lines(
      '- Nama dan website partner',
      '- Deskripsi: di Hero beranda, tampil dalam kartu saat logo di-hover',
      '- Tampil di Hero: logonya ikut di deretan logo Hero',
    ),
  }),
  step({
    id: 'partners-logo',
    route: '/collections/partners/{first}',
    target: '#field-collapsible-_index-2',
    titleEn: 'Logos',
    titleId: 'Logo',
    bodyEn: lines(
      '- Logo: shown muted on the website',
      '- Logo (hover): the original colour version, shown when the mouse is over it',
    ),
    bodyId: lines('- Logo: tampil dengan warna redup di website', '- Logo (hover): versi berwarna aslinya, tampil saat kursor diarahkan'),
  }),
  step({
    id: 'partners-publish',
    route: '/collections/partners/{first}',
    target: '.doc-controls__controls',
    titleEn: 'Draft first, then publish',
    titleId: 'Draft dulu, baru publish',
    bodyEn: lines(
      'Like pages, partners, certifications, solution categories and products:',
      '- Save changes as a draft every 2 seconds (or right away with Save draft), not yet on the website',
      '- Publish: puts them on the website (the arrow: schedule it)',
      '- Versions tab: every save is kept and can be restored',
      'A new item stays hidden from the website until it is published.',
    ),
    bodyId: lines(
      'Sama seperti halaman, partner, sertifikasi, kategori solusi, dan produk:',
      '- Menyimpan perubahan sebagai draft tiap 2 detik (atau langsung lewat Simpan Draf), belum tampil di website',
      '- Publish: menayangkannya di website (panahnya: jadwalkan tayang)',
      '- Tab Versions: setiap simpanan tercatat dan bisa dipulihkan',
      'Item baru tidak tampil di website sampai dipublish.',
    ),
  }),

  // ── Certifications ────────────────────────────────────────────────────
  step({
    id: 'certifications-order',
    route: '/collections/certifications',
    target: DRAG,
    titleEn: 'Order of the certifications',
    titleId: 'Urutan sertifikasi',
    bodyEn: 'Drag a row by its handle to move it up or down. The certifications section and the certificate gallery (About page) follow this order.',
    bodyId: 'Seret baris lewat pegangannya untuk menaikkan atau menurunkan. Section sertifikasi dan galeri sertifikat (halaman About) mengikuti urutan ini.',
  }),
  step({
    id: 'certifications-content',
    route: '/collections/certifications/{first}',
    target: '#field-collapsible-_index-1',
    titleEn: 'A certification',
    titleId: 'Data sertifikasi',
    bodyEn: lines('- Title: e.g. ISO 9001', '- Subtitle: shown under the title', '- Description: the text on its card'),
    bodyId: lines('- Judul: misalnya ISO 9001', '- Subjudul: tampil di bawah judul', '- Deskripsi: teks di kartunya'),
  }),
  step({
    id: 'certifications-icon',
    route: '/collections/certifications/{first}',
    target: '#field-collapsible-_index-2',
    titleEn: 'Icon & certificate',
    titleId: 'Ikon & sertifikat',
    bodyEn: lines(
      '- Icon, and its colour version shown on hover',
      '- Icon shape: square, wide or narrow, so it fits the card',
      '- Certificate image: shown in the gallery on the About page (without it, the certification is left out)',
      '- Focus: keeps the top or the centre of the certificate visible',
    ),
    bodyId: lines(
      '- Ikon, dan versi berwarnanya yang tampil saat di-hover',
      '- Bentuk ikon: persegi, lebar, atau sempit, supaya pas di kartu',
      '- Gambar sertifikat: tampil di galeri halaman About (tanpa gambar, sertifikasi tidak ikut tampil)',
      '- Fokus: bagian atas atau tengah sertifikat yang terlihat',
    ),
  }),

  // ── Solutions ─────────────────────────────────────────────────────────
  step({
    id: 'solutions',
    route: '/collections/solution-categories',
    target: '#nav-solution-categories, #nav-products',
    titleEn: 'Solutions & products',
    titleId: 'Solusi & produk',
    bodyEn: 'Solution categories and their products: the “Our Solutions” menu, the solutions overview and each category’s detail page.',
    bodyId: 'Kategori solusi beserta produknya: menu “Our Solutions”, ringkasan solusi, dan halaman detail tiap kategori.',
  }),
  step({
    id: 'categories-order',
    route: '/collections/solution-categories',
    target: DRAG,
    titleEn: 'Order of the categories',
    titleId: 'Urutan kategori',
    bodyEn: 'Drag a row by its handle to move it up or down. The categories appear in this order in the “Our Solutions” menu and as the tabs of the solutions overview.',
    bodyId: 'Seret baris lewat pegangannya untuk menaikkan atau menurunkan. Kategori tampil dalam urutan ini di menu “Our Solutions” dan sebagai tab di ringkasan solusi.',
  }),
  step({
    id: 'category-visual',
    route: '/collections/solution-categories/{first}',
    frame: 'editor',
    target: '[class*="_PuckCanvas-inner_"]',
    titleEn: 'The category page, visually',
    titleId: 'Halaman kategori, secara visual',
    bodyEn: lines(
      'A category opens on its real page (/solution/<name>), made of four fixed sections:',
      '- Hero: title, description, background and the "recommended for" chips',
      '- Challenges: the cards with an icon',
      '- Showcase: the tabs, one per product, with their video',
      '- Call to action: the closing block and the button',
      'Click a section to select it, and click its text to type right there.',
    ),
    bodyId: lines(
      'Kategori terbuka di halaman aslinya (/solution/<nama>), yang terdiri dari empat bagian tetap:',
      '- Hero: judul, deskripsi, gambar latar, dan chip "direkomendasikan untuk"',
      '- Challenges: kartu dengan ikon',
      '- Showcase: tab, satu per produk, dengan videonya',
      '- Ajakan (CTA): blok penutup dan tombolnya',
      'Klik sebuah bagian untuk memilihnya, dan klik teksnya untuk mengetik langsung di situ.',
    ),
  }),
  step({
    id: 'category-visual-fields',
    route: '/collections/solution-categories/{first}',
    frame: 'editor',
    target: '[class*="_PuckFields_"]',
    titleEn: 'The section’s settings',
    titleId: 'Pengaturan bagian',
    bodyEn: lines(
      'On the right, what the selected section holds:',
      '- Images and videos: Replace, or pick from the media library',
      '- Lists (challenges, tabs): add, reorder and remove rows',
      '- Save draft keeps it unpublished; Publish puts it on the website',
      'Address, menu visibility, the detail page and SEO are in the Form tab.',
    ),
    bodyId: lines(
      'Di kanan, isi bagian yang dipilih:',
      '- Gambar dan video: Ganti, atau pilih dari pustaka media',
      '- Daftar (tantangan, tab): tambah, atur urutan, dan hapus baris',
      '- Simpan draf tidak menayangkan; Publish menayangkannya di website',
      'Alamat, tampil di menu, halaman detail, dan SEO ada di tab Form.',
    ),
  }),
  step({
    id: 'category-settings',
    route: '/collections/solution-categories/{first}/form',
    target: `${field('slug')}, ${field('hasDetailPage')}, ${field('showInMegaMenu')}`,
    titleEn: 'Address, detail page, menu',
    titleId: 'Alamat, halaman detail, menu',
    bodyEn: lines(
      '- Slug: the address of the detail page (/solution/<slug>)',
      '- Detail page: turn it off while the content isn’t ready (the page then shows “not found”)',
      '- Mega menu: untick to hide the category and its products from the menu',
      'Changes are saved as drafts until published.',
    ),
    bodyId: lines(
      '- Slug: alamat halaman detail (/solution/<slug>)',
      '- Halaman detail: matikan selama kontennya belum siap (halaman tampil “tidak ditemukan”)',
      '- Mega menu: hilangkan centang untuk menyembunyikan kategori beserta produknya dari menu',
      'Perubahan tersimpan sebagai draft sampai dipublish.',
    ),
  }),
  step({
    id: 'category-hero',
    route: '/collections/solution-categories/{first}/form',
    clickFirst: tab(1),
    target: '#field-hero',
    titleEn: 'Hero tab',
    titleId: 'Tab Hero',
    bodyEn: lines(
      'The top of the detail page:',
      '- Title: empty = the category name',
      '- Description',
      '- Background image',
      '- Recommended for: up to 6 labels shown as chips under the text',
    ),
    bodyId: lines(
      'Bagian paling atas halaman detail:',
      '- Judul: kosong = nama kategori',
      '- Deskripsi',
      '- Gambar latar',
      '- Recommended For: maks. 6 label yang tampil sebagai chip di bawah teks',
    ),
  }),
  step({
    id: 'category-challenges',
    route: '/collections/solution-categories/{first}/form',
    clickFirst: tab(2),
    target: '#field-challenges',
    titleEn: 'Challenges tab',
    titleId: 'Tab Tantangan',
    bodyEn: lines(
      'The problems this solution answers:',
      '- Eyebrow (small label), title and description',
      '- Items (up to 8): an icon (clock = downtime, coins = cost, person = human error, shuffle = inconsistency), a title and a text',
      'Drag the items to change their order on the page.',
    ),
    bodyId: lines(
      'Masalah yang dijawab solusi ini:',
      '- Eyebrow (label kecil), judul, dan deskripsi',
      '- Item (maks. 8): ikon (jam = downtime, koin = biaya, orang = human error, acak = tidak konsisten), judul, dan teks',
      'Seret item untuk mengubah urutannya di halaman.',
    ),
  }),
  step({
    id: 'category-showcase',
    route: '/collections/solution-categories/{first}/form',
    clickFirst: tab(3),
    target: '#field-showcase',
    titleEn: 'Showcase tab',
    titleId: 'Tab Showcase',
    bodyEn: lines(
      '- Background image, and an optional silent looping video',
      '- Brochure PDF: empty = the button goes to Contact',
      '- Tabs (up to 10): name, text, tags, and their own desktop and phone videos',
      'Tabs show in this order; a product card can open one of them.',
    ),
    bodyId: lines(
      '- Gambar latar, dan video latar opsional (tanpa suara, berulang)',
      '- PDF brosur: kosong = tombol menuju halaman Contact',
      '- Tab (maks. 10): nama, teks, tag, serta video desktop dan HP sendiri',
      'Tab tampil sesuai urutan ini; kartu produk bisa membuka salah satunya.',
    ),
  }),
  step({
    id: 'category-cta',
    route: '/collections/solution-categories/{first}/form',
    clickFirst: tab(4),
    target: '#field-cta',
    titleEn: 'CTA tab',
    titleId: 'Tab CTA',
    bodyEn: lines(
      'The call to action at the bottom of the detail page:',
      '- Eyebrow, title and description',
      '- Background image',
      '- Button label and link (by default “Request Consultation” to /contact)',
    ),
    bodyId: lines(
      'Ajakan di bagian bawah halaman detail:',
      '- Eyebrow, judul, dan deskripsi',
      '- Gambar latar',
      '- Label dan link tombol (bawaannya “Request Consultation” menuju /contact)',
    ),
  }),
  step({
    id: 'category-seo',
    route: '/collections/solution-categories/{first}/form',
    clickFirst: tab(5),
    target: '#field-meta',
    titleEn: 'SEO tab',
    titleId: 'Tab SEO',
    bodyEn: 'The Google title and description of the detail page, and the image shown when its link is shared. Empty: the category name and the site’s description.',
    bodyId: 'Judul dan deskripsi Google untuk halaman detail, serta gambar saat link-nya dibagikan. Kosong: nama kategori dan deskripsi situs.',
  }),

  // ── Products ──────────────────────────────────────────────────────────
  step({
    id: 'products-order',
    route: '/collections/products',
    target: DRAG,
    titleEn: 'Order of the products',
    titleId: 'Urutan produk',
    bodyEn: 'Drag a row by its handle to move it up or down. Within each category, products show in this order in the menu and the solutions overview; the first one of a category becomes its large card.',
    bodyId: 'Seret baris lewat pegangannya untuk menaikkan atau menurunkan. Di setiap kategori, produk tampil dalam urutan ini di menu dan ringkasan solusi; produk pertama tiap kategori menjadi kartu besar.',
  }),
  step({
    id: 'product-visual',
    route: '/collections/products/{first}',
    frame: 'editor',
    target: '[class*="_PuckCanvas-inner_"]',
    titleEn: 'The product card, visually',
    titleId: 'Kartu produk, secara visual',
    bodyEn: lines(
      'A product opens as its card in the Solution overview, among the other cards of its category:',
      '- Click the card to edit it on the right (title, description, chips, image)',
      '- Category: moves the card to another tab',
      '- Wide and large title: the size of the card',
      'The order of the cards is set by dragging in the products list.',
    ),
    bodyId: lines(
      'Produk terbuka sebagai kartunya di Solution overview, di antara kartu lain dalam kategorinya:',
      '- Klik kartu untuk mengeditnya di kanan (judul, deskripsi, chip, gambar)',
      '- Kategori: memindahkan kartu ke tab lain',
      '- Lebar dan judul besar: ukuran kartu',
      'Urutan kartu diatur dengan menggeser di daftar produk.',
    ),
  }),
  step({
    id: 'product-content',
    route: '/collections/products/{first}/form',
    target: '#field-collapsible-_index-1',
    titleEn: 'A product',
    titleId: 'Data produk',
    bodyEn: lines(
      '- Title',
      '- Summary (up to 300 characters): in the menu and on the card on hover',
      '- Recommended for (up to 6 tags): on the card on hover',
      '- Category',
      '- Card opens tab: the Showcase tab of the category page the card opens',
    ),
    bodyId: lines(
      '- Judul',
      '- Ringkasan (maks. 300 karakter): di menu dan di kartu saat di-hover',
      '- Recommended For (maks. 6 tag): di kartu saat di-hover',
      '- Kategori',
      '- Kartu membuka tab: tab Showcase di halaman kategori yang dibuka saat kartu diklik',
    ),
  }),
  step({
    id: 'product-images',
    route: '/collections/products/{first}/form',
    target: '#field-collapsible-_index-3',
    titleEn: 'Product images',
    titleId: 'Gambar produk',
    bodyEn: lines('- Image: the card image', '- Image (mobile): optional, cropped for phones (empty = the same image)'),
    bodyId: lines('- Gambar: gambar kartu', '- Gambar (HP): opsional, dipotong khusus untuk HP (kosong = gambar yang sama)'),
  }),
  step({
    id: 'product-layout',
    route: '/collections/products/{first}/form',
    target: '#field-layout',
    titleEn: 'Card layout',
    titleId: 'Tata letak kartu',
    bodyEn: lines('- 2 columns wide: the card spans two columns on desktop', '- Large title: enlarges its title'),
    bodyId: lines('- Lebar 2 kolom: kartu selebar dua kolom di desktop', '- Judul besar: memperbesar judulnya'),
  }),

  // ── Inbox ─────────────────────────────────────────────────────────────
  step({
    id: 'inbox',
    route: '/collections/contact-submissions',
    target: '.collection-list .table, #nav-contact-submissions',
    titleEn: 'Inbox',
    titleId: 'Inbox',
    bodyEn: lines(
      'Messages sent from the website’s contact form, newest first:',
      '- Name, organisation and email of the sender',
      '- Status of the follow-up',
      '- When it arrived',
      'Filter by status to see, for example, only the new ones.',
    ),
    bodyId: lines(
      'Pesan dari formulir kontak website, yang terbaru di atas:',
      '- Nama, organisasi, dan email pengirim',
      '- Status tindak lanjut',
      '- Waktu masuk',
      'Filter berdasarkan status untuk melihat, misalnya, pesan baru saja.',
    ),
  }),
  step({
    id: 'inbox-message',
    route: '/collections/contact-submissions/{first}',
    target: `${field('fullName')}, ${field('message')}`,
    titleEn: 'A message',
    titleId: 'Isi pesan',
    bodyEn: lines(
      'What the visitor sent, read-only:',
      '- Full name and organisation',
      '- Email and phone',
      '- Interest (what they asked about)',
      '- Message',
    ),
    bodyId: lines(
      'Yang dikirim pengunjung, hanya bisa dibaca:',
      '- Nama lengkap dan organisasi',
      '- Email dan telepon',
      '- Minat (yang ditanyakan)',
      '- Pesan',
    ),
  }),
  step({
    id: 'inbox-followup',
    route: '/collections/contact-submissions/{first}',
    target: `#field-status, ${field('internalNotes')}`,
    titleEn: 'Following it up',
    titleId: 'Tindak lanjut',
    bodyEn: lines(
      '- Status: New, In progress, Done or Spam',
      '- Internal notes: for the team',
      'Visitors never see either. Only administrators can delete messages.',
    ),
    bodyId: lines(
      '- Status: Baru, Diproses, Selesai, atau Spam',
      '- Catatan internal: untuk tim',
      'Keduanya tidak terlihat oleh pengunjung. Hanya Admin yang bisa menghapus pesan.',
    ),
  }),

  // ── Settings: navigation and footer ───────────────────────────────────
  step({
    id: 'navigation',
    route: '/globals/navigation',
    target: '#nav-global-navigation, #nav-global-footer',
    titleEn: 'Navigation & footer',
    titleId: 'Navigasi & footer',
    bodyEn: 'The website’s top menu and footer, shown on every page.',
    bodyId: 'Menu atas dan footer website, yang tampil di semua halaman.',
  }),
  step({
    id: 'navigation-solutions',
    route: '/globals/navigation',
    target: '#field-collapsible-_index-0',
    titleEn: 'The solutions menu',
    titleId: 'Menu solusi',
    bodyEn: 'The name of the solutions menu (“Our Solutions”). Its content fills itself from Solution Categories and Products, in their order.',
    bodyId: 'Nama menu solusi (“Our Solutions”). Isinya terisi otomatis dari Kategori Solusi dan Produk, sesuai urutannya.',
  }),
  step({
    id: 'navigation-links',
    route: '/globals/navigation',
    target: '#field-links',
    titleEn: 'Other menu items',
    titleId: 'Menu lainnya',
    bodyEn: lines(
      'The other links of the top menu (About, Contact…):',
      '- Label and link of each',
      '- Drag to reorder them in the menu',
      '- Show in the menu: untick to hide one without deleting it',
    ),
    bodyId: lines(
      'Link lain di menu atas (About, Contact, …):',
      '- Label dan link tiap menu',
      '- Seret untuk mengubah urutannya di menu',
      '- Tampilkan di menu: hilangkan centang untuk menyembunyikan tanpa menghapus',
    ),
  }),
  step({
    id: 'navigation-library',
    route: '/globals/navigation',
    target: '#field-linkLibrary',
    titleEn: 'Links per page',
    titleId: 'Link per halaman',
    bodyEn: lines(
      'Extra choices for the link pickers of the editor, grouped by page:',
      '- A part of a page, like #faq',
      '- An outside website',
      'Pages and solution pages are listed already; nothing here shows on the website by itself.',
    ),
    bodyId: lines(
      'Pilihan tambahan untuk pemilih link di editor, dikelompokkan per halaman:',
      '- Bagian halaman, seperti #faq',
      '- Situs luar',
      'Halaman dan halaman solusi sudah otomatis ada; isian di sini tidak tampil sendiri di website.',
    ),
  }),
  step({
    id: 'navigation-cta',
    route: '/globals/navigation',
    target: '#field-cta',
    titleEn: 'The menu button',
    titleId: 'Tombol menu',
    bodyEn: 'The highlighted button at the right of the top menu: its label and where it leads.',
    bodyId: 'Tombol yang menonjol di kanan menu atas: label dan tujuan link-nya.',
  }),
  step({
    id: 'footer-description',
    route: '/globals/footer',
    target: '#field-collapsible-_index-0',
    titleEn: 'Footer text',
    titleId: 'Teks footer',
    bodyEn: 'The short text under the logo in the footer. The address, email, phone and social media in the footer come from Site settings.',
    bodyId: 'Teks singkat di bawah logo di footer. Alamat, email, telepon, dan media sosial di footer diambil dari Pengaturan Situs.',
  }),
  step({
    id: 'footer-columns',
    route: '/globals/footer',
    target: '#field-columns',
    titleEn: 'Footer columns',
    titleId: 'Kolom footer',
    bodyEn: lines(
      '- Up to 3 columns, each with a heading',
      '- Up to 10 links per column (label + link)',
      '- Drag columns and links to reorder: the footer follows the same order',
    ),
    bodyId: lines(
      '- Maks. 3 kolom, masing-masing dengan judul',
      '- Maks. 10 link per kolom (label + link)',
      '- Seret kolom dan link untuk mengubah urutan: footer mengikuti urutan yang sama',
    ),
  }),
  step({
    id: 'footer-copyright',
    route: '/globals/footer',
    target: '#field-collapsible-_index-2',
    titleEn: 'Copyright',
    titleId: 'Copyright',
    bodyEn: 'The line at the very bottom of the website. Write {year} and it shows the current year, updated by itself.',
    bodyId: 'Baris paling bawah website. Tulis {year} dan otomatis diganti tahun berjalan.',
  }),

  // ── Settings: site settings (admins) ──────────────────────────────────
  step({
    id: 'site-settings',
    roles: ADMIN,
    route: '/globals/site-settings',
    target: '#nav-global-site-settings',
    titleEn: 'Site settings',
    titleId: 'Pengaturan situs',
    bodyEn: lines(
      'Name, logo, contact details, social media and the contact-form email of the whole website.',
      '- Like pages: changes are saved as a draft and reach the website once you publish',
      '- Versions: every save is kept and can be restored',
    ),
    bodyId: lines(
      'Nama, logo, kontak, media sosial, dan email form kontak untuk seluruh website.',
      '- Sama seperti halaman: perubahan tersimpan sebagai draft dan baru tampil di website setelah dipublish',
      '- Versions: setiap simpanan tercatat dan bisa dipulihkan',
    ),
  }),
  step({
    id: 'site-general',
    roles: ADMIN,
    route: '/globals/site-settings',
    clickFirst: tab(1),
    target: '#field-collapsible-_index-0-0-0, #field-collapsible-_index-0-0-1',
    titleEn: 'General',
    titleId: 'Umum',
    bodyEn: lines(
      '- Site name: browser tabs and Google',
      '- Description: for Google, on pages without their own',
      '- Logo: in the menu and the footer',
      '- Icon: the small image in the browser tab',
    ),
    bodyId: lines(
      '- Nama situs: di tab browser dan Google',
      '- Deskripsi: untuk Google, di halaman yang tidak punya deskripsi sendiri',
      '- Logo: di menu dan footer',
      '- Ikon: gambar kecil di tab browser',
    ),
  }),
  step({
    id: 'site-contact',
    roles: ADMIN,
    route: '/globals/site-settings',
    clickFirst: tab(2),
    target: '#field-contact',
    titleEn: 'Contact',
    titleId: 'Kontak',
    bodyEn: lines(
      '- Address, and its pin: search or click on the map (the office map on the website)',
      '- Short address: in the footer',
      '- Email and phone',
      '- WhatsApp number (08… becomes 628…) and the message that opens ready to send',
    ),
    bodyId: lines(
      '- Alamat, dan titiknya: cari atau klik di peta (peta kantor di website)',
      '- Alamat singkat: di footer',
      '- Email dan telepon',
      '- Nomor WhatsApp (08… otomatis jadi 628…) dan pesan yang langsung terisi saat chat dibuka',
    ),
  }),
  step({
    id: 'site-social',
    roles: ADMIN,
    route: '/globals/site-settings',
    clickFirst: tab(3),
    target: '#field-socials',
    titleEn: 'Social media',
    titleId: 'Media sosial',
    bodyEn: lines(
      'The social media icons in the footer, in this order:',
      '- Platform: Facebook, Instagram, LinkedIn, TikTok, YouTube, X or WhatsApp',
      '- Label and link of the account',
    ),
    bodyId: lines(
      'Ikon media sosial di footer, sesuai urutan ini:',
      '- Platform: Facebook, Instagram, LinkedIn, TikTok, YouTube, X, atau WhatsApp',
      '- Label dan link akunnya',
    ),
  }),
  step({
    id: 'site-email',
    roles: ADMIN,
    route: '/globals/site-settings',
    clickFirst: tab(4),
    target: '#field-emailNotifications',
    titleEn: 'Email about new messages',
    titleId: 'Email pesan baru',
    bodyEn: lines(
      'Messages from the contact form also reach the team by email:',
      '- Send an email for every new message: off = only in the Inbox',
      '- Sent to the email of the Contact tab',
      '- Sender: who the email comes from',
      '- Subject: {name}, {organization}… put in what the visitor wrote',
      '- Send a test email: checks it all (save first)',
      'Replying answers the visitor directly.',
    ),
    bodyId: lines(
      'Pesan dari form kontak juga sampai ke tim lewat email:',
      '- Kirim email untuk setiap pesan baru: mati = hanya di Inbox',
      '- Dikirim ke email di tab Contact',
      '- Pengirim: email terlihat berasal dari siapa',
      '- Subjek: {name}, {organization}… diisi dengan yang ditulis pengunjung',
      '- Kirim email uji: memeriksa semuanya (simpan dulu)',
      'Membalas email itu langsung menjawab pengunjung.',
    ),
  }),

  // ── System (admins) ───────────────────────────────────────────────────
  step({
    id: 'users',
    roles: ADMIN,
    route: '/collections/users',
    target: '.collection-list .table, #nav-users',
    titleEn: 'Users',
    titleId: 'Pengguna',
    bodyEn: lines(
      'Everyone who can sign in to the CMS:',
      '- Email, name and role',
      '- Last changed',
      'Only administrators add or delete users.',
    ),
    bodyId: lines(
      'Semua orang yang bisa masuk ke CMS:',
      '- Email, nama, dan role',
      '- Terakhir diubah',
      'Hanya Admin yang bisa menambah atau menghapus pengguna.',
    ),
  }),
  step({
    id: 'users-create',
    roles: ADMIN,
    route: '/collections/users/create',
    target: `${field('email')}, ${field('roles')}, #field-roles`,
    titleEn: 'A new user',
    titleId: 'Pengguna baru',
    bodyEn: lines(
      '- Email and password: the password must follow the rules shown while typing',
      '- Name',
      '- Role: Admin (everything) or Editor (content only)',
      'New users set up two-step verification at their first login. After 5 wrong passwords an account is locked for 15 minutes.',
    ),
    bodyId: lines(
      '- Email dan password: password harus memenuhi aturan yang tampil saat diketik',
      '- Nama',
      '- Role: Admin (semua akses) atau Editor (konten saja)',
      'Pengguna baru mengatur verifikasi dua langkah saat login pertama. Setelah 5 kali salah password, akun terkunci 15 menit.',
    ),
  }),
  step({
    id: 'audit-logs',
    roles: ADMIN,
    route: '/collections/audit-logs',
    target: '.collection-list .table, #nav-audit-logs',
    titleEn: 'Audit logs',
    titleId: 'Log audit',
    bodyEn: lines(
      'Every change and login:',
      '- Created at: when',
      '- Action: create, update, delete, login or security',
      '- Resource and document ID: what',
      '- User and IP: by whom, from where',
      'Entries can’t be edited or deleted. Open one to see which fields changed.',
    ),
    bodyId: lines(
      'Setiap perubahan dan login:',
      '- Dibuat pada: kapan',
      '- Aksi: buat, ubah, hapus, login, atau keamanan',
      '- Sumber dan ID dokumen: apa',
      '- User dan IP: oleh siapa, dari mana',
      'Catatan tidak bisa diubah atau dihapus. Buka satu catatan untuk melihat field yang berubah.',
    ),
  }),
  step({
    id: 'tutorial-settings',
    roles: ADMIN,
    route: '/globals/tutorial',
    target: '#nav-global-tutorial',
    titleEn: 'This tutorial',
    titleId: 'Tutorial ini',
    bodyEn: lines(
      '- Steps: change the text and order, or add new ones (“Pick element” chooses what to highlight)',
      '- Show automatically: opens by itself for those who haven’t seen it',
      '- Show again to everyone: after big changes to the steps',
    ),
    bodyId: lines(
      '- Langkah: ubah teks dan urutan, atau tambah langkah baru (“Pilih elemen” untuk memilih yang disorot)',
      '- Tampilkan otomatis: terbuka sendiri untuk yang belum melihatnya',
      '- Tampilkan lagi ke semua pengguna: setelah langkah banyak berubah',
    ),
  }),

  // ── Account ───────────────────────────────────────────────────────────
  step({
    id: 'account-menu',
    route: '/account',
    target: '.nav__foot .falah-account__button',
    titleEn: 'Your account menu',
    titleId: 'Menu akun Anda',
    bodyEn: lines(
      '- Interface language: English or Indonesian for the CMS',
      '- Content language: the language of the text you edit',
      '- Account, Tutorial, and Log out',
    ),
    bodyId: lines(
      '- Bahasa tampilan: Inggris atau Indonesia untuk CMS',
      '- Bahasa konten: bahasa teks yang sedang diedit',
      '- Akun, Tutorial, dan Keluar',
    ),
  }),
  step({
    id: 'account-profile',
    route: '/account',
    target: `${field('email')}, ${field('name')}`,
    titleEn: 'Your profile',
    titleId: 'Profil Anda',
    bodyEn: lines(
      '- Email: used to sign in',
      '- Change password: follows the same rules as for new users',
      '- Name: shown in the account menu and the audit logs',
      'Your role can only be changed by another administrator.',
    ),
    bodyId: lines(
      '- Email: dipakai untuk login',
      '- Ubah password: mengikuti aturan yang sama seperti pengguna baru',
      '- Nama: tampil di menu akun dan log audit',
      'Role Anda hanya bisa diubah oleh Admin lain.',
    ),
  }),
  step({
    id: 'two-factor',
    route: '/account',
    target: '.falah-2fa-status',
    titleEn: 'Two-step verification',
    titleId: 'Verifikasi dua langkah',
    bodyEn: lines(
      '- After your password, a code from an authenticator app is asked',
      '- Move to a new phone: when you change phones',
      '- Lost your phone: ask an administrator to reset it',
    ),
    bodyId: lines(
      '- Setelah password, kode dari aplikasi authenticator diminta',
      '- Pindah ke HP baru: saat ganti HP',
      '- HP hilang: minta Admin untuk me-reset',
    ),
  }),
  step({
    id: 'replay',
    route: '/account',
    target: '.falah-tutorial-replay',
    titleEn: 'All done!',
    titleId: 'Selesai!',
    bodyEn: 'You can replay this tour any time from here.',
    bodyId: 'Tutorial ini bisa diulang kapan saja dari sini. Selesai!',
  }),
]
