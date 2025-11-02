import './scss/styles.scss';
import {Catalog} from './components/models/Catalog.ts';
import {Basket} from './components/models/Basket.ts';
import {Customer} from './components/models/Customer.ts';
import {apiProducts} from './utils/data.ts';
import {ProductApi} from './components/api/ProtuctApi.ts';
import {Api} from './components/base/Api.ts';
import {API_URL} from './utils/constants.ts';

const catalogModel = new Catalog();
const basketModel = new Basket();
const customerModel = new Customer();
const productApi = new ProductApi(new Api(API_URL));

catalogModel.setItems(apiProducts.items);
console.log('Сохранение текущего товара');
catalogModel.setCurrentItem(catalogModel.getItem(apiProducts.items[1].id));
console.log('Массив товаров из каталога: ', catalogModel.getItems());
console.log('Товар из каталога по id: ', catalogModel.getItem(apiProducts.items[1].id));
console.log('Текущий товар: ', catalogModel.getCurrentItem());

console.log('====================');

console.log('Добавление товара в корзину');
basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);
console.log('Массив товаров в корзине:', basketModel.getItems());
console.log('Стоимость всех товаров:', basketModel.getTotalPrice());
console.log('Количество товаров в корзине:', basketModel.getTotalItems());
console.log('Проверка наличия товара в корзине (есть)', basketModel.hasItem(apiProducts.items[1].id));
console.log('Проверка наличия товара в корзине (нет)', basketModel.hasItem(apiProducts.items[2].id));
basketModel.addItem(apiProducts.items[2]);
console.log('Удаление товара из корзины');
basketModel.deleteItem(apiProducts.items[0]);
console.log('Очистка корзины');
basketModel.clear();

console.log('====================');

console.log('Сохранение способа оплаты');
customerModel.setPayment('cash');
console.log('Сохранение адреса доставки');
customerModel.setAddress('143004, Москва, ул. Пушкина, д. 4, стр. 1, кв. 44');
console.log('Сохранение email');
customerModel.setEmail('kirill67_44@yandex.ru');
console.log('Сохранение телефона');
customerModel.setPhone('+7 (900) 554-44-00');
console.log('Данные покупателя', customerModel.getData());
console.log('Очистка данных покупателя');
customerModel.clear();
console.log('Данные покупателя после очистки', customerModel.getData());
console.log('Проверка данных покупателя', customerModel.checkValidity());

console.log('====================');

console.log('Получение всех товаров');
const products = await productApi.getProducts();
console.log('Сохраняет полученные товары в модель');
catalogModel.setItems(products.items);
console.log('Сохраненные товары', catalogModel.getItems());
