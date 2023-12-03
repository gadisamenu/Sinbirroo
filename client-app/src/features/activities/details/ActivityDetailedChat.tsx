import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Header, Comment, Segment, Loader} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../../app/stores/store'
import { Formik, Form, Field, FieldProps} from 'formik'
import * as Yup from 'yup';
import { formatDistanceToNow } from 'date-fns'

interface Props{
    activityId:string
}

export default observer(function ActivityDetailedChat({activityId}:Props) {
    var {commentStore} = useStore();
    
    useEffect(()=>{
        if(activityId){
            commentStore.createHubConnection(activityId)
        }
        return ()=>{
            commentStore.createComments()
        }
    },[commentStore,activityId])

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{border: 'none'}}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Formik 
                    onSubmit={(values,{resetForm})=>commentStore.addComment(values).then(()=>resetForm())}
                    initialValues={{ body:'' }}
                    validationSchema={ Yup.object({
                        body:Yup.string().required()
                    })}
                >
                    {({isSubmitting,isValid,handleSubmit})=>(
                        <Form className='ui form'>
                            <Field name="body">
                                {(props:FieldProps)=>(
                                    <div style={{position:"relative"}}>
                                        <Loader active={isSubmitting} />
                                        <textarea
                                            placeholder="Enter Comment(Enter to submit, SHIFT + Enter for new line)"
                                            rows={2}
                                            {...props.field}
                                            onKeyPress={e=>{
                                                if (e.key === "Enter"){
                                                    if (e.shiftKey)return;
                                                    if (isValid){e.preventDefault(); handleSubmit()}
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </Field>
                        </Form>
                    )}
                </Formik>
                <Comment.Group>
                    {
                        Array.isArray(commentStore.comments) ? (
                            commentStore.comments.map(comment => (
                                <Comment key={comment.id}>
                                    <Comment.Avatar src={comment.image || '/assets/user.png'} />
                                    <Comment.Content>
                                        <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                                            {comment.displayName}
                                        </Comment.Author>
                                        <Comment.Metadata>
                                            <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                                        </Comment.Metadata>
                                        <Comment.Text>{comment.body}</Comment.Text>
                                    </Comment.Content>
                                </Comment>
                            ))
                        ) 
                        : (
                            <div>No comments available</div>
                        )
                    }                    
                </Comment.Group>
            </Segment>
        </>

    )
})