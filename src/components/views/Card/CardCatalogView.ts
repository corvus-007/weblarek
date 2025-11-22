import {IProduct} from '../../../types';
import {CardView} from './CardView.ts';
import {ensureElement} from '../../../utils/utils.ts';
import {categoryMap, CDN_URL} from '../../../utils/constants.ts';

type TCategoryNames = keyof typeof categoryMap;
type TCardCatalogViewData = Pick<IProduct, 'image' | 'category'>;
type TCardCatalogViewActions = {
    onClick?: () => void;
};

export class CardCatalogView<T> extends CardView<TCardCatalogViewData & T> {
    protected readonly categoryElement: HTMLElement;
    protected readonly imageElement: HTMLImageElement;

    constructor(
        protected readonly container: HTMLElement,
        protected readonly actions?: TCardCatalogViewActions,
    ) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }

    set category(category: TCategoryNames) {
        const CATEGORY_CLASS = 'card__category';
        const categoryClassModifier = this.getCategoryClassByCategoryName(category);

        this.categoryElement.textContent = category;
        this.categoryElement.className = `${CATEGORY_CLASS} ${categoryClassModifier}`;
    }

    set image(imageSrc: string) {
        this.setImage(this.imageElement, CDN_URL + imageSrc);
    }

    protected getCategoryClassByCategoryName(categoryName: TCategoryNames): string {
        return categoryMap[categoryName];
    }
}
