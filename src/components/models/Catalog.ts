import {IProduct} from '../../types';
import {IEvents} from '../base/Events.ts';
import {eventNames} from '../../utils/constants.ts';

export class Catalog {
    private items: IProduct[] = [];
    private currentItem: IProduct | null = null;
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit(eventNames.CATALOG_SET_ITEMS, [...this.items]);
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItem(itemId: string): IProduct | null {
        return this.items.find(({id}) => id === itemId) ?? null;
    }

    setCurrentItem(item: IProduct | null): void {
        this.currentItem = item;
        if (item) {
            this.events.emit<IProduct>('product:setCurrent', item);
        } else {
            this.events.emit('product:resetCurrent');
        }
    }

    getCurrentItem(): IProduct | null {
        return this.currentItem;
    }
}
