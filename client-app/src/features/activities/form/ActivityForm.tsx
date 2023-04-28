import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { v4 as uuid } from 'uuid';

export default observer(function ActivityForm(){
    const {activityStore} = useStore()
    const {createActivity,updateActivity,selectedActivity,loading,loadActivity,loadingInitial} = activityStore
    const {id} = useParams()
    const navigate = useNavigate()
    const [activity,setActivity] = useState({
        id:"",
                title:"",
                description:"",
                category:"",
                city:"",
                date:"",
                venue:""
    })
    useEffect(()=>{
        if (id) loadActivity(id).then(activity =>setActivity(activity!))
    },[id,loadActivity])

    function handleSubmit(){
        if (!activity.id){
            activity.id = uuid()
            createActivity(activity).then(()=> navigate(`/activities/${activity.id}`))
        }
        else{
            updateActivity(activity).then(()=>navigate(`/activities/${activity.id}`))

        }
    }

    function handleOnChange(event:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>){
        const {name,value} = event.target;
        setActivity({...activity,[name]:value})
    }
    if (loadingInitial) return <LoadingComponent content='Loading activity ...' />
    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input placeholder='Title' name='title' value={activity.title} onChange={handleOnChange}/>
                <Form.TextArea placeholder='Description' name='description' value={activity.description} onChange={handleOnChange}/>
                <Form.Input placeholder='Category' name='category' value={activity.category} onChange={handleOnChange}/>
                <Form.Input placeholder='Date' type='date' name='date' value={activity.date} onChange={handleOnChange}/>
                <Form.Input placeholder='City' name='city' value={activity.city} onChange={handleOnChange}/>
                <Form.Input placeholder='Venue' name='venue' value={activity.venue} onChange={handleOnChange}/>
                <Button loading={loading} floated='right' positive type='submit' content='Submit' />
                <Button as={Link} to="/activities" floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
})