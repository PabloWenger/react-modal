import React from 'react';

/**
 * @author Sinecio Bermúdez Jacque
 * @description envoltorio para los casos donde se necesita escribir nodos `sibling` sin un nodo
 * padre.
 */
export default class Wrapper extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return this.props.children;
    }
}