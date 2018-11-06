# React-Modal
react-modal is a simple method to create component modals for [React](https://github.com/facebook/react). It's written using ES6 with  [Grunt](https://gruntjs.com/) and [Browserify](http://browserify.org/).

### Installation
```
npm install @sysopnecho/react-modal --save
```
### How to use
**1.-** first of all, you have to use `ModalContainer` to mark where you want render your modal compoments:
```JavaScript
import React from 'react';
import ReactDOM from 'react-dom';
import { ModalContainer } from '@sysopnecho/react-modal';

const app = () => 
<div>
    <h1>react-modal example</h1>
    <ModalContainer/>
</div>

ReactDOM.render(<App></App>, document.getElementById('app'));
```

**2.-** Then, to render a component modal you have to call `openModal` function and pass your component and props:
```JavaScript
import React from 'react';
import { openModal } from '@sysopnecho/react-modal';
import MyModalComponent from 'components/modals';

export default class ParentComponentView extends React.Component {
    constructor(props){
        super(props);
        this.openMyModalComponent = this.openMyModalComponent.bind(this);
    }
    
    openMyModalComponent(){
        openModal(MyModalComponent, {
            prop1: 'a string prop',
            prop2: 100 // a number prop,
            onClose: this.onCloseMyModalComponent.bind(this) //a callback
        });
    }
    
    onCloseMyModalComponent(args){
        console.log(args);
    }
    
    render(){
        return (
            <div>Lorem ipsum
                <button onClick={this.openMyModalComponent}>Open MyModalComponent modal</button>
            </div>
        )
    }
}
```
**3.-** Must use `Modal` to extend your modal components, if you want, you can use `ModalHeader, ModalBody, ModalFooter`:
```JavaScript
import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@sysopnecho/react-modal';

export default class MyModalComponent extends Modal {
    constructor(props){
        super(props);
        this.closeThisModal = this.closeThisModal.bind(this);
    }
    
    componentWillUnmount(){
        if (typeof this.props.onClose == 'function') {
            this.props.onClose({
                Message: 'some for ParentComponentView'
            });
        }
    }
    
    closeThisModal(){
        super.closeModal();
    }
    
    render(){
        return (
            <Modal size="medium">
                <ModalHeader>
                    <h1>My Modal Component</h1>
                </ModalHeader>
                <ModalBody>
                    <span>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</span>
                    <br></br>
                    <span>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</span>
                </ModalBody>
                <ModalFooter>
                    <strong>inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo</strong>
                    <button onClick={this.closeThisModal}>Close Modal</button>
                </ModalFooter>
            </Modal>
        )
    }
}
```
>Note:
>when you extend your component with `Modal` you don't need import `openModal`, you can use `super.openModal`.

**4.-** you also need import the basic styles:
```scss
@import '@sysopnecho/react-modal/dist/sass/main' //using './node_modules' in sass path
```
>Note:
>by default, it uses the following css classes when renders modals. **You must cumtomize it**:
> `sbj_has-modal` for body element (indicate that there is a opened modal)
> `sbj_modal-container` for container element
> `sbj_modal-backdrop` for modal backdrop (one that changes its zindex)
> `sbj_modal` for rendered modal component (over modal backdrop)
> `sbj_modal-body` for all contents inside `<Modal></Modal>`

### Modal Props
currently `<Modal>` accepts:
* size `String` :  small, medium, large
* className `String|Object` : supports plain object (see [classnames](https://github.com/JedWatson/classnames))

### Development
Want to contribute? Great!
React-Modal uses [Grunt](https://gruntjs.com/) and [Browserify](http://browserify.org/) for fast developing.
Make a change in your file and instantanously see your updates!

Open your favorite Terminal and run this command:
```sh
npm start
```
