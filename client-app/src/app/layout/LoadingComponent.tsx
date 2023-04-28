import { observer } from 'mobx-react-lite';
import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

interface Props{
    inverted?:boolean;
    content?:string;
}

export default observer(function LoadingComponent({inverted=true,content='loading...'}:Props){
    return (
        <Dimmer active={true} inverted={inverted}>
            <Loader content={content} />
        </Dimmer>
    )
})