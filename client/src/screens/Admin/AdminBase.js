import React from 'react';

import Page from '../../components/Page'
import SubNavBar from '../../components/SubNavBar'

const Pages = [
    {
        "text": "Theater Info",
        "link": "/admin/theater-info"
    },
    {
        "text": "Showings",
        "link": "/admin/showings",
        "id": "showings-nav"
    },
    {
        "text": "Reservations",
        "link": "/admin/reservations"
    },
    {
        "text": "Users",
        "link": "/admin/users",
        "id": "users-nav"
    },
    {
        "text": "Notifications",
        "link": "/admin/notifications",
        "id": "notifications-nav"
    }
]


const AdminBase = (props) => {

    return (
        <div id="admin-container">
            <SubNavBar pages={Pages}/>
            <Page>
            {props.children}
            </Page>
        </div>
    )
}

export default AdminBase