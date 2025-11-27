import './scss/styles.scss';
import {Catalog} from './components/models/Catalog.ts';
import {Basket} from './components/models/Basket.ts';
import {Customer} from './components/models/Customer.ts';
import {ProductApi} from './components/api/ProtuctApi.ts';
import {Api} from './components/base/Api.ts';
import {API_URL, eventNames} from './utils/constants.ts';
import {cloneTemplate, ensureElement, isErrorApiResponse} from './utils/utils.ts';
import {HeaderView} from './components/views/HeaderView.ts';
import {EventEmitter} from './components/base/Events.ts';
import {GalleryView} from './components/views/GalleryView.ts';
import {CardCatalogView} from './components/views/Card/CardCatalogView.ts';
import {IOrderApiResponse, IProduct, TPayment} from './types';
import {ModalView} from './components/views/ModalView.ts';
import {CardPreviewView} from './components/views/Card/CardPreviewView.ts';
import {BasketView} from './components/views/BasketView.ts';
import {CardBasketView} from './components/views/Card/CardBasketView.ts';
import {OrderFormView} from './components/views/Form/OrderFormView.ts';
import {ContactsFormView} from './components/views/Form/ContactsFormView.ts';
import {OrderSuccessView} from './components/views/OrderSuccessView.ts';

const productApi = new ProductApi(new Api(API_URL));
const eventEmitter = new EventEmitter();

const catalogModel = new Catalog(eventEmitter);
const basketModel = new Basket(eventEmitter);
const customerModel = new Customer(eventEmitter);

const headerElem = ensureElement<HTMLElement>('.header');
const galleryElem = ensureElement<HTMLElement>('.gallery');
const modalElem = ensureElement<HTMLTemplateElement>('#modal-container');

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const headerView = new HeaderView(headerElem, eventEmitter);
const galleryView = new GalleryView(galleryElem);
const modalView = new ModalView(modalElem);
const basketView = new BasketView(cloneTemplate(basketTemplate), eventEmitter);
const orderSuccessView = new OrderSuccessView(
    cloneTemplate<HTMLElement>(successTemplate),
    {
        onClose: () => {
            modalView.close();
        },
    },
);


eventEmitter.on<IProduct[]>(eventNames.CATALOG_SET_ITEMS, (items) => {
    const catalogCards: HTMLElement[] = items.map(renderCardCatalogView);

    galleryView.render({
        items: catalogCards,
    });
});

eventEmitter.on<IProduct>(eventNames.CARD_SELECT, (item) => {
    catalogModel.setCurrentItem(item);
});

eventEmitter.on<IProduct>(eventNames.CATALOG_SET_CURRENT_ITEM, item => {
    modalView.render({
        content: renderCardPreviewView(item),
    });
})

eventEmitter.on(eventNames.BASKET_OPEN, () => {
    modalView.render({
        content: renderBasketView(),
    });
});

eventEmitter.on<IProduct>(eventNames.CARD_BASKET_DELETE_ITEM, (item) => {
    basketModel.deleteItem(item);
    modalView.render({
        content: renderBasketView(),
    });
});

[
    eventNames.BASKET_ADD_ITEM,
    eventNames.BASKET_DELETE_ITEM,
    eventNames.BASKET_CLEAR,
].forEach((eventName) => {
    eventEmitter.on(eventName, () => {
        renderHeaderView();
    });
});

[
    eventNames.BASKET_CHECKOUT,
    eventNames.CUSTOMER_SET_PAYMENT,
    eventNames.CUSTOMER_SET_ADDRESS,
].forEach((eventName) => {
    eventEmitter.on(eventName, () => {
        modalView.render({
            content: renderOrderFormView(),
        });
    });
});

[
    eventNames.ORDER_FORM_SUBMIT,
    eventNames.CUSTOMER_SET_EMAIL,
    eventNames.CUSTOMER_SET_PHONE,
].forEach((eventName) => {
    eventEmitter.on(eventName, () => {
        modalView.render({
            content: renderContactsFormView(),
        });
    });
});

eventEmitter.on(eventNames.CONTACTS_FORM_SUBMIT, async () => {
    try {
        const response = await productApi.order({
            ...customerModel.getData(),
            total: basketModel.getTotalPrice(),
            items: basketModel.getItems().map(({id}) => id),
        });

        basketModel.clear();
        customerModel.clear();

        modalView.render({
            content: renderOrderSuccessView(response),
        });
    } catch (e: unknown) {
        if (isErrorApiResponse(e)) {
            console.error(e.error);
        } else {
            console.error(e);
        }
    }
});

try {
    const products = await productApi.getProducts();
    catalogModel.setItems(products.items);
} catch (e: unknown) {
    if (isErrorApiResponse(e)) {
        console.error(e.error);
    } else {
        console.error(e);
    }
}

function renderHeaderView(): HTMLElement {
    return headerView.render({
        count: basketModel.getTotalItems(),
    });
}

function renderBasketView(): HTMLElement {
    const basketItems = basketModel.getItems().map(renderCardBasketView);

    return basketView.render({
        items: basketItems,
        total: basketModel.getTotalPrice(),
    });
}

function renderCardBasketView(item: IProduct, index: number): HTMLElement {
    const cardBasketView = new CardBasketView(
        cloneTemplate(cardBasketTemplate),
        {
            onClick: () => {
                eventEmitter.emit(eventNames.CARD_BASKET_DELETE_ITEM, item);
            },
        },
    );

    return cardBasketView.render(
        {...item, index: index + 1},
    );
}

function renderCardPreviewView(item: IProduct): HTMLElement {
    const cardPreviewView = new CardPreviewView(
        cloneTemplate<HTMLTemplateElement>(cardPreviewTemplate),
        {
            onClick: () => {
                if (!basketModel.hasItem(item.id)) {
                    basketModel.addItem(item);
                } else {
                    basketModel.deleteItem(item);
                }

                modalView.close();
            },
        },
    );

    return cardPreviewView.render({
        isInBasket: basketModel.hasItem(item.id),
        ...item,
    });
}

function renderCardCatalogView(item: IProduct): HTMLElement {
    const cardCatalogView = new CardCatalogView(
        cloneTemplate<HTMLTemplateElement>(cardCatalogTemplate),
        {
            onClick: () => {
                eventEmitter.emit(eventNames.CARD_SELECT, item);
            },
        },
    );

    return cardCatalogView.render(item);
}

function renderOrderFormView(): HTMLElement {
    const orderFormView = new OrderFormView(
        cloneTemplate<HTMLFormElement>(orderFormTemplate),
        {
            onClickPayment: (payment: TPayment) => customerModel.setPayment(payment),
            onInputAddress: (address: string) => customerModel.setAddress(address),
            onSubmit: () => eventEmitter.emit(eventNames.ORDER_FORM_SUBMIT),
        },
    );

    const {
        payment,
        address,
    } = customerModel.getData();
    const {
        payment: paymentError,
        address: addressError,
    } = customerModel.checkValidity();
    const error: string = paymentError || addressError || '';

    return orderFormView.render({
        payment,
        address,
        error,
    });
}

function renderContactsFormView(): HTMLElement {
    const contactsFormView = new ContactsFormView(
        cloneTemplate<HTMLFormElement>(contactsFormTemplate),
        {
            onInputEmail: (email: string) => customerModel.setEmail(email),
            onInputPhone: (phone: string) => customerModel.setPhone(phone),
            onSubmit: () => eventEmitter.emit(eventNames.CONTACTS_FORM_SUBMIT),
        },
    );

    const {
        email,
        phone,
    } = customerModel.getData();
    const {
        email: emailError,
        phone: phoneError,
    } = customerModel.checkValidity();
    const error: string = emailError || phoneError || '';

    return contactsFormView.render({
        email,
        phone,
        error,
    });
}

function renderOrderSuccessView({total}: IOrderApiResponse) {
    return orderSuccessView.render({
        total,
    });
}
