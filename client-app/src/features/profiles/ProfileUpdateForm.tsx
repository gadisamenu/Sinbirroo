import { Profile, ProfileFormValue } from '../../app/models/profile';
import { Form, Formik } from 'formik';
import MyTextInput from '../../app/common/form/MyTextInput';
import { Button } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import MyTextArea from '../../app/common/form/MyTextArea';
import * as Yup from 'yup'

interface Props{
    profile:Profile
}

export default function ProfileUpdateForm({profile}:Props){
    const {profileStore} = useStore()
    const {updateProfile,loading} = profileStore

    const validationSchema = Yup.object({
        displayName: Yup.string().required("displayName is a required field"),
        bio: Yup.string().nullable(),
    })


    function handleFormSubmit(profile:ProfileFormValue){
        updateProfile(profile)
    }
   
    return (
            <Formik
            validationSchema={validationSchema}
             enableReinitialize 
            initialValues={profile} 
            onSubmit={values => handleFormSubmit(values)}>
                {({handleSubmit,isValid,isSubmitting, dirty,touched})=>
                (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name='displayName' placeholder='Display Name' />
                        <MyTextArea rows={3} placeholder='Add you bio' name='bio'/>                    
                        <Button 
                            disabled={isSubmitting ||!dirty ||!touched ||  !isValid}
                            loading={isSubmitting && loading} floated='right' positive type='submit' content='Update Profile' 
                        />
                     </Form>
                )}

            </Formik>
            
    )
}

