import { observer } from "mobx-react-lite";
import { Button, Card, Grid, Header, Image, Tab } from "semantic-ui-react";
import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import { SyntheticEvent, useState } from "react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";


interface Props{
    profile:Profile;
}

export default observer(function ProfilePhotos({profile}:Props){
    const {profileStore:{isCurrentuser,uploadPhoto,uploading,setMainPhoto,deletePhoto,loading}} = useStore();
    const [addPhotoMode,setAddPhotoMode] = useState(false);
    const [target,setTarget] = useState('');
    function handlePhotoUpload(file:Blob){
        uploadPhoto(file).then(()=>{
            setAddPhotoMode(false);
        })
    }

    function handleSetMainPhoto(photo:Photo,e:SyntheticEvent<HTMLButtonElement>){
        setMainPhoto(photo);
        setTarget(e.currentTarget.name);
    }

    function handleDeletePhoto(photo:Photo,e:SyntheticEvent<HTMLButtonElement>){
        deletePhoto(photo);
        setTarget(e.currentTarget.name);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon="image" content="Photos" />
                    {isCurrentuser && (
                        <Button floated="right" basic content={addPhotoMode? "Cancel":"Add"}
                        onClick={()=>setAddPhotoMode(!addPhotoMode)} 
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ?(
                        // <p>photo widget</p>
                        <PhotoUploadWidget  uploadPhoto={handlePhotoUpload} loading={uploading}/>
                    ):(
                         <Card.Group itemsPerRow={5}>
                            {profile.photos.map(photo=>(
                                <Card key={photo.id}>
                                    <Image src={photo.url} />
                                    {isCurrentuser && (
                                        <Button.Group fluid widths={2}>
                                            <Button 
                                               name={"main" + photo.id} 
                                               positive
                                               onClick={(e)=>handleSetMainPhoto(photo,e)} 
                                               loading={target == "main"+photo.id && loading} 
                                               disabled={photo.isMain} 
                                               basic                
                                               content='Main'
                                            />
                                            <Button 
                                                name={photo.id} 
                                                negative
                                                disabled={photo.isMain} 
                                                onClick={(e)=>handleDeletePhoto(photo,e)} 
                                                loading={target == photo.id && loading} 
                                                basic  
                                                icon='trash'
                                            />
                                        </Button.Group>
                                    )}
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})