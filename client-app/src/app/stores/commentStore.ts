import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";
import ChatComment from "../models/comment";

export default class CommentStore{
    comments:ChatComment[] = [];
    hubConnection:HubConnection | null = null;

    constructor(){
        makeAutoObservable(this)
    }

    createHubConnection(activityId:string){
        if (store.activityStore.selectedActivity){
            this.hubConnection = new HubConnectionBuilder()
            .withUrl("http://localhost:5000/chat?activityId="+activityId,{
                accessTokenFactory: () => store.userStore.user?.token!
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information) 
            .build()

            this.hubConnection.start().catch((error)=>console.log("Error estabilishing the connection: ",error))

            this.hubConnection.on("LoadComments",(comments:ChatComment[])=>{
                runInAction(()=>{
                    comments.forEach(comment =>{
                        comment.createdAt = new Date(comment.createdAt + "Z")
                    })
                    this.comments = comments
                })
            })

            this.hubConnection.on("RecieveComment",(comment:ChatComment)=>{
                runInAction(()=>{
                    comment.createdAt = new Date(comment.createdAt);
                    this.comments.push(comment)
                })
            })
        }
    }

    stopHubConnection =()=>{
        this.hubConnection?.stop().catch((error)=>console.log("Error stopping connection: ",error));
    }

    createComments = ()=> {
        this.stopHubConnection()
        this.comments = []
    }

    addComment = async (value:any) => {
        value.activityId = store.activityStore.selectedActivity?.id;
        try{
            await this.hubConnection?.invoke("SendComment",value); 
        }
        catch(error){
            console.log(error)
        }
    }
}