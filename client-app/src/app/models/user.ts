export interface User{
    username:string,
    token:string,
    image?:string
    displayName:string
}

export interface UserFormValues{
    password:string,
    email:string,
    displayName?:string,
    username?:string
}