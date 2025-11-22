import {Component} from '../base/Component.ts';
import {ensureElement} from '../../utils/utils.ts';
import {IEvents} from '../base/Events.ts';
import {eventNames} from '../../utils/constants.ts';

interface IModalViewData {
    content: HTMLElement;
}

export class ModalView extends Component<IModalViewData> {
    protected readonly modalContentElement: HTMLElement;
    protected readonly closeButtonElement: HTMLButtonElement;

    constructor(
        protected readonly container: HTMLElement,
        protected readonly events: IEvents,
    ) {
        super(container);

        this.modalContentElement = ensureElement<HTMLElement>('.modal__content', this.container);
        this.closeButtonElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        this.closeButtonElement.addEventListener('click', () => {
            events.emit(eventNames.MODAL_CLOSE);
            this.closeModal();
        });
    }

    protected documentPressEscHandler = (e: KeyboardEvent) => {
        if (e.code === 'Escape') {
            this.closeModal();
        }
    };

    protected set content(content: HTMLElement) {
        this.modalContentElement.replaceChildren(content);
        this.showModal();
    }

    showModal() {
        this.container.classList.add('modal_active');
        document.addEventListener('keydown', this.documentPressEscHandler);
    }

    closeModal() {
        this.container.classList.remove('modal_active');
        document.removeEventListener('keydown', this.documentPressEscHandler);
    }
}
