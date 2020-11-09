import { Store } from 'b2c_lite_commerce/store';
import { connGetCategories, connGetProductsByCategory } from './productConnector'

export const categoriesStore = new Store('CategoriesStore',{loader:getCategories});
export const productsStore = new Store('ProductsStore',{loader:getProductsByCategory});

export async function getCategories() {
    const categories = await connGetCategories();
    return categories;
}

export async function getProductsByCategory(category) {
    const products = await connGetProductsByCategory(category);
    return products;
}
