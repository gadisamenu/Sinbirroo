import React, { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props{
    closeForm:()=>void
    selectedActivity:Activity | undefined
    createOrEdit:(activity:Activity)=>void
    submitting:boolean
}
export default function ActivityForm({closeForm, selectedActivity,createOrEdit,submitting}:Props){
    let initialState = selectedActivity??{
                id:"",
                title:"",
                description:"",
                category:"",
                city:"",
                date:"",
                venue:""
            }
    const [activity,setActivity] = useState(initialState);
    function handleSubmit(){
        createOrEdit(activity)
    }
    function handleOnChange(event:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>){
        const {name,value} = event.target;
        setActivity({...activity,[name]:value})
    }


    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input placeholder='Title' name='title' value={activity.title} onChange={handleOnChange}/>
                <Form.TextArea placeholder='Description' name='description' value={activity.description} onChange={handleOnChange}/>
                <Form.Input placeholder='Category' name='category' value={activity.category} onChange={handleOnChange}/>
                <Form.Input placeholder='Date' type='date' name='date' value={activity.date} onChange={handleOnChange}/>
                <Form.Input placeholder='City' name='city' value={activity.city} onChange={handleOnChange}/>
                <Form.Input placeholder='Venue' name='venue' value={activity.venue} onChange={handleOnChange}/>
                <Button loading={submitting} floated='right' positive type='submit' content='Submit' />
                <Button floated='right' onClick={closeForm} type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}