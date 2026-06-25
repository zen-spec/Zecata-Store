// ============================================
// ZECATA DIGITAL STORE - CONFIGURATION
// ============================================

const CONFIG = {
    WHATSAPP_NUMBER: "6285694163284",  // Format: 62 + nomor (tanpa 0)
    DISCORD_LINK: "https://discord.gg/88xcaskcfy",
    STORE_NAME: "Zecata Digital Store",
    OPERATIONAL_HOURS: "24 Jam / 7 Hari",
    EMAIL: "admin@zecata.store"
};

function getWhatsAppLink(message) {
    return "https://wa.me/" + CONFIG.WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}
