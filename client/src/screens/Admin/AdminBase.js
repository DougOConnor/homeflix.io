import React from 'react';

import Page from '../../components/Page'
import SubNavBar from '../../components/SubNavBar'

const Pages = [
    {
        "text": "Theater Info",
        "link": "/admin/theater-info",
        "id": "theater-info-nav"
    },
    {
        "text": "Showings",
        "link": "/admin/showings",
        "id": "showings-nav"
    },
    {
        "text": "Reservations",
        "link": "/admin/reservations",
        "id": "reservations-nav"
    },
    {
        "text": "Users",
        "link": "/admin/users",
        "id": "users-nav"
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