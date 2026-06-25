// Zecata Digital Store - Main JavaScript
let products = [];
let currentCategory = "all";
let selectedPrices = {};
const productsGrid = document.getElementById("productsGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const categoryBtns = document.querySelectorAll(".category-btn");
const faqItems = document.querySelectorAll(".faq-item");
const navbar = document.getElementById("navbar");
const darkModeToggle = document.getElementById("darkModeToggle");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

async function loadProducts() {
    try {
        const response = await fetch("js/products.json");
        products = await response.json();
        renderProducts(products);
    } catch (error) { console.error("Error:", error); }
}

function renderProducts(filteredProducts) {
    productsGrid.innerHTML = "";
    if (filteredProducts.length === 0) { emptyState.classList.remove("hidden"); return; }
    emptyState.classList.add("hidden");
    filteredProducts.forEach((product) => { productsGrid.appendChild(createProductCard(product)); });
    // Initialize Lucide icons after rendering products (wait for lucide to load)
    setTimeout(function() {
        if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
            lucide.createIcons();
        }
    }, 100);
}

// Get Lucide icon name based on category
function getCategoryIcon(category) {
    switch(category) {
        case "streaming": return "tv";
        case "music": return "music";
        case "editing": return "palette";
        case "cloud": return "cloud";
        case "gaming": return "gamepad-2";
        default: return "box";
    }
}

function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card bg-white dark:bg-darkCard rounded-2xl overflow-hidden shadow-lg fade-in-up";
    card.dataset.category = product.category;
    if (!selectedPrices[product.id]) selectedPrices[product.id] = product.prices[0];
    const stockBadge = product.stock === "available" ? '<span class="badge badge-available"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="inline-block mr-1"><polyline points="20 6 9 17 4 12"/></svg>Tersedia</span>' : '<span class="badge badge-soldout"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="inline-block mr-1"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>Habis</span>';
    const priceOptions = product.prices.map(price => {
        const isSelected = selectedPrices[product.id]?.duration === price.duration;
        return '<button class="price-option ' + (isSelected ? "selected" : "") + '" data-duration="' + price.duration + '" data-product="' + product.id + '"><span class="price-duration">' + price.duration + '</span><span class="price-value">' + price.price + '</span></button>';
    }).join("");
    const isDisabled = product.stock === "soldout";
    const iconName = getCategoryIcon(product.category);
    card.innerHTML = '<div><div class="card-header"><div class="card-icon ' + product.iconColor + '"><i data-lucide="' + iconName + '" class="lucide-icon"></i></div><div class="card-info"><h3 class="card-title">' + product.name + '</h3><p class="card-desc">' + product.description + '</p></div><div class="card-badge">' + stockBadge + '</div></div><div class="card-prices">' + priceOptions + '</div><div class="card-order"><button class="btn-order ' + (isDisabled ? "opacity-50" : "") + ' ' + (isDisabled ? "disabled" : "") + '><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-block"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span>Pesan Sekarang</span></button></div></div>';
    if (!isDisabled) { card.querySelector(".btn-order").addEventListener("click", () => { const sp = selectedPrices[product.id]; const msg = "Halo " + CONFIG.STORE_NAME + "! Saya ingin order:\n\n*Produk:* " + product.name + "\n*Durasi:* " + sp.duration + "\n*Harga:* " + sp.price + "\n\nMohon informasi lebih lanjut. Terima kasih!"; window.open(getWhatsAppLink(msg), "_blank"); }); }
    card.querySelectorAll(".price-option").forEach(btn => { btn.addEventListener("click", () => { selectedPrices[product.id] = product.prices.find(p => p.duration === btn.dataset.duration); card.querySelectorAll(".price-option").forEach(b => b.classList.remove("selected")); btn.classList.add("selected"); }); });
    return card;
}
function filterProducts() { let filtered = products; if (currentCategory !== "all") filtered = filtered.filter(p => p.category === currentCategory); const term = searchInput.value.toLowerCase().trim(); if (term) filtered = filtered.filter(p => p.name.toLowerCase().includes(term) || (p.description && p.description.toLowerCase().includes(term))); renderProducts(filtered); }
categoryBtns.forEach(btn => { btn.addEventListener("click", () => { categoryBtns.forEach(b => b.classList.remove("active")); btn.classList.add("active"); currentCategory = btn.dataset.category; filterProducts(); }); });
searchInput.addEventListener("input", () => { setTimeout(filterProducts, 300); });
faqItems.forEach(item => { const t = item.querySelector(".faq-toggle"); const c = item.querySelector(".faq-content"); t.addEventListener("click", () => { const isOpen = c.classList.contains("max-h-[500px]"); faqItems.forEach(i => { i.querySelector(".faq-content").classList.remove("max-h-[500px]"); i.querySelector(".faq-content").classList.add("max-h-0"); i.querySelector(".faq-content").classList.remove("pb-0"); i.querySelector(".faq-toggle").classList.remove("active"); }); if (!isOpen) { c.classList.remove("max-h-0"); c.classList.add("max-h-[500px]"); c.classList.remove("pb-0"); c.classList.add("pb-5"); t.classList.add("active"); } }); });
window.addEventListener("scroll", () => { navbar.classList.toggle("scrolled", window.scrollY > 50); });
darkModeToggle.addEventListener("click", () => { document.documentElement.classList.toggle("dark"); darkModeToggle.querySelector("i").classList.toggle("fa-moon"); darkModeToggle.querySelector("i").classList.toggle("fa-sun"); });
mobileMenuBtn.addEventListener("click", () => { mobileMenu.classList.toggle("hidden"); });
mobileMenu.querySelectorAll("a").forEach(l => l.addEventListener("click", () => { mobileMenu.classList.add("hidden"); }));
document.addEventListener("DOMContentLoaded", loadProducts);
