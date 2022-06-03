import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Button from 'react-bootstrap/Button'

export default class RoomTableRow extends Component {
  constructor(props) {
    super(props)
    this.deleteRoom = this.deleteRoom.bind(this)
  }

  deleteRoom() {
    axios
      .delete(
        'http://localhost:4000/room/delete-room/' + this.props.obj._id,
      )
      .then((res) => {
        console.log('Room successfully deleted!')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    return (
      <tr>
        <td>{this.props.obj.name}</td>
        <td>{this.props.obj.building}</td>
        <td>{this.props.obj.occupancy}</td>
        <td>
          <Link
            className="edit-link" path={"room/:id"}
            to={'/edit-room/' + this.props.obj._id}
          >
            Edit
          </Link>
          <Button onClick={this.deleteRoom} size="sm" variant="danger">
            Delete
          </Button>
        </td>
      </tr>
    )
  }
}
