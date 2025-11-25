import {Component} from '../base/Component.ts';
import {ensureElement} from '../../utils/utils.ts';

interface IModalViewData {
    content: HTMLElement;
}

export class ModalView extends Component<IModalViewData> {
    protected readonly modalContentElem: HTMLElement;
    protected readonly closeButtonElem: HTMLButtonElement;

    constructor(protected readonly container: HTMLElement) {
        super(container);

        this.modalContentElem = ensureElement<HTMLElement>('.modal__content', this.container);
        this.closeButtonElem = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        this.closeButtonElem.addEventListener('click', (evt) => {
            evt.preventDefault();
            this.closeModal();
        });
    }

    protected documentPressEscHandler = (evt: KeyboardEvent) => {
        if (evt.code === 'Escape') {
            this.closeModal();
        }
    };

    protected modalClickHandler = (evt: MouseEvent) => {
        const target = evt.target as HTMLElement;
        const currentTarget = evt.currentTarget as HTMLElement;

        if (target === currentTarget) {
            this.closeModal();
        }
    };

    protected set content(content: HTMLElement) {
        this.modalContentElem.replaceChildren(content);
        this.showModal();
    }

    protected showModal() {
        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this.documentPressEscHandler);
        this.container.addEventListener('click', this.modalClickHandler);
    }

    closeModal() {
        this.container.classList.remove('modal_active');
        document.removeEventListener('keydown', this.documentPressEscHandler);
        this.container.removeEventListener('click', this.modalClickHandler);
    }
}
