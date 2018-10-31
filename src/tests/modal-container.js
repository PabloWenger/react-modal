import React from 'react';
import ReactDOM from 'react-dom';
import {ModalContainer} from 'react-modal/modal';
import Wrapper from 'commons/wrapper';

import {
    PREFIX_CLASS,          
    MODAL_CONTAINER_CLASS
} from 'react-modal/constants';

describe('<ModalContainer> test', function(){

    var elem = null;

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

        done();
    });

    it('modal container should create a child element', function(){
        var container = elem.querySelector(`.${PREFIX_CLASS}${MODAL_CONTAINER_CLASS}`);
        expect(container instanceof Element).toBe(true);
    });
});