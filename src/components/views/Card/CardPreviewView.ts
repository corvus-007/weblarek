import {IProduct} from '../../../types';
import {CardCatalogView} from './CardCatalogView.ts';
import {ensureElement} from '../../../utils/utils.ts';

type TCardPreviewViewData = { isInBasket: boolean } & Pick<IProduct, 'description' | 'price'>;
type TCardPreviewViewActions = {
    onClick?: () => void;
};

export class CardPreviewView extends CardCatalogView<TCardPreviewViewData> {
    protected readonly descriptionElement: HTMLParagraphElement;
    protected readonly buttonElement: HTMLButtonElement;

    constructor(
        protected readonly container: HTMLElement,
        protected readonly actions?: TCardPreviewViewActions,
    ) {
        super(container);

        this.descriptionElement = ensureElement<HTMLParagraphElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (actions?.onClick) {
            this.buttonElement.addEventListener('click', actions.onClick);
        }
    }

    set isInBasket(isInBasket: boolean) {
        this.buttonElement.textContent = isInBasket
            ? 'Удалить из корзины'
            : 'В корзину';
    }

    set description(description: string) {
        this.descriptionElement.textContent = description;
    }

    set price(price: number | null) {
        if (!price) {
            this.buttonElement.disabled = true;
            this.buttonElement.textContent = 'Недоступно';
        }

        super.price = price;
    }
}
