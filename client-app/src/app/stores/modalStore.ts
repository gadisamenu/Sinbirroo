import { makeAutoObservable } from "mobx"

interface Modal{
    body:JSX.Element|null,
    open:boolean
}

export default class ModalStore{
    modal:Modal = {
        body:null,
        open:false
    }
    
    constructor() {
        makeAutoObservable(this)        
    }

    openModal = (content:JSX.Element)=>{
        this.modal.open = true;
        this.modal.body = content;
    }

    closeModal = ()=>{
        this.modal.open = false;
        this.modal.body = null;
    }
}

