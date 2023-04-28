import React, { SyntheticEvent, useState } from 'react';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

export default observer( function ActivityList(){
    const {activityStore} = useStore()
    
    const {activitiesByDate,deleteActivity,loading} = activityStore

    const [target,setTarget] = useState("");    

    function handleDeleteActivity(event:SyntheticEvent<HTMLButtonElement>,id:string){
        setTarget(event.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {
                activitiesByDate.map(activity=>(
                        <Item key={activity.id}>
                            <Item.Content>
                                <Item.Header>{activity.title}</Item.Header>
                                <Item.Meta>{activity.date}</Item.Meta>
                                <Item.Description>
                                    <div>
                                        {activity.description}
                                    </div>
                                </Item.Description>
                                <Item.Extra>
                                    <Button  as={Link} to={`/activities/${activity.id}`} floated='right' content='View' color='blue'/>
                                    <Button
                                     name={activity.id}
                                     loading={loading && target === activity.id} negative onClick={(e)=>handleDeleteActivity(e,activity.id)} floated='right' content='Delete' />
                                    <Label basic content={activity.category} />
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    ))
                }
            </Item.Group>
        </Segment>
    )
})