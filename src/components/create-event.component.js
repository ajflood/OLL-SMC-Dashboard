import React, { Component } from "react";
import { Link } from "react-router-dom"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import DatePicker from 'react-date-picker';

import dates from 'react-big-calendar/lib/utils/dates';

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

export default class CreateRoomRequest extends Component {

  constructor(props) {
    super(props)

    // Setting up functions
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeAttendance = this.onChangeAttendance.bind(this);
    this.onChangeRoom = this.onChangeRoom.bind(this);
    // this.onChangeDate = this.onChangeDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // Setting up state
    this.state = {
      rooms: [],
      name: '',
      room: '',
      attendance: '',
      // date: new Date(),
      events: [],
    }
  }

  OptionList() {
    return this.state.rooms.map((option) => {
      return <option value={option._id}>{option.name}</option>
    })
  }

  GetCalendarEvents(date, view) {
    console.log("Hi from events")
    console.log(date)
    console.log(view)

    let start, end;
    start = moment(date).startOf('month')._d
    end = moment(date).endOf('month')._d

    console.log(start, end)
    // console.log(dates.firstVisibleDay(date), dates.lastVisibleDay(date));

    axios.get('http://localhost:4000/event/find')
      .then(res => {
        console.log(res.data)
        
        var events = res.data.filter(item => item.room === this.state.room).filter(item => item.startTime < start).filter(item => item.endTime > end)
        
        this.setState({
          events: events
        });
      })
      .catch((error) => {
        console.log(error);
      })


  }

  handleCalendarSelect = (event, e) => {
    console.log("done selecting")
    console.log(event)
    const { start, end } = event;
    const data = { title: '', subject: '', start, end, allDay: false };

    if (event.action == "select") {
      console.log("selected")
    }
    // setShowAddModal(true);
    // setShowEditModal(false);
    // setCalendarEvent(data);
  };

  Scheduler() {
    // console.log("hi there")
    // const date = this.state.date.toString()
    // console.log(date)
    const localizer = momentLocalizer(moment)
    // console.log(localizer)
    const DnDCalendar = withDragAndDrop(Calendar);


    return <DnDCalendar
          localizer={localizer}
          selectable={true}
          events={this.state.events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          // defaultDate={ this.defaultDate}
          // selectable={true}
          // resizable={true}
          // onEventDrop={handleDragEvent}
          style={{ height: '70vh' }}
          onSelectSlot={this.handleCalendarSelect}
          onNavigate={this.GetCalendarEvents}
          // onView={this.GetCalendarEvents}
          // onSelectEvent={handleSelectEvent}
          // min={
          //   new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8)
          // }
          // max={
          //   new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23)
          // }
          // messages={{
          //   month: 'mois',
          //   week: 'semaine',
          //   day: 'jour',
          //   today: "aujourd'hui",
          //   next: 'suiv.',
          //   previous: 'préc.',
          // }}
          // resource="Test ressource"
          // views={['month']}
          views={['month', 'week', 'day']}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.isDone === true ? '#ad4ca4' : '#3174ad',
            },
          })}
          />


  }

  onChangeName(e) {
    this.setState({ name: e.target.value })
  }

  onChangeAttendance(e) {
    axios.get('http://localhost:4000/room/find')
      .then(res => {
        this.setState({
          rooms: res.data.filter(item => item.occupancy > this.state.attendance)
        });
      })
      .catch((error) => {
        console.log(error);
      })

    this.setState({ attendance: e.target.value })
  }

  onChangeRoom(e) {
    this.setState({ room: e.target.value })
  }

  // onChangeDate(e) {
  //   this.setState({ date: e })
  // }

  onSubmit(e) {
    e.preventDefault()

    const roomRequestObject = {
      name: this.state.name,
      room: this.state.room,
      attendance: this.state.attendance
    };
    axios.post('http://localhost:4000/room/create-room-request', roomRequestObject)
      .then(res => console.log(res.data));

    this.setState({ name: '', room: '', attendance: '' })
  }

  render() {
    let html
    if (localStorage.getItem("token")) {
      html = <div className="form-wrapper">
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="Name">
          <Form.Label>Event Name</Form.Label>
          <Form.Control type="text" value={this.state.name} onChange={this.onChangeName} />
        </Form.Group>

        <Form.Group controlId="Attendance">
          <Form.Label>Attendance</Form.Label>
          <Form.Control type="text" value={this.state.attendance} onChange={this.onChangeAttendance} />
        </Form.Group>

        <Form.Group controlId="Room">
        <Form.Label>Room</Form.Label>
          <Form.Select id="disabledSelect" onChange={this.onChangeRoom}>
            {this.OptionList()}
          </Form.Select>
        </Form.Group>

        {/* <div>
          Event date 
          <DatePicker calendarType="US" onChange={this.onChangeDate} value={this.state.date} />
        </div> */}

        <div>
          {this.Scheduler()}
        </div>
        
        <Button variant="danger" size="lg" block="block" type="submit" className="mt-4">
          Submit Room Request
        </Button>
      </Form>
    </div>
    } else {
      html = <div>
          <p> Please login</p>
          <Link to="/login">Login</Link>
        </div>
    }
    return (html);
  }
}