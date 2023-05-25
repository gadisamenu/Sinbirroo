import {  makeAutoObservable, runInAction } from "mobx"
import { Activity, ActivityFormValue } from "../models/activity";
import agent from "../api/agent";
import {format} from 'date-fns'
import { store } from "./store";
import { Profile } from "../models/profile";
export default class ActivityStore{
    activitiesRegistery = new Map<string, Activity> ();
    selectedActivity: Activity | undefined = undefined
    editMode = false;
    loading = false
    loadingInitial = false
    

    constructor(){
        makeAutoObservable(this)
    }

    get activitiesByDate(){
        return Array.from(this.activitiesRegistery.values()).sort((a,b)=>(a.date!.getTime()- b.date!.getTime()))
    }
    
    get groupActivities(){
        return Object.entries(this.activitiesByDate.reduce((activities,activity)=>{
            const date =  format(activity.date!,'dd MMM yyyy')
            activities[date] = activities[date] ? [...activities[date],activity]: [activity]
            return activities
        },{} as {[key:string]:Activity[] })
        )
    }

    loadActivities= async ()=>{
        this.setLoadingInitial(true)
        try{
            const activities = await agent.Activities.list()
            activities.forEach(activity=>{
                this.addActivity(activity)
            })
            this.setLoadingInitial(false)
        }
        catch(error){
            console.log(error)
            this.setLoadingInitial(false)
        }
    }

    loadActivity = async (id:string)=>{
        let activity = this.activitiesRegistery.get(id)
        if (activity) {
            this.selectedActivity =activity
            return activity
        }
        else{
            this.setLoadingInitial(true)
            try {
                activity = await agent.Activities.details(id)
                this.addActivity(activity)
                this.setSelectedActivity(activity)
                this.setLoadingInitial(false)
                return activity
            } catch (error) {
                console.log(error)
                this.setLoadingInitial(false)
            }
        }
    }

    private addActivity = (activity:Activity) =>{
        const user = store.userStore.user;
        if(user){
            activity.isGoing = activity.attendees?.some(a=>a.username === user.username)
            activity.isHost = activity.hostUsername === user.username
            activity.host = activity.attendees?.find((at)=>at.username === activity.hostUsername)
        }
        activity.date = new Date(activity.date!)
        this.activitiesRegistery.set(activity.id,activity)
    }
    
    setSelectedActivity = (activity:Activity) => this.selectedActivity = activity
    setEditMode = (value:boolean) => this.editMode = value
    setloading = (value:boolean) => this.loading = value
    setLoadingInitial = (value:boolean) => this.loadingInitial = value

    createActivity = async (activity:ActivityFormValue) => {
        const user = store.userStore.user
        const profile = new Profile(user!)
        try{
            await agent.Activities.create(activity);
            var newActivity = new Activity(activity);
            newActivity.hostUsername = user?.username
            newActivity.attendees = [profile]
            this.addActivity(newActivity)
            this.setSelectedActivity(newActivity)

        }catch(error){
            console.log(error)
        }
    }

    updateActivity = async (activity:ActivityFormValue)=>{
        try {
            await agent.Activities.update(activity);
            runInAction(()=>{
                if(activity.id){
                    let updatedActivity = {...this.loadActivity(activity.id),...activity}
                    this.activitiesRegistery.set(activity.id,updatedActivity as Activity)
                    this.setSelectedActivity(updatedActivity as Activity)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }  
    
    deleteActivity= async (id:string )=>{
        this.loading = true
        try {
            await agent.Activities.delete(id)
            runInAction(()=>{
                this.activitiesRegistery.delete(id)
            })
            this.setloading(false)
        } catch (error) { 
            console.log(error) 
            this.setloading(false)       
        }
    }

    updateAttendence = async()=>{
        const user = store.userStore.user;
        this.loading = true
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(()=>{

                if(this.selectedActivity?.isGoing){
                    this.selectedActivity!.attendees = this.selectedActivity?.attendees?.filter(a=>a.username !== user!.username)
                    this.selectedActivity!.isGoing  = false
                }else{
                    this.selectedActivity?.attendees?.push(new Profile(user!))
                    this.selectedActivity!.isGoing = true
                }
                this.activitiesRegistery.set(this.selectedActivity!.id,this.selectedActivity!)
            });
        } catch (error) {
            console.log(error)
        }
        finally{
            runInAction(()=>this.loading = false)
        }
    }

    cancleActivityToggle = async () =>{
        this.loading = true
        try {
            await agent.Activities.attend(this.selectedActivity!.id)
            runInAction(()=>{
                this.selectedActivity!.isCancelled = !this.selectedActivity!.isCancelled
                this.activitiesRegistery.set(this.selectedActivity!.id,this.selectedActivity!)
            })
        } catch (error) {
            console.log(error)
        }
        finally{
            this.setloading(false)
        }
    }
}