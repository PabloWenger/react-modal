(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.reactModal = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SIZE_CLASSES = exports.MODAL_CONTAINER_CLASS = exports.MODAL_BODY_CLASS = exports.MODAL_BACKDROP_CLASS = exports.HAS_MODAL_CLASS = exports.MODAL_CLASS = exports.PREFIX_CLASS = exports.DEFAULT_ZINDEX = void 0;

/**
 * @description zindex por defecto si el componente `ModalContainer` no lo define
 * @type {Number}
 */
var DEFAULT_ZINDEX = 2000;
/**
 * @description clases
 */

exports.DEFAULT_ZINDEX = DEFAULT_ZINDEX;
var PREFIX_CLASS = 'sbj_';
exports.PREFIX_CLASS = PREFIX_CLASS;
var MODAL_CLASS = 'modal';
exports.MODAL_CLASS = MODAL_CLASS;
var HAS_MODAL_CLASS = 'has-modal';
exports.HAS_MODAL_CLASS = HAS_MODAL_CLASS;
var MODAL_BACKDROP_CLASS = 'modal-backdrop';
exports.MODAL_BACKDROP_CLASS = MODAL_BACKDROP_CLASS;
var MODAL_BODY_CLASS = 'modal-body';
exports.MODAL_BODY_CLASS = MODAL_BODY_CLASS;
var MODAL_CONTAINER_CLASS = 'modal-container';
/**
 * @description clases de tamaños a validar;
 */

exports.MODAL_CONTAINER_CLASS = MODAL_CONTAINER_CLASS;
var SIZE_CLASSES = 'small,medium,large';
exports.SIZE_CLASSES = SIZE_CLASSES;

},{}],2:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getModalContainer = getModalContainer;
exports.openModal = _openModal;
exports.closeModal = _closeModal;
exports.ModalContainer = exports.ModalFooter = exports.ModalBody = exports.ModalHeader = exports.Modal = void 0;

var _react = _interopRequireDefault(_dereq_("react"));

var _reactDom = _interopRequireDefault(_dereq_("react-dom"));

var _classnames = _interopRequireDefault(_dereq_("classnames"));

var _propTypes = _interopRequireDefault(_dereq_("prop-types"));

var _constants = _dereq_("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @description permite mantener la referencia del nodo contenedor de las modales
 * @type {Object}
 */
var modalContainer = {};
/**
 * @description colección de modales renderizadas
 * @type {Array}
 */

var modals = [];
/**
 * @description zindex para manejar la visualización. Será definido por `ModalContainer`
 * @type {Number}
 */

var zIndex = 0;
/**
 * @description Polyfill Element.remove
 */

if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function () {
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
  var nodo = getModalContainer();
  var child = nodo.lastElementChild;
  if (!child) return zIndex - 1;
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


function getModalContainer() {
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


function _openModal(component, props) {
  var nodo = getModalContainer();
  var comp = _react.default.isValidElement(component) ? component : _react.default.createElement(component, props);
  document.querySelector('body').classList.add("".concat(_constants.PREFIX_CLASS).concat(_constants.HAS_MODAL_CLASS));
  var backdrop = nodo.querySelector(".".concat(_constants.PREFIX_CLASS).concat(_constants.MODAL_BACKDROP_CLASS));
  var zindex = getZindex() + 1;

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.classList.add("".concat(_constants.PREFIX_CLASS).concat(_constants.MODAL_BACKDROP_CLASS));
    backdrop.style.zIndex = zindex;
    nodo.appendChild(backdrop);
  } else {
    backdrop.style.zIndex = zindex;
  }

  var modal = document.createElement('div');
  modal.style.zIndex = zindex + 1;
  modal.classList.add("".concat(_constants.PREFIX_CLASS).concat(_constants.MODAL_CLASS));
  nodo.appendChild(modal);

  _reactDom.default.render(comp, nodo.lastElementChild);
}
/**
 * @author Sinecio Bermúdez Jacque
 * @description Función que permite cerrar la modal activa.
 */


function _closeModal() {
  var modal = modals.splice(modals.length - 1, 1)[0];
  var nodo = getModalContainer();
  var backdrop = nodo.querySelector(".".concat(_constants.PREFIX_CLASS).concat(_constants.MODAL_BACKDROP_CLASS));
  modal.parentNode.remove();

  _reactDom.default.unmountComponentAtNode(modal.parentNode);

  if (modals.length <= 0) {
    document.querySelector('body').classList.remove("".concat(_constants.PREFIX_CLASS).concat(_constants.HAS_MODAL_CLASS));
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


var Modal =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Modal, _React$Component);

  function Modal(props) {
    _classCallCheck(this, Modal);

    return _possibleConstructorReturn(this, _getPrototypeOf(Modal).call(this, props));
  }

  _createClass(Modal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.__proto__ instanceof Modal) return;
      modals.push(this.refs.modalRef);
    }
  }, {
    key: "openModal",
    value: function openModal(component, props) {
      _openModal(component, props);
    }
  }, {
    key: "closeModal",
    value: function closeModal() {
      _closeModal();
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        ref: "modalRef",
        className: (0, _classnames.default)("".concat(_constants.PREFIX_CLASS).concat(_constants.MODAL_BODY_CLASS), this.props.size, this.props.className)
      }, this.props.children);
    }
  }]);

  return Modal;
}(_react.default.Component);
/**
 * @author Sinecio Bermúdez Jacque
 * @description definición de tipos de propieades aceptadas para `Modal`
 */


exports.Modal = Modal;
Modal.propTypes = {
  size: _propTypes.default.oneOf(_constants.SIZE_CLASSES.replace(/\s/g, '').split(','))
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

};

var ModalHeader =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(ModalHeader, _React$Component2);

  function ModalHeader(props) {
    _classCallCheck(this, ModalHeader);

    return _possibleConstructorReturn(this, _getPrototypeOf(ModalHeader).call(this, props));
  }

  _createClass(ModalHeader, [{
    key: "render",
    value: function render() {
      return _react.default.createElement("header", null, this.props.children);
    }
  }]);

  return ModalHeader;
}(_react.default.Component);
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


exports.ModalHeader = ModalHeader;

var ModalBody =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(ModalBody, _React$Component3);

  function ModalBody(props) {
    _classCallCheck(this, ModalBody);

    return _possibleConstructorReturn(this, _getPrototypeOf(ModalBody).call(this, props));
  }

  _createClass(ModalBody, [{
    key: "render",
    value: function render() {
      return _react.default.createElement("section", null, this.props.children);
    }
  }]);

  return ModalBody;
}(_react.default.Component);
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


exports.ModalBody = ModalBody;

var ModalFooter =
/*#__PURE__*/
function (_React$Component4) {
  _inherits(ModalFooter, _React$Component4);

  function ModalFooter(props) {
    _classCallCheck(this, ModalFooter);

    return _possibleConstructorReturn(this, _getPrototypeOf(ModalFooter).call(this, props));
  }

  _createClass(ModalFooter, [{
    key: "render",
    value: function render() {
      return _react.default.createElement("footer", null, this.props.children);
    }
  }]);

  return ModalFooter;
}(_react.default.Component);
/**
 * @author Sinecio Bermúdez Jacque
 * @description Componente que provee el nodo principal en donde se renderizan las modales
 * basadas en `Modal`.
 * @extends {React.Component}
 * @example
 * import {ModalContainer} from 'commons/modal';
 * export default () => <div><ModalContainer/></div>
 */


exports.ModalFooter = ModalFooter;

var ModalContainer =
/*#__PURE__*/
function (_React$Component5) {
  _inherits(ModalContainer, _React$Component5);

  function ModalContainer(props) {
    var _this;

    _classCallCheck(this, ModalContainer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ModalContainer).call(this, props));
    _this.container = modalContainer = _react.default.createRef();
    _this.zIndex = zIndex = Number(_this.props.zIndex) || _constants.DEFAULT_ZINDEX;
    return _this;
  }

  _createClass(ModalContainer, [{
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        ref: this.container,
        className: "".concat(_constants.PREFIX_CLASS).concat(_constants.MODAL_CONTAINER_CLASS)
      });
    }
  }]);

  return ModalContainer;
}(_react.default.Component);

exports.ModalContainer = ModalContainer;

},{"./constants":1,"classnames":"classnames","prop-types":"prop-types","react":"react","react-dom":"react-dom"}]},{},[2])(2)
});
//# sourceMappingURL=react-modal.js.map
