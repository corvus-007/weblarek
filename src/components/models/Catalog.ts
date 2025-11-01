import {IProduct} from '../../types';

export class Catalog {
    private products: IProduct[] = [];
    private currentItem: IProduct | null = null;

    setItems(products: IProduct[]): void {
        this.products = products;
    }

    getItems(): IProduct[] {
        return this.products;
    }

    getItem(productId: string): IProduct | null {
        return this.products.find(({id}) => id === productId) ?? null;
    }

    setCurrentItem(product: IProduct | null): void {
        this.currentItem = product;
    }

    getCurrentItem(): IProduct | null {
        return this.currentItem;
    }
}
