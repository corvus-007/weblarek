import {Component} from '../../base/Component.ts';
import {ensureElement} from '../../../utils/utils.ts';

type TFormViewData = {
    error: string;
};
type TFormViewActions = {
    onSubmit?: () => void;
}

export class FormView<T> extends Component<T & TFormViewData> {
    protected readonly submitBtnElem: HTMLButtonElement;
    protected readonly errorsElem: HTMLElement;

    constructor(
        protected readonly container: HTMLFormElement,
        protected readonly actions?: TFormViewActions,
    ) {
        super(container);

        this.submitBtnElem = ensureElement<HTMLButtonElement>('[type="submit"]', this.container);
        this.errorsElem = ensureElement<HTMLElement>('.form__errors', this.container);

        if (this.actions?.onSubmit) {
            this.container.addEventListener('submit', (evt) => {
                evt.preventDefault();
                this.actions?.onSubmit?.();
            });
        }
    }

    set error(error: string) {
        this.submitBtnElem.disabled = !!error;
        this.errorsElem.textContent = error;
    }
}
