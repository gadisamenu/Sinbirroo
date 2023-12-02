import React, { useState } from 'react';
import { Button, Grid, Tab,Image, Header } from 'semantic-ui-react';
import ProfileUpdateForm from './ProfileUpdateForm';
import { useStore } from '../../app/stores/store';
import { Profile } from '../../app/models/profile';
import { observer } from 'mobx-react-lite';

interface Props{
    profile:Profile
}

export default observer(function ProfileAbout({profile}:Props){
    const {profileStore:{isCurrentuser,loading}} = useStore();
    const [editing,setEditing] = useState(false);
    return (
         <Tab.Pane>
         <Grid>
             <Grid.Column width={16}>
                 <Header floated="left" icon="user" content={`About ${profile.displayName}`}/>
                 {isCurrentuser && (
                     <Button floated="right" basic content={editing? "Cancel":"Edit Profile"}
                        onClick={()=>setEditing(!editing)} 
                     />

                 )}
                 
             </Grid.Column>
             <Grid.Column width={16}>
                 {editing ?(
                     <ProfileUpdateForm  profile={profile}/>
                 ):(
                    <span style={{whiteSpace: 'pre-wrap'}}>{profile?.bio}</span>
                 )}
             </Grid.Column>
         </Grid>
     </Tab.Pane>
    )
})