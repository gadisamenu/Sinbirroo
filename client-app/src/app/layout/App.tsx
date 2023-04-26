import React, {useEffect, useState } from 'react';
import { Container} from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashBoard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  const [activities ,setActivities] = useState<Activity[]>([]);
  const [editMode,setEditMode] = useState(false);
  const [selectedActivity,setSelectedActivity] = useState<Activity| undefined>(undefined)
  const [loading,setLoading] = useState(true);
  const [submitting,setSubmitting] = useState(false);
  function handleSelectActivity(id:string){
      setSelectedActivity(activities.find(x=> x.id === id))
      setEditMode(false)
  }
  function handleCancelSelect(){
      setSelectedActivity(undefined)
  }

  useEffect( ()=>{
    agent.Activities.list().then( response =>{
      response.forEach(activity=>{
        activity.date = activity.date.split("T")[0]
      })
      setActivities(response)
      setLoading(false)
    })
  },[])
  
  function handleOpenForm(id?:string){
    id?handleSelectActivity(id):handleCancelSelect()
    setEditMode(true)
  }
  function handleCloseForm(){
    setEditMode(false)
  }
  function handleEditOrCreate(activity:Activity){
    setSubmitting(true)
    if (activity.id){
      agent.Activities.update(activity).then(()=>{
        setActivities([...activities.filter(x=>x.id !== activity.id),activity])
        setSelectedActivity(activity)
        setSubmitting(false)
        setEditMode(false)
      })
      
    }
    else{
      activity.id = uuid();
      agent.Activities.create(activity).then(()=>{
        setActivities([...activities,activity])
        setSelectedActivity(activity)
        setSubmitting(false)
        setEditMode(false)
      })
    }
  }

  function handleDeleteActivity(id:string){
    setSubmitting(true)
    agent.Activities.delete(id).then(()=>{
      setActivities([...activities.filter(x => x.id !== id)])
      setSubmitting(false)
    })
  }

  if (loading) return <LoadingComponent content={'Loading App'} />
  return (
    < >
        <NavBar openForm={handleOpenForm}/>
        <Container style={{marginTop:'7em'}}>
       <ActivityDashboard 
        activities={activities} 
        selectedActivity={selectedActivity} 
        handleCancelSelect={handleCancelSelect} 
        handleSelectActivity={handleSelectActivity}
        editMode={editMode}
        openForm={handleOpenForm}
        closeForm={handleCloseForm}
        createOrEdit={handleEditOrCreate}
        deleteActivity={handleDeleteActivity}
        submitting={submitting}
       />
        </Container>

    </>
  );
}

export default App;   
