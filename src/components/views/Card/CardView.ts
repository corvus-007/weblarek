import {Component} from '../../base/Component.ts';
import {IProduct} from '../../../types';
import {ensureElement} from '../../../utils/utils.ts';

type TCardViewData = Pick<IProduct, 'title' | 'price'>;

export class CardView<T> extends Component<T & TCardViewData> {
    protected readonly titleElement: HTMLElement;
    protected readonly priceElement: HTMLElement;

    constructor(protected readonly container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(title: string) {
        this.titleElement.textContent = title;
    }

    set price(price: number | null) {
        this.priceElement.textContent = price
            ? `${price} синапсов`
            : 'Бесценно';
    }
}
