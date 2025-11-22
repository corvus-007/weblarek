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
import {IProduct} from './types';
import {ModalView} from './components/views/ModalView.ts';
import {CardPreviewView} from './components/views/Card/CardPreviewView.ts';
import {BasketView} from './components/views/BasketView.ts';
import {CardBasketView} from './components/views/Card/CardBasketView.ts';

const productApi = new ProductApi(new Api(API_URL));
const eventEmitter = new EventEmitter();

const catalogModel = new Catalog(eventEmitter);
const basketModel = new Basket(eventEmitter);
const customerModel = new Customer();

const headerElement = ensureElement<HTMLElement>('.header');
const galleryElement = ensureElement<HTMLElement>('.gallery');
const modalElement = ensureElement<HTMLTemplateElement>('#modal-container');

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');


const headerView = new HeaderView(headerElement, eventEmitter);
const galleryView = new GalleryView(galleryElement);
const modalView = new ModalView(modalElement, eventEmitter);


eventEmitter.on<IProduct[]>(eventNames.CATALOG_SET_ITEMS, (items) => {
    const catalogCards: HTMLElement[] = items.map(renderCardCatalogView);

    galleryView.render({
        items: catalogCards,
    });
});

eventEmitter.on<IProduct>(eventNames.CARD_SELECT, (item) => {
    catalogModel.setCurrentItem(item);

    modalView.render({
        content: renderCardPreviewView(item),
    });
});

eventEmitter.on(eventNames.BASKET_OPEN, () => {
    modalView.render({
        content: renderBasketView(),
    });
});

eventEmitter.on(eventNames.CARD_PREVIEW_ADD_ITEM, () => {
    renderHeaderView();
    modalView.closeModal();
});

eventEmitter.on<IProduct>(eventNames.CARD_BASKET_DELETE_ITEM, (item) => {
    basketModel.deleteItem(item);
    modalView.render({
        content: renderBasketView(),
    });
});

eventEmitter.on(eventNames.BASKET_DELETE_ITEM, () => {
    renderHeaderView();
});

eventEmitter.on(eventNames.CARD_ADD_TO_BASKET, () => {
    const currentItem = catalogModel.getCurrentItem();

    if (currentItem) {
        basketModel.addItem(currentItem);
    }
});

eventEmitter.on(eventNames.MODAL_CLOSE, () => {
    catalogModel.setCurrentItem(null);
});

eventEmitter.on(eventNames.BASKET_CHECKOUT, () => {
    console.log('BASKET_CHECKOUT');
});


try {
    const products = await productApi.getProducts();
    catalogModel.setItems(products.items);
} catch (e: unknown) {
    if (isErrorApiResponse(e)) {
        console.error(e.error);
    } else {
        console.log(e);
    }
}

function renderHeaderView(): HTMLElement {
    return headerView.render({
        count: basketModel.getTotalItems(),
    });
}

function renderBasketView(): HTMLElement {
    const basketView = new BasketView(cloneTemplate(basketTemplate), eventEmitter);
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

                modalView.closeModal();
            },
        },
    );

    return cardPreviewView.render({
        ...item,
        isInBasket: basketModel.hasItem(item.id),
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
