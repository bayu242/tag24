export type Language = "en" | "id";

export type Message = string | { one: string; other: string };

export const LANGUAGES: { code: Language; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "id", label: "Bahasa Indonesia", short: "ID" },
];

export const translations: Record<Language, Record<string, Message>> = {
  en: {
    "app.name": "Tag24",
    "nav.write": "Write tag",
    "nav.read": "Read tag",

    "language.title": "Language",

    "home.headline": "Save Data to NFC Tag",
    "home.subtext":
      "Write contact details, links, and notes to an NFC tag. Anyone can read it with a phone, no app required.",
    "home.writeAction": "Write a tag",
    "home.readAction": "Read a tag",
    "home.howItWorks": "How it works",
    "home.supportedTag": "Supported tag",
    "home.supportedTagBody":
      "Use a MIFARE Classic tag that already works with NFC and holds at least 1K. Brand-new blank tags must be prepared first.",
    "home.step.write.title": "Write",
    "home.step.write.body": "Pick the fields you want and write them to the tag.",
    "home.step.tap.title": "Tap",
    "home.step.tap.body": "Hold any NFC phone near the tag. It opens in the browser.",
    "home.step.read.title": "Read",
    "home.step.read.body": "See the stored details with links ready to tap.",
    "home.step.edit.title": "Edit",
    "home.step.edit.body": "Change the details and write the same tag again.",

    "nfc.ready.title": "NFC is ready",
    "nfc.ready.message": "Hold your phone near a tag to write or read.",
    "nfc.disabled.title": "NFC is turned off",
    "nfc.disabled.message": "Turn on NFC in Android settings to continue.",
    "nfc.unsupported.title": "NFC is not supported",
    "nfc.unsupported.message": "This device cannot read or write NFC tags.",
    "nfc.enable": "Turn on NFC",
    "nfc.alert.openSettings": "Open settings",

    "write.title": "What goes on the tag?",
    "write.subtitle": "Add only the fields you need. Only the fields you fill in are stored.",
    "write.empty.title": "No fields yet",
    "write.empty.message": "Tap the plus button to choose what you want to store on the tag.",
    "write.addField": "Add a field",
    "write.addFieldToContinue": "Add a field to continue",
    "write.writeToTag": "Write to tag",
    "write.placeholder": "Enter {name}",
    "write.placeholderSocial": "Paste a link or @username",
    "write.placeholderSpotify": "Paste a Spotify link",

    "write.confirm.title": "Confirm write",
    "write.confirm.subtitle": {
      one: "{count} field will be saved to the tag.",
      other: "{count} fields will be saved to the tag.",
    },
    "write.confirm.overwriteBody":
      "The tag already contains data. Writing replaces everything currently stored on it.",
    "write.confirm.overwriteAction": "Overwrite tag",

    "write.writing.title": "Writing to tag",
    "write.writing.message":
      "Hold your phone near the tag and keep it still until the write finishes.",
    "write.success.title": "Tag written",
    "write.success.message": {
      one: "{count} field was written. Scanning the tag opens the details in a browser.",
      other: "{count} fields were written. Scanning the tag opens the details in a browser.",
    },
    "write.success.action": "Write another tag",
    "write.error.title": "Could not write to the tag",

    "write.remove.title": "Remove {name}?",
    "write.remove.message": "This field and anything you typed in it will be taken off the tag.",
    "write.remove.confirm": "Remove field",

    "addField.title": "Add to tag",
    "addField.subtitle": "Choose the fields you want to store. Only filled fields are written.",
    "addField.empty": "Every field is already on the tag.",
    "addField.addCount": {
      one: "Add {count} field",
      other: "Add {count} fields",
    },
    "addField.add": "Add fields",

    "field.maxCharHint": "Up to {count} characters",
    "field.tooLong": {
      one: "Too long by {count} character.",
      other: "Too long by {count} characters.",
    },
    "field.remove": "Remove {name}",

    "capacity.title": "Space used",
    "capacity.ok": "Looks good. Everything fits on the tag.",
    "capacity.tight": "Almost full. Shorten longer entries if saving fails.",
    "capacity.over": "Too much to fit. Remove or shorten some entries.",

    "read.idle.title": "Ready to read",
    "read.idle.message": "Hold your phone near an NFC tag to see the details stored on it.",
    "read.idle.start": "Start reading",
    "read.reading.title": "Reading tag",
    "read.reading.message": "Keep your phone near the tag until the read finishes.",
    "read.error.title": "Could not read this tag",
    "read.error.message":
      "We could not read this tag. It may be damaged, or saved in a format this app does not support.",
    "read.error.retry": "Try again",
    "read.success.nameFallback": "Tag details",
    "read.success.fields": {
      one: "{count} field found on this tag.",
      other: "{count} fields found on this tag.",
    },
    "read.success.edit": "Edit this tag",
    "read.success.readAnother": "Read another",

    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.close": "Close",
    "common.tryAgain": "Try again",

    "error.EMPTY_PAYLOAD": "This tag is empty.",
    "error.INVALID_NDEF_URI": "This tag does not have data this app can read.",
    "error.MULTIPLE_NDEF_URI_RECORDS":
      "This tag has more than one item, so it cannot be read here.",
    "error.MISSING_QUERY_PARAM": "This tag's link is missing its data.",
    "error.INVALID_URL": "This tag's link is not valid.",
    "error.INVALID_BASE64": "This tag's data is not in a format the app can read.",
    "error.INVALID_DEFLATE": "This tag's data could not be read.",
    "error.INVALID_JSON": "This tag's data is not valid.",
    "error.UNSUPPORTED_VERSION": "This tag was saved by a newer version of the app.",
    "error.UNKNOWN_DATA_TYPE": "This tag has information this app does not recognize.",
    "error.MAX_CHAR_EXCEEDED": "One of the entries is too long.",
    "error.INVALID_DATA": "This tag's data is not valid.",
    "error.TAG_LOCKED": "This tag is locked and cannot be changed.",
    "error.INSUFFICIENT_CAPACITY": "The data does not fit on this tag.",
    "error.NFC_UNSUPPORTED": "This device cannot read or write NFC tags.",
    "error.NFC_DISABLED": "NFC is turned off. Turn it on to continue.",
    "error.NFC_READ_FAILED": "We could not read the tag. Hold your phone still and try again.",
    "error.NFC_WRITE_FAILED": "We could not write to the tag. Hold your phone still and try again.",
    "error.NFC_CANCELLED": "Reading or writing was cancelled.",

    "field.nm": "Name",
    "field.wa": "WhatsApp",
    "field.ph": "Phone Number",
    "field.ad": "Address",
    "field.pet": "Pet Name",
    "field.em": "Email",
    "field.ig": "Instagram Username",
    "field.tw": "Twitter/X Username",
    "field.th": "Threads Username",
    "field.fb": "Facebook Username",
    "field.li": "LinkedIn Username",
    "field.yt": "YouTube Username",
    "field.tt": "TikTok Username",
    "field.sp": "Spotify Playlist",
    "field.sa": "Spotify Album",
    "field.nt": "Note",
  },

  id: {
    "app.name": "Tag24",
    "nav.write": "Tulis tag",
    "nav.read": "Baca tag",

    "language.title": "Bahasa",

    "home.headline": "Simpan Data ke Tag NFC",
    "home.subtext":
      "Tulis kontak, tautan, dan catatan ke tag NFC. Siapa pun bisa membacanya dengan ponsel, tanpa aplikasi.",
    "home.writeAction": "Tulis tag",
    "home.readAction": "Baca tag",
    "home.howItWorks": "Cara kerja",
    "home.supportedTag": "Tag yang didukung",
    "home.supportedTagBody":
      "Gunakan tag MIFARE Classic yang sudah siap untuk NFC dengan kapasitas minimal 1K. Tag baru yang masih kosong harus disiapkan terlebih dahulu.",
    "home.step.write.title": "Tulis",
    "home.step.write.body": "Pilih kolom yang ingin Anda simpan lalu tulis ke tag.",
    "home.step.tap.title": "Tempel",
    "home.step.tap.body": "Dekatkan ponsel NFC mana pun ke tag. Tautan terbuka di browser.",
    "home.step.read.title": "Baca",
    "home.step.read.body": "Lihat detail tersimpan dengan tautan yang siap diketuk.",
    "home.step.edit.title": "Ubah",
    "home.step.edit.body": "Ubah detail lalu tulis ulang ke tag yang sama.",

    "nfc.ready.title": "NFC siap",
    "nfc.ready.message": "Dekatkan ponsel ke tag untuk menulis atau membaca.",
    "nfc.disabled.title": "NFC dimatikan",
    "nfc.disabled.message": "Aktifkan NFC di pengaturan Android untuk melanjutkan.",
    "nfc.unsupported.title": "NFC tidak didukung",
    "nfc.unsupported.message": "Perangkat ini tidak dapat membaca atau menulis tag NFC.",
    "nfc.enable": "Aktifkan NFC",
    "nfc.alert.openSettings": "Buka pengaturan",

    "write.title": "Apa yang disimpan di tag?",
    "write.subtitle":
      "Tambahkan hanya kolom yang Anda butuhkan. Hanya kolom yang diisi yang disimpan.",
    "write.empty.title": "Belum ada kolom",
    "write.empty.message": "Ketuk tombol plus untuk memilih apa yang ingin disimpan di tag.",
    "write.addField": "Tambah kolom",
    "write.addFieldToContinue": "Tambah kolom untuk lanjut",
    "write.writeToTag": "Tulis ke tag",
    "write.placeholder": "Masukkan {name}",
    "write.placeholderSocial": "Tempel tautan atau @nama pengguna",
    "write.placeholderSpotify": "Tempel tautan Spotify",

    "write.confirm.title": "Konfirmasi tulis",
    "write.confirm.subtitle": {
      one: "{count} kolom akan disimpan ke tag.",
      other: "{count} kolom akan disimpan ke tag.",
    },
    "write.confirm.overwriteBody":
      "Tag sudah berisi data. Menulis akan mengganti semua yang tersimpan di dalamnya.",
    "write.confirm.overwriteAction": "Timpa tag",

    "write.writing.title": "Menulis ke tag",
    "write.writing.message":
      "Dekatkan ponsel ke tag dan jangan digerakkan sampai proses selesai.",
    "write.success.title": "Tag berhasil ditulis",
    "write.success.message": {
      one: "{count} kolom telah ditulis. Memindai tag membuka detailnya di browser.",
      other: "{count} kolom telah ditulis. Memindai tag membuka detailnya di browser.",
    },
    "write.success.action": "Tulis tag lain",
    "write.error.title": "Tidak dapat menulis ke tag",

    "write.remove.title": "Hapus {name}?",
    "write.remove.message": "Kolom ini dan semua isinya akan dihapus dari tag.",
    "write.remove.confirm": "Hapus kolom",

    "addField.title": "Tambah ke tag",
    "addField.subtitle": "Pilih kolom yang ingin disimpan. Hanya kolom yang diisi yang ditulis.",
    "addField.empty": "Semua kolom sudah ada di tag.",
    "addField.addCount": {
      one: "Tambah {count} kolom",
      other: "Tambah {count} kolom",
    },
    "addField.add": "Tambah kolom",

    "field.maxCharHint": "Maksimal {count} karakter",
    "field.tooLong": {
      one: "Kelebihan {count} karakter.",
      other: "Kelebihan {count} karakter.",
    },
    "field.remove": "Hapus {name}",

    "capacity.title": "Ruang terpakai",
    "capacity.ok": "Terlihat baik. Semua muat di tag.",
    "capacity.tight": "Hampir penuh. Perpendek isian yang panjang jika gagal menyimpan.",
    "capacity.over": "Terlalu banyak untuk dimuat. Hapus atau perpendek beberapa isian.",

    "read.idle.title": "Siap membaca",
    "read.idle.message": "Dekatkan ponsel ke tag NFC untuk melihat detail yang tersimpan.",
    "read.idle.start": "Mulai membaca",
    "read.reading.title": "Membaca tag",
    "read.reading.message": "Jaga ponsel tetap dekat dengan tag sampai selesai.",
    "read.error.title": "Tidak dapat membaca tag ini",
    "read.error.message":
      "Kami tidak dapat membaca tag ini. Mungkin rusak, atau disimpan dalam format yang tidak didukung aplikasi ini.",
    "read.error.retry": "Coba lagi",
    "read.success.nameFallback": "Detail tag",
    "read.success.fields": {
      one: "{count} kolom ditemukan di tag ini.",
      other: "{count} kolom ditemukan di tag ini.",
    },
    "read.success.edit": "Ubah tag ini",
    "read.success.readAnother": "Baca lagi",

    "common.cancel": "Batal",
    "common.confirm": "Konfirmasi",
    "common.close": "Tutup",
    "common.tryAgain": "Coba lagi",

    "error.EMPTY_PAYLOAD": "Tag ini kosong.",
    "error.INVALID_NDEF_URI": "Tag ini tidak berisi data yang dapat dibaca aplikasi.",
    "error.MULTIPLE_NDEF_URI_RECORDS":
      "Tag ini berisi lebih dari satu item, jadi tidak dapat dibaca di sini.",
    "error.MISSING_QUERY_PARAM": "Tautan pada tag ini tidak memiliki data.",
    "error.INVALID_URL": "Tautan pada tag ini tidak valid.",
    "error.INVALID_BASE64": "Data tag ini tidak dalam format yang dapat dibaca aplikasi.",
    "error.INVALID_DEFLATE": "Data tag ini tidak dapat dibaca.",
    "error.INVALID_JSON": "Data tag ini tidak valid.",
    "error.UNSUPPORTED_VERSION": "Tag ini disimpan oleh versi aplikasi yang lebih baru.",
    "error.UNKNOWN_DATA_TYPE": "Tag ini berisi informasi yang tidak dikenali aplikasi.",
    "error.MAX_CHAR_EXCEEDED": "Salah satu isian terlalu panjang.",
    "error.INVALID_DATA": "Data tag ini tidak valid.",
    "error.TAG_LOCKED": "Tag ini terkunci dan tidak dapat diubah.",
    "error.INSUFFICIENT_CAPACITY": "Data tidak muat di tag ini.",
    "error.NFC_UNSUPPORTED": "Perangkat ini tidak dapat membaca atau menulis tag NFC.",
    "error.NFC_DISABLED": "NFC dimatikan. Aktifkan untuk melanjutkan.",
    "error.NFC_READ_FAILED": "Kami tidak dapat membaca tag. Tahan ponsel tetap diam lalu coba lagi.",
    "error.NFC_WRITE_FAILED": "Kami tidak dapat menulis ke tag. Tahan ponsel tetap diam lalu coba lagi.",
    "error.NFC_CANCELLED": "Proses baca atau tulis dibatalkan.",

    "field.nm": "Nama",
    "field.wa": "WhatsApp",
    "field.ph": "Nomor Telepon",
    "field.ad": "Alamat",
    "field.pet": "Nama Hewan",
    "field.em": "Email",
    "field.ig": "Nama Pengguna Instagram",
    "field.tw": "Nama Pengguna Twitter/X",
    "field.th": "Nama Pengguna Threads",
    "field.fb": "Nama Pengguna Facebook",
    "field.li": "Nama Pengguna LinkedIn",
    "field.yt": "Nama Pengguna YouTube",
    "field.tt": "Nama Pengguna TikTok",
    "field.sp": "Playlist Spotify",
    "field.sa": "Album Spotify",
    "field.nt": "Catatan",
  },
};
