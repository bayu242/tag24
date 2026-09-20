export type Language = "en" | "id";

export type Message = string | { one: string; other: string };

export const LANGUAGES: { code: Language; label: string; short: string }[] = [
  { code: "id", label: "Bahasa Indonesia", short: "ID" },
  { code: "en", label: "English", short: "EN" },
];

export const translations: Record<Language, Record<string, Message>> = {
  en: {
    "nav.howItWorks": "How it works",
    "nav.fields": "What you can store",
    "nav.tag": "Supported tag",
    "nav.menu": "Toggle menu",
    "common.getApp": "Get the app",
    "common.chars": "{count} chars",
    "common.skipToContent": "Skip to content",
    "language.title": "Language",
    "preview.title": "Scanned tag",
    "preview.sample": "Sample data",

    "parser.loading.title": "Reading tag",
    "parser.loading.message": "Decoding the data stored on this tag.",
    "parser.error.title": "Could not read this tag",
    "parser.home": "Go to home",
    "parser.nameFallback": "Tag details",
    "parser.fields": { one: "{count} field", other: "{count} fields" },
    "parser.appCta": "Want to write your own tags?",

    "error.EMPTY_PAYLOAD": "This link does not contain tag data.",
    "error.INVALID_NDEF_URI": "This tag does not have data this app can read.",
    "error.MULTIPLE_NDEF_URI_RECORDS":
      "This tag has more than one item, so it cannot be read here.",
    "error.MISSING_QUERY_PARAM": "This link is missing its tag data.",
    "error.INVALID_URL": "This link is not valid.",
    "error.INVALID_BASE64": "This tag's data is not in a format the app can read.",
    "error.INVALID_DEFLATE": "This tag's data could not be read.",
    "error.INVALID_JSON": "This tag's data is not valid.",
    "error.UNSUPPORTED_VERSION": "This tag was saved by a newer version of the app.",
    "error.UNKNOWN_DATA_TYPE": "This tag has information this app does not recognize.",
    "error.MAX_CHAR_EXCEEDED": "One of the entries is too long.",
    "error.LINK_MISMATCH": "This link does not match this field.",
    "error.INVALID_DATA": "This tag's data is not valid.",
    "error.TAG_LOCKED": "This tag is locked and cannot be changed.",
    "error.INSUFFICIENT_CAPACITY": "The data does not fit on this tag.",

    "hero.eyebrow": "No app needed to read",
    "hero.title": "Save data to an NFC tag.",
    "hero.subtitle":
      "Write contacts, links, and notes to an NFC tag. Anyone can read it by tapping their phone.",
    "hero.secondary": "See how it works",

    "how.title": "Four steps, one small tag.",
    "how.subtitle":
      "Write once, then anyone can read the tag with a phone. No account, no server, and nothing to install on the reader's side.",
    "how.write.title": "Write",
    "how.write.body": "Pick the details you want and save them to the tag.",
    "how.tap.title": "Tap",
    "how.tap.body": "Hold any NFC phone near the tag. It opens in the browser.",
    "how.read.title": "Read",
    "how.read.body": "See the stored details with links ready to tap.",
    "how.edit.title": "Edit",
    "how.edit.body": "Change the details and save the same tag again.",

    "fields.title": "Pick only the fields you need.",
    "fields.subtitle":
      "One tag can hold any mix of these. Social handles are saved as the username only, and Spotify as the item ID, so the tag stays small. You can add more than one Spotify album or playlist.",
    "fields.group.contact": "Contact",
    "fields.group.social": "Social",
    "fields.group.music": "Music",
    "fields.group.extras": "Extras",

    "browser.title": "Scanning opens the browser, no app required.",
    "browser.subtitle":
      "Each tag stores one link. Any phone that scans it opens the data in a browser.",
    "browser.point1": "Works with the built-in NFC reader on Android phones.",
    "browser.point2": "The app is only needed to write, edit, or re-read a tag.",
    "browser.point3":
      "If the browser does not open by itself, the phone's NFC notification offers an Open action.",

    "tag.title": "Works with MIFARE Classic tags.",
    "tag.subtitle":
      "Use a tag that is already set up for NFC and holds at least 1K. Brand-new blank tags need to be prepared first, and locked tags cannot be changed.",
    "tag.spec.type.label": "Tag type",
    "tag.spec.type.value": "MIFARE Classic",
    "tag.spec.capacity.label": "Minimum capacity",
    "tag.spec.capacity.value": "1K",
    "tag.spec.format.label": "Format",
    "tag.spec.format.value": "Already set up for NFC",
    "tag.spec.content.label": "Stored content",
    "tag.spec.content.value": "One tap-to-open link",
    "tag.spec.locked.label": "Locked tags",
    "tag.spec.locked.value": "Not supported",

    "download.title": "Ready to write your first tag?",
    "download.subtitle":
      "Write and edit tags in a few taps. The app is free and does not need an account.",
    "download.note": "Android only. The latest release is on GitHub.",

    "footer.description":
      "Store contact details, links, and notes on NFC tags that open in any browser.",
    "footer.app": "App",
    "footer.project": "Project",
    "footer.github": "GitHub",
    "footer.releases": "Releases",

    "field.nm": "Name",
    "field.wa": "WhatsApp",
    "field.ph": "Phone Number",
    "field.ad": "Address",
    "field.pet": "Pet Name",
    "field.em": "Email",
    "field.ig": "Instagram",
    "field.tw": "Twitter/X",
    "field.th": "Threads",
    "field.fb": "Facebook",
    "field.li": "LinkedIn",
    "field.yt": "YouTube",
    "field.tt": "TikTok",
    "field.sp": "Spotify Playlist",
    "field.sa": "Spotify Album",
    "field.nt": "Note",
  },

  id: {
    "nav.howItWorks": "Cara kerja",
    "nav.fields": "Yang bisa disimpan",
    "nav.tag": "Tag yang didukung",
    "nav.menu": "Buka menu",
    "common.getApp": "Dapatkan aplikasi",
    "common.chars": "{count} karakter",
    "common.skipToContent": "Lewati ke konten",
    "language.title": "Bahasa",
    "preview.title": "Tag terbaca",
    "preview.sample": "Data contoh",

    "parser.loading.title": "Membaca tag",
    "parser.loading.message": "Mendekode data yang tersimpan di tag ini.",
    "parser.error.title": "Tidak dapat membaca tag ini",
    "parser.home": "Ke beranda",
    "parser.nameFallback": "Detail tag",
    "parser.fields": { one: "{count} kolom", other: "{count} kolom" },
    "parser.appCta": "Ingin menulis tag Anda sendiri?",

    "error.EMPTY_PAYLOAD": "Tautan ini tidak berisi data tag.",
    "error.INVALID_NDEF_URI": "Tag ini tidak berisi data yang dapat dibaca aplikasi.",
    "error.MULTIPLE_NDEF_URI_RECORDS":
      "Tag ini berisi lebih dari satu item, jadi tidak dapat dibaca di sini.",
    "error.MISSING_QUERY_PARAM": "Tautan ini tidak memiliki data tag.",
    "error.INVALID_URL": "Tautan ini tidak valid.",
    "error.INVALID_BASE64": "Data tag ini tidak dalam format yang dapat dibaca aplikasi.",
    "error.INVALID_DEFLATE": "Data tag ini tidak dapat dibaca.",
    "error.INVALID_JSON": "Data tag ini tidak valid.",
    "error.UNSUPPORTED_VERSION": "Tag ini disimpan oleh versi aplikasi yang lebih baru.",
    "error.UNKNOWN_DATA_TYPE": "Tag ini berisi informasi yang tidak dikenali aplikasi.",
    "error.MAX_CHAR_EXCEEDED": "Salah satu isian terlalu panjang.",
    "error.LINK_MISMATCH": "Tautan ini tidak cocok dengan kolom ini.",
    "error.INVALID_DATA": "Data tag ini tidak valid.",
    "error.TAG_LOCKED": "Tag ini terkunci dan tidak dapat diubah.",
    "error.INSUFFICIENT_CAPACITY": "Data tidak muat di tag ini.",

    "hero.eyebrow": "Tanpa aplikasi untuk membaca",
    "hero.title": "Simpan data ke tag NFC.",
    "hero.subtitle":
      "Tulis kontak, tautan, dan catatan ke tag NFC. Siapa pun bisa membacanya dengan sekali tempel.",
    "hero.secondary": "Lihat cara kerja",

    "how.title": "Empat langkah, satu tag kecil.",
    "how.subtitle":
      "Tulis sekali, lalu siapa pun bisa membaca tag dengan ponsel. Tanpa akun, tanpa server, dan tidak ada yang perlu dipasang di sisi pembaca.",
    "how.write.title": "Tulis",
    "how.write.body": "Pilih detail yang ingin disimpan lalu simpan ke tag.",
    "how.tap.title": "Tempel",
    "how.tap.body": "Dekatkan ponsel NFC mana pun ke tag. Tautan terbuka di browser.",
    "how.read.title": "Baca",
    "how.read.body": "Lihat detail tersimpan dengan tautan yang siap diketuk.",
    "how.edit.title": "Ubah",
    "how.edit.body": "Ubah detail lalu simpan ulang ke tag yang sama.",

    "fields.title": "Pilih hanya kolom yang Anda butuhkan.",
    "fields.subtitle":
      "Satu tag bisa memuat kombinasi apa pun dari kolom ini. Nama pengguna sosial disimpan hanya sebagai username, dan Spotify hanya sebagai ID, agar tag tetap kecil. Anda bisa menambahkan lebih dari satu album atau playlist Spotify.",
    "fields.group.contact": "Kontak",
    "fields.group.social": "Sosial",
    "fields.group.music": "Musik",
    "fields.group.extras": "Tambahan",

    "browser.title": "Memindai membuka browser, tanpa aplikasi.",
    "browser.subtitle":
      "Setiap tag menyimpan satu tautan. Ponsel yang memindainya langsung membuka data di browser.",
    "browser.point1": "Bekerja dengan pembaca NFC bawaan di ponsel Android.",
    "browser.point2": "Aplikasi hanya diperlukan untuk menulis, mengubah, atau membaca ulang tag.",
    "browser.point3":
      "Jika browser tidak terbuka sendiri, notifikasi NFC ponsel menyediakan aksi Buka.",

    "tag.title": "Bekerja dengan tag MIFARE Classic.",
    "tag.subtitle":
      "Gunakan tag yang sudah siap untuk NFC dengan kapasitas minimal 1K. Tag baru yang masih kosong harus disiapkan dulu, dan tag yang terkunci tidak dapat diubah.",
    "tag.spec.type.label": "Jenis tag",
    "tag.spec.type.value": "MIFARE Classic",
    "tag.spec.capacity.label": "Kapasitas minimum",
    "tag.spec.capacity.value": "1K",
    "tag.spec.format.label": "Format",
    "tag.spec.format.value": "Sudah siap untuk NFC",
    "tag.spec.content.label": "Isi tersimpan",
    "tag.spec.content.value": "Satu tautan sekali ketuk",
    "tag.spec.locked.label": "Tag terkunci",
    "tag.spec.locked.value": "Tidak didukung",

    "download.title": "Siap menulis tag pertama Anda?",
    "download.subtitle":
      "Tulis dan ubah tag hanya dengan beberapa ketukan. Aplikasi ini gratis dan tidak perlu akun.",
    "download.note": "Hanya Android. Rilis terbaru ada di GitHub.",

    "footer.description":
      "Simpan kontak, tautan, dan catatan di tag NFC yang terbuka di browser mana pun.",
    "footer.app": "Aplikasi",
    "footer.project": "Proyek",
    "footer.github": "GitHub",
    "footer.releases": "Rilis",


    "field.nm": "Nama",
    "field.wa": "WhatsApp",
    "field.ph": "Nomor Telepon",
    "field.ad": "Alamat",
    "field.pet": "Nama Hewan",
    "field.em": "Email",
    "field.ig": "Instagram",
    "field.tw": "Twitter/X",
    "field.th": "Threads",
    "field.fb": "Facebook",
    "field.li": "LinkedIn",
    "field.yt": "YouTube",
    "field.tt": "TikTok",
    "field.sp": "Playlist Spotify",
    "field.sa": "Album Spotify",
    "field.nt": "Catatan",
  },
};
