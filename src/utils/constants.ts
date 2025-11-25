/* Константа для получения полного пути для сервера. Для выполнения запроса
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`;

/* Константа для формирования полного пути к изображениям карточек.
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

/* Константа соответствий категорий товара модификаторам, используемым для отображения фона категории. */
export const categoryMap = {
    'софт-скил': 'card__category_soft',
    'хард-скил': 'card__category_hard',
    'кнопка': 'card__category_button',
    'дополнительное': 'card__category_additional',
    'другое': 'card__category_other',
};

export const settings = {};

export const eventNames = {
    CATALOG_SET_ITEMS: 'catalog:setItems',

    BASKET_OPEN: 'basket:open',
    BASKET_CHECKOUT: 'basket:checkout',
    BASKET_DELETE_ITEM: 'basket:deleteItem',
    BASKET_CLEAR: 'basket:clear',

    CARD_PREVIEW_ADD_ITEM: 'cardPreview:addItem',
    CARD_BASKET_DELETE_ITEM: 'cardBasket:deleteItem',

    CARD_SELECT: 'card:select',
    CARD_ADD_TO_BASKET: 'card:addToBasket',
    MODAL_CLOSE: 'modal:close',

    ORDER_FORM_SUBMIT: 'orderForm:submit',
    CONTACTS_FORM_SUBMIT: 'contactForm:submit',

    CUSTOMER_SET_PAYMENT: 'customer:setPayment',
    CUSTOMER_SET_ADDRESS: 'customer:setAddress',
    CUSTOMER_SET_PHONE: 'customer:setPhone',
    CUSTOMER_SET_EMAIL: 'customer:setEmail',

    SUCCESS_CLOSE: 'success:close',
};
