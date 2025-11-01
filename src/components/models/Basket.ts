import {IProduct} from "../../types";

export class Basket {
    private products: IProduct[] = [];

    getItems(): IProduct[] {
        return this.products;
    }

    addItem(product: IProduct): void {
        this.products.push(product);
    }

    deleteItem(productToDelete: IProduct): void {
        this.products = this.products.filter(({id}) => id !== productToDelete.id);
    }

    clear() {
        this.products = [];
    }

    getTotalPrice(): number {
        return this.products.reduce((sum, {price}) => {
            if (price) {
                sum += price;
            }

            return sum;
        }, 0);
    }

    getTotalItems() {
        return this.products.length;
    }

    hasItem(productId: string): boolean {
        return this.products.some(({id}) => id === productId);
    }
}
