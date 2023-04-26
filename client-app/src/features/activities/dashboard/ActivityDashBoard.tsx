import React from "react";
import {Activity} from "../../../app/models/activity"
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface Props {
    activities:Activity[];
    selectedActivity:Activity|undefined
    handleSelectActivity:(id:string)=>void;
    handleCancelSelect:()=>void;
    editMode:boolean,
    openForm:(id:string)=>void
    closeForm:()=>void
    createOrEdit:(activity:Activity)=>void
    deleteActivity:(id:string)=>void
    submitting:boolean
}

export default function ActivityDashboard(
    {   activities,
        selectedActivity,
        handleCancelSelect,
        handleSelectActivity,
        editMode,
        openForm,
        closeForm,
        createOrEdit,
        deleteActivity,
        submitting
    }:Props){
    return (
        <Grid>

        <Grid.Column width='10'>
        
            <ActivityList activities={activities} handleSelectActivity={handleSelectActivity} deleteActivity={deleteActivity} submitting={submitting}/>
        
        </Grid.Column>
        <Grid.Column width='6'>
            {!editMode && selectedActivity &&  <ActivityDetails activity={selectedActivity}  handleCancelSelect={handleCancelSelect} openForm={openForm}/>}
            {editMode && <ActivityForm submitting={submitting} closeForm={closeForm} selectedActivity={selectedActivity} createOrEdit={createOrEdit}/>}
        </Grid.Column>
        </Grid>
    
    )
}