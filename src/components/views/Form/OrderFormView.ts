import {FormView} from './FormView.ts';
import {IBuyer, TPayment} from '../../../types';
import {ensureAllElements, ensureElement} from '../../../utils/utils.ts';

type TOrderFormViewData = Pick<IBuyer, 'payment' | 'address'>
type TOrderFormViewActions = {
    onClickPayment: (payment: TPayment) => void;
    onInputAddress: (value: string) => void;
    onSubmit: () => void;
};

export class OrderFormView extends FormView<TOrderFormViewData> {
    protected readonly paymentBtnElems: HTMLButtonElement[];
    protected readonly addressInputElem: HTMLInputElement;

    constructor(
        protected readonly container: HTMLFormElement,
        protected readonly actions: TOrderFormViewActions,
    ) {
        super(container, actions);

        this.paymentBtnElems = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
        this.addressInputElem = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.paymentBtnElems.forEach((btnElem: HTMLButtonElement) => {
            btnElem.addEventListener('click', (evt) => {
                const target = evt.target as HTMLButtonElement;
                const btnName = target.name as TPayment;

                actions.onClickPayment(btnName);
            });
        });

        this.addressInputElem.addEventListener('change', () => {
            this.actions.onInputAddress(this.addressInputElem.value);
        })
    }

    set payment(payment: TPayment) {
        this.paymentBtnElems.forEach((btnElem: HTMLButtonElement) => {
            const btnName = btnElem.name as TPayment;
            if (btnName === payment) {
                btnElem.classList.add('button_alt-active');
            }
        });
    }

    set address(address: string) {
        this.addressInputElem.value = address;
    }
}
