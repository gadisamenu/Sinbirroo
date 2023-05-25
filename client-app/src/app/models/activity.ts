import { Profile } from "./profile";

export interface Activity{
    id: string,
    title: string,
    date: Date| null,
    description: string,
    category:string,
    city:string,
    venue:string,
    hostUsername?:string,
    isCancelled?:boolean,
    isGoing?:boolean,
    isHost?:boolean,
    host?:Profile,
    attendees?:Profile[]
}

export class Activity implements Activity{
    constructor(init?:ActivityFormValue){
        Object.assign(this,init)
    }
}


export class ActivityFormValue {
    id?: string = '';
    title: string = '';
    date: Date| null= null;
    description: string = '';
    category:string = '';
    city:string = '';
    venue:string = '';
    constructor(activity?:Activity){
        if (activity){
            this.id = activity.id;
            this.title = activity.title;
            this.date = activity.date;
            this.description = activity.description;
            this.category = activity.category
            this.venue = activity.venue;
        }
    }
}