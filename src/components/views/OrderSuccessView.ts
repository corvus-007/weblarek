import {Component} from '../base/Component.ts';
import {ensureElement} from '../../utils/utils.ts';
import {IOrderApiResponse} from '../../types';

type TOrderSuccessViewData = Pick<IOrderApiResponse, 'total'>;
type TOrderSuccessViewActions = {
    onClose?: () => void;
}

export class OrderSuccessView extends Component<TOrderSuccessViewData> {
    protected readonly descriptionElem: HTMLParagraphElement;
    protected readonly closeBtnElem: HTMLButtonElement;

    constructor(
        protected readonly container: HTMLElement,
        protected readonly actions?: TOrderSuccessViewActions,
    ) {
        super(container);

        this.descriptionElem = ensureElement<HTMLParagraphElement>('.order-success__description', this.container);
        this.closeBtnElem = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        if (this.actions?.onClose) {
            this.closeBtnElem.addEventListener('click', this.actions.onClose);
        }
    }

    set total(total: number) {
        this.descriptionElem.textContent = `Списано ${total} синапсов`;
    }
}
