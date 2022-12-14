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
        "link": "/admin/showings"
    },
    {
        "text": "Reservations",
        "link": "/admin/reservations"
    },
    {
        "text": "Users",
        "link": "/admin/users"
    }
]


const AdminBase = (props) => {

    return (
        <div>
            <SubNavBar pages={Pages}/>
            <Page>
            {props.children}
            </Page>
        </div>
    )
}

export default AdminBase