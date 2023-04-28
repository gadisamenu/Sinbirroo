import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Container, Menu } from "semantic-ui-react";
import { useStore } from "../stores/store";
import { NavLink } from "react-router-dom";

export default observer(function NavBar()
{
    return (
        <Menu inverted fixed="top">
            <Container>
            <Menu.Item as={NavLink} to="/" header>
                <img src="/assets/logo.png" alt="logo" style={{marginRight:"10px"}} />
                Sinbirroo
            </Menu.Item>
            <Menu.Item as={NavLink} to="/activities" name="Activities" />

            <Menu.Item as={NavLink} to="/createactivity">
                <Button positive content='Create Activity'/>
            </Menu.Item>
            </Container>
        </Menu>
    )
})