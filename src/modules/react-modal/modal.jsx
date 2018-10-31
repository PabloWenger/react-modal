import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {
    DEFAULT_ZINDEX,
    PREFIX_CLASS,         
    MODAL_CLASS,          
    HAS_MODAL_CLASS,      
    MODAL_BACKDROP_CLASS, 
    MODAL_BODY_CLASS,     
    MODAL_CONTAINER_CLASS,
    SIZE_CLASSES
} from './constants';

/**
 * @description permite mantener la referencia del nodo contenedor de las modales
 * @type {Object}
 */
var modalContainer = {};

/**
 * @description colección de modales renderizadas
 * @type {Array}
 */
var modals  = [];

/**
 * @description zindex para manejar la visualización. Será definido por `ModalContainer`
 * @type {Number}
 */
var zIndex  = 0;

/**
 * @description Polyfill Element.remove
 */
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (!this.parentNode) return;
        this.parentNode.removeChild(this);
    };
}

/**
 * @author Sinecio Bermúdez Jacque
 * @description función que permite obtener el zindex adecuado para establecer
 * en el backdrop y a la modal.
 */
function getZindex() {
    let nodo = getModalContainer();
    let child = nodo.lastElementChild;
    if (!child) return zIndex-1;
    return Number(child.style.zIndex);
}

/**
 * @author Sinecio Bermúdez Jacque
 * @description función que permite obtener el nodo contenedor principal
 * en donde se insertan las modales. Para generar el nodo contenedor
 * se debe usar el componente `ModalContainer`.
 * @example
 * import {ModalContainer} from 'commons/modal';
 * export default () => <div><ModalContainer/></div>
 * 
 */
export function getModalContainer() {
    if (!modalContainer.current) { 
        throw 'No existe contenedor para modales. Necesitas usar <ModalContainer/> para indicar el nodo contendor.';
    }
    return modalContainer.current;
}

/**
 * @author Sinecio Bermúdez Jacque
 * @param {React.Component|React.ReactElement} component componente o elemento que se renderizará como contenido de la modal.
 * @param {Object} props objeto literal que define las propiedades a pasar al componente defindo en `component`. Este
 * argumento no es considerado cuando `component` es un `React.ReactElement` valido, en este caso las propiedades deben
 * estar defindidas como atributos del elemento.
 * @example 
 * import MiComponente from 'modals/mi-componente';
 * import { openModal } from 'commons/modal';
 * 
 * export default class ParentComponent extends React.Component {
 *      constructor(props){
 *          super(props);
 *      }
 * 
 *      //renderiza modal utilizando directamente `MiComponente`
 *      //en este caso se utiliza el segundo argumento para indicar las propiedades
 *      abrirModal1(){
 *          openModal(MiComponente, {
 *              prop1: 'foo',
 *              prop2: 'baz'
 *          })
 *      }
 * 
 *      //renderiza modal utilizando `MiComponente` como elemento
 *      //en este caso se utiliza el segundo argumento no se utiliza
 *      abrirModal1(){
 *          let prop1 = 'foo';
 *          let prop2 = 'baz';
 *          openModal(<MiComponente prop1={prop1} prop2={prop2}></MiComponente>);
 * 
 *          openModal(<MiComponente prop1="foo" prop2="baz"></MiComponente>);
 *      }
 * }
 */
export function openModal(component, props){
    let nodo = getModalContainer();
    let comp = React.isValidElement(component) ? component : React.createElement(component, props);

    document.querySelector('body').classList.add(`${PREFIX_CLASS}${HAS_MODAL_CLASS}`);

    let backdrop = nodo.querySelector(`.${PREFIX_CLASS}${MODAL_BACKDROP_CLASS}`);
    let zindex = getZindex() + 1;

    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.classList.add(`${PREFIX_CLASS}${MODAL_BACKDROP_CLASS}`);
        backdrop.style.zIndex = zindex;
        nodo.appendChild(backdrop);
    } else {
        backdrop.style.zIndex = zindex;
    }

    let modal = document.createElement('div');
    modal.style.zIndex = zindex+1;
    modal.classList.add(`${PREFIX_CLASS}${MODAL_CLASS}`);

    nodo.appendChild(modal);
    ReactDOM.render(comp, nodo.lastElementChild);
}

/**
 * @author Sinecio Bermúdez Jacque
 * @description Función que permite cerrar la modal activa.
 */
export function closeModal() {
    let modal = modals.splice(modals.length-1, 1)[0];
    let nodo = getModalContainer();
    let backdrop = nodo.querySelector(`.${PREFIX_CLASS}${MODAL_BACKDROP_CLASS}`);
    
    modal.parentNode.remove();
    ReactDOM.unmountComponentAtNode(modal.parentNode);

    if (modals.length <= 0) {
        document.querySelector('body').classList.remove(`${PREFIX_CLASS}${HAS_MODAL_CLASS}`);
        backdrop.remove();
    } else {
        backdrop.style.zIndex = getZindex() - 1;
    }
}

/**
 * @author Sinecio Bermúdez Jacque
 * @description Componente Base de las cuales deben heredar los componentes que serán 
 * renderizados en una Modal. Hereda de `BaseComponent`.
 * @extends {React.Component}
 * @example
 * import { Modal } from 'commons/modal';
 * export default class MiModal extends Modal {
 *      constructor(props){
 *          super(props);
 * 
 *          this.cerrarModal = this.cerrarModal.bind(this);
 *      }
 * 
 *      //método extendido desde Modal
 *      cerrarModal(){
 *          super.closeModal();
 *      }
 * 
 *      render(){
 *          <Modal>
 *              <span>este contenido es renderizado en una modal</span>
 *              <button onClick={this.cerrarModal}>Cerrar</button>
 *          </Modal>
 *      }
 * }
 */
export class Modal extends React.Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        if (this.__proto__ instanceof Modal) return;
        modals.push(this.refs.modalRef);
    }

    openModal(component, props){
        openModal(component, props);
    }

    closeModal(){
        closeModal();
    }

    render(){
        return (
            <div ref="modalRef" className={classNames(`${PREFIX_CLASS}${MODAL_BODY_CLASS}`, this.props.size, this.props.className)}>
                {this.props.children}
            </div>
        )
    }
}

/**
 * @author Sinecio Bermúdez Jacque
 * @description definición de tipos de propieades aceptadas para `Modal`
 */
Modal.propTypes = {
    size: PropTypes.oneOf(SIZE_CLASSES.replace(/\s/g,'').split(','))
}

/**
 * @author Sinecio Bermúdez Jacque
 * @description Componente que provee la estructura del header de un componente
 * basado en `Modal`.
 * @extends {React.Component}
 * @example
 * import {Modal, ModalHeader} from 'commons/modal';
 * export default class MiModal extends Modal {
 *      
 *      constructor(props){
 *          super(props);
 *      }
 *      
 *      render(){
 *          <Modal>
 *              <ModalHeader>
 *                  <h1>Este es el header de MiModal</h1>
 *              </ModalHeader>
 *              <span>este contenido es renderizado en una modal</span>
 *          </Modal>
 *      }
 * }
 */
export class ModalHeader extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <header>
                {this.props.children}
            </header>
        )
    }
}

/**
 * @author Sinecio Bermúdez Jacque
 * @description Componente que provee la estructura del cuerpo de un componente
 * basado en `Modal`.
 * @extends {React.Component}
 * @example
 * import {Modal, ModalBody} from 'commons/modal';
 * export default class MiModal extends Modal {
 *      
 *      constructor(props){
 *          super(props);
 *      }
 *      
 *      render(){
 *          <Modal>
 *              <ModalBody>
 *                  <span>este contenido es renderizado en una modal</span>
 *              </ModalBody>
 *          </Modal>
 *      }
 * }
 */
export class ModalBody extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <section>
                {this.props.children}
            </section>
        )
    }
}

/**
 * @author Sinecio Bermúdez Jacque
 * @description Componente que provee la estructura del footer de un componente
 * basado en `Modal`.
 * @extends {React.Component}
 * @example
 * import {Modal, ModalFooter} from 'commons/modal';
 * export default class MiModal extends Modal {
 *      
 *      constructor(props){
 *          super(props);
 *      }
 *      
 *      render(){
 *          <Modal>
 *              <span>este contenido es renderizado en una modal</span>
 *              <ModalFooter>
 *                  <span>Este es el footer de MiModal</span>
 *              </ModalFooter>
 *          </Modal>
 *      }
 * }
 */
export class ModalFooter extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <footer>
                {this.props.children}
            </footer>
        )
    }
}

/**
 * @author Sinecio Bermúdez Jacque
 * @description Componente que provee el nodo principal en donde se renderizan las modales
 * basadas en `Modal`.
 * @extends {React.Component}
 * @example
 * import {ModalContainer} from 'commons/modal';
 * export default () => <div><ModalContainer/></div>
 */
export class ModalContainer extends React.Component {
    constructor(props){
        super(props);

        this.container = modalContainer = React.createRef();
        this.zIndex = zIndex = Number(this.props.zIndex) || DEFAULT_ZINDEX;
    }

    render() {
        return (
            <div ref={this.container} className={`${PREFIX_CLASS}${MODAL_CONTAINER_CLASS}`}></div>
        )
    }
}
