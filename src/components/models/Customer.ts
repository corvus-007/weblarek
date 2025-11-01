import {IBuyer, TPayment} from "../../types";

export class Customer {
    private payment: TPayment = '';
    private address: string = '';
    private phone: string = '';
    private email: string = '';

    savePayment(payment: TPayment): void {
        this.payment = payment;
    }

    saveAddress(address: string): void {
        this.address = address;
    }

    savePhone(phone: string): void {
        this.phone = phone;
    }

    saveEmail(email: string): void {
        this.email = email;
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email,
        }
    }

    clear(): any {
        this.payment = '';
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    checkValidity(): { [k in keyof IBuyer]?: string } {
        return {
            payment: "",
            address: "",
            phone: "",
            email: "",
        }
    }
}
