import React from 'react';
import { ModalContainer, openModal } from 'react-modal/modal';
import Wrapper from 'commons/wrapper';

import ModalTest1 from './modal-test-1';

/**
 * @author Sinecio Bermúdez Jacque
 * @description Componente principal. 
 * Este componente define la estructura de la aplicación
 * que será insertada en el nodo con ID `app`
 */
export default class App extends React.Component {
    
    constructor(props){
        super(props);
        
        this.openModalTest = this.openModalTest.bind(this);
    }

    openModalTest(){
        openModal(ModalTest1, {
            prop1: 'this is the first modal open',
            onCloseModal: this.onCloseModal.bind(this)
        });
    }

    onCloseModal(params){
        console.log(params);
    }

    render() {
        return (
            <Wrapper>
                <header>
                    <h1>Simple SPA to Test Modal</h1>
                </header>
                <section>
                    <button onClick={this.openModalTest}>Open Modal Test 1</button>
                </section>
                <footer>
                    <ModalContainer/>
                    lorem ipsum
                </footer>
            </Wrapper>
        );
    }
}