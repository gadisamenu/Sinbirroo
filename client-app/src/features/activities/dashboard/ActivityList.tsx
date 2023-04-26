import React, { SyntheticEvent, useState } from 'react';
import { Activity } from '../../../app/models/activity';
import { Button, Item, Label, Segment } from 'semantic-ui-react';

interface Props{
    activities:Activity[]
    handleSelectActivity:(id:string)=>void
    deleteActivity:(id:string)=>void
    submitting:boolean
}
export default function ActivityList({activities,handleSelectActivity,deleteActivity,submitting}:Props){
    const [target,setTarget] = useState("");
    function handleDeleteActivity(event:SyntheticEvent<HTMLButtonElement>,id:string){
        setTarget(event.currentTarget.name);
        deleteActivity(id);
    }
    return (
        <Segment>
            <Item.Group divided>
                {
                    activities.map(activity=>(
                        <Item key={activity.id}>
                            <Item.Content>
                                <Item.Header>{activity.title}</Item.Header>
                                <Item.Meta>{activity.date}</Item.Meta>
                                <Item.Description>
                                    <div>
                                        {activity.description}
                                    </div>
                                    <div>
                                        {activity.city},{activity.venue}
                                    </div>
                                </Item.Description>
                                <Item.Extra>
                                    <Button   onClick={()=>handleSelectActivity(activity.id)} floated='right' content='View' color='blue'/>
                                    <Button
                                     name={activity.id}
                                     loading={submitting && target==activity.id} negative onClick={(e)=>handleDeleteActivity(e,activity.id)} floated='right' content='Delete' />
                                    <Label basic content={activity.category} />
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    ))
                }
            </Item.Group>
        </Segment>
    )
}