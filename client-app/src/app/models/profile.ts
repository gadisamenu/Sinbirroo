import { User } from "./user"

export  interface Profile{
    username:string,
    displayName:string,
    image?:string
    bio?:string
    photos:Photo[]
}

export class Profile implements Profile{

    constructor(user:User) {
        Object.assign(this,user)
    }
}

export interface Photo{
    id:string;
    url:string;
    isMain:boolean;
}

export class ProfileFormValue {
    displayName:string = '';
    bio?:string = undefined;


    constructor(profile?:{bio?:string,displayName:string}){
        if (profile){
            this.bio = profile.bio;
            this.displayName = profile.displayName;
        }
    }
}