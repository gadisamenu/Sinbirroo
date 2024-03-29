import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../routes/Routes";


export default class UserStore{
    user : User | null = null;
    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn(){
        return !!this.user;
    }

    login = async (cred:UserFormValues)=>{
        try {
            const user =  await agent.Account.login(cred);
            store.commonStore.setToken(user.token);
            runInAction(()=>this.user = user);
            router.navigate("/activities")
            store.modalStore.closeModal();
            
        } catch (error) {
            throw error;
        }
    }

    register = async (cred:UserFormValues)=>{
        try {
            const user =  await agent.Account.register(cred);
            store.commonStore.setToken(user.token);
            runInAction(()=>this.user = user);
            router.navigate("/activities")
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    logout = async ()=>{
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate("/")
    }

    getUser = async ()=>{
        try {
            const user = await agent.Account.current();
            runInAction(()=>this.user = user);
        } catch (error) {
            console.log(error)
        }

    }

    setDisplayName = (displayName:string)=>{
        if (this.user){
            this.user.displayName = displayName
        }
    }

    setImage = (image:string)=>{
        if(this.user){
            this.user.image = image;
        }
    }
}