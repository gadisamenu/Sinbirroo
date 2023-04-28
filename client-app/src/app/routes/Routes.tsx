import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import ActivityDashBoard from "../../features/activities/dashboard/ActivityDashBoard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import HomePage from "../../features/homePage/homePage";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
const routes:RouteObject[]= [
    {
        path:"/",
        element:<App/>,
        children:[
            {path:"activities",element:<ActivityDashBoard/>},
            {path:"activities/:id",element:<ActivityDetails />},
            {path:"createActivity",element:<ActivityForm key='create'/>},
            {path:"manage/:id",element:<ActivityForm key='manage'/>}
        ]
    }

]
export const router = createBrowserRouter(routes)