import {IBuyer, TBuyerValidityMessages, TPayment} from '../../types';
import {eventNames} from '../../utils/constants.ts';
import {IEvents} from '../base/Events.ts';

export class Customer {
    private payment: TPayment = '';
    private address: string = '';
    private phone: string = '';
    private email: string = '';

    constructor(protected readonly events: IEvents) {
    }

    setPayment(payment: TPayment): void {
        this.payment = payment;
        this.events.emit<Pick<IBuyer, 'payment'>>(eventNames.CUSTOMER_SET_PAYMENT, {payment});
    }

    setAddress(address: string): void {
        this.address = address;
        this.events.emit<Pick<IBuyer, 'address'>>(eventNames.CUSTOMER_SET_ADDRESS, {address});
    }

    setPhone(phone: string): void {
        this.phone = phone;
        this.events.emit<Pick<IBuyer, 'phone'>>(eventNames.CUSTOMER_SET_PHONE, {phone});
    }

    setEmail(email: string): void {
        this.email = email;
        this.events.emit<Pick<IBuyer, 'email'>>(eventNames.CUSTOMER_SET_PHONE, {email});
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email,
        };
    }

    clear(): void {
        this.payment = '';
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    checkValidity(): TBuyerValidityMessages {
        const errors: TBuyerValidityMessages = {};

        if (!this.payment) {
            errors.payment = 'Выберите способ оплаты';
        }

        if (!this.address.trim()) {
            errors.address = 'Необходимо указать адрес';
        }

        if (!this.phone.trim()) {
            errors.phone = 'Необходимо указать телефон';
        }

        if (!this.email.trim()) {
            errors.email = 'Необходимо указать email';
        }

        return errors;
    }
}
