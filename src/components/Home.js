import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

import CreateEvent from './create-event.component'

const Home = props => {
  const [user, setUser] = useState(null)
 
  const getUser = async () => {
    const res = await axios.get(
      "http://localhost:4000/users", 
      {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    setUser(res.data)
  }

  useEffect(() => {
    getUser()
  }, [])
  
  if (!localStorage.getItem("token")) {
    props.history.push("/login")
  }
  
  return (
    <div>
      <CreateEvent />
      <p>Welcome {user && user.name}</p>
      <Link to="/logout">Logout</Link>
    </div>
  )
}

export default Home