import {  makeAutoObservable, runInAction } from "mobx"
import { Activity } from "../models/activity";
import agent from "../api/agent";
import {format} from 'date-fns'

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

    addActivity = (activity:Activity) =>{
        activity.date = new Date(activity.date!)
        this.activitiesRegistery.set(activity.id,activity)
    }
    
    setSelectedActivity = (activity:Activity) => this.selectedActivity = activity
    setEditMode = (value:boolean) => this.editMode = value
    setloading = (value:boolean) => this.loading = value
    setLoadingInitial = (value:boolean) => this.loadingInitial = value

    createActivity = async (activity:Activity) => {
        this.setloading(true)
        try{
            await agent.Activities.create(activity);
            runInAction(()=>{
                this.activitiesRegistery.set(activity.id,activity)
                this.setSelectedActivity(activity)
            })
            this.setloading(false)
            this.setEditMode(false)
        }catch(error){
            console.log(error)
            this.setloading(false)
        }
    }

    updateActivity = async (activity:Activity)=>{
        this.setloading(true)
        try {
            await agent.Activities.update(activity);
            runInAction(()=>{
                this.activitiesRegistery.set(activity.id,activity)
            })
            this.setSelectedActivity(activity)
            this.setloading(false)
            this.setEditMode(false)
        } catch (error) {
            console.log(error)
            this.setloading(false)
            this.setEditMode(false)
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
}