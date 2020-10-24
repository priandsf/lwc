import { getBaseUrl } from "../../util/url";

export async function connGetCategories() {
    const r = await fetch(getBaseUrl()+'/api/categories');
    return await r.json();
}

export async function connGetProductsByCategory(category) {
    const r = await fetch(getBaseUrl()+`/api/products?category=${encodeURIComponent(category)}`);
    return await r.json();
}
