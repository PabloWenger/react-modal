import React from 'react';
import ReactDOM from 'react-dom';
import {ModalContainer, Modal, openModal} from 'react-modal/modal';
import Wrapper from 'commons/wrapper';

import {
    PREFIX_CLASS,         
    MODAL_CLASS,          
    HAS_MODAL_CLASS,      
    MODAL_BACKDROP_CLASS, 
} from 'react-modal/constants';

describe('openModal function test', function(){

    var elem = null;
    var modal = null;

    /**
     * create container app
     */
    beforeAll(function(done){

        const App = () => (
            <Wrapper>
                <div>
                    <ModalContainer/>
                </div>
            </Wrapper>
        );

        elem = document.getElementById('app');
        ReactDOM.render(<App></App>, elem);

        modal = class extends Modal {
            constructor(props){
                super(props);

                this.closeThisModal = this.closeThisModal.bind(this);
            }

            closeThisModal(){
                super.closeModal();
            }

            render(){
                return (
                    <Modal size="medium">
                        <div>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </div>
                        <button onClick={this.closeThisModal}>Close Modal</button>
                    </Modal>
                );
            }
        }

        openModal(modal, {
            prop1: 'a simple string prop'
        });

        done();
    });

    it('should set a class to the body element', function(){
        expect(document.body.classList.contains(`${PREFIX_CLASS}${HAS_MODAL_CLASS}`)).toBe(true);
    });

    it('should create a first child element as backdrop for modal', function(){
        var backdrop = elem.querySelector(`.${PREFIX_CLASS}${MODAL_BACKDROP_CLASS}`);
        expect(backdrop instanceof Element).toBe(true);
    });

    it('should create a child element and append to <ModalContainer>', function(){
        var modalElem = elem.querySelector(`.${PREFIX_CLASS}${MODAL_CLASS}`);
        expect(modalElem instanceof Element).toBe(true);
    });
});