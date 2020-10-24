import { createStore } from '../../util/store';
import { connGetCategories, connGetProductsByCategory } from './productConnector'

export const categoriesStore = createStore('CategoriesStore',{loader:getCategories});
export const productsStore = createStore('ProductsStore',{loader:getProductsByCategory});

export async function getCategories() {
    const categories = await connGetCategories();
    return categories;
}

export async function getProductsByCategory(category) {
    const products = await connGetProductsByCategory(category);
    return products;
}
