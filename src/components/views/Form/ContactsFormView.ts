import {FormView} from './FormView.ts';
import {IBuyer} from '../../../types';
import {ensureElement} from '../../../utils/utils.ts';

type TContactsFormViewData = Pick<IBuyer, 'email' | 'phone'>;
type TContactsFormViewActions = {
    onInputEmail?: (value: string) => void;
    onInputPhone?: (value: string) => void;
    onSubmit?: () => void;
};

export class ContactsFormView extends FormView<TContactsFormViewData> {
    protected readonly emailInputElem: HTMLInputElement;
    protected readonly phoneInputElem: HTMLInputElement;

    constructor(
        protected readonly container: HTMLFormElement,
        protected readonly actions?: TContactsFormViewActions,
    ) {
        super(container, actions);

        this.emailInputElem = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInputElem = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        if (this.actions?.onInputEmail) {
            this.emailInputElem.addEventListener('change', () => {
                this.actions?.onInputEmail?.(this.emailInputElem.value);
            });
        }

        if (this.actions?.onInputPhone) {
            this.phoneInputElem.addEventListener('change', () => {
                this.actions?.onInputPhone?.(this.phoneInputElem.value);
            });
        }
    }

    set email(email: string) {
        this.emailInputElem.value = email;
    }

    set phone(phone: string) {
        this.phoneInputElem.value = phone;
    }
}
