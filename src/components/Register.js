import React, { useState, Component } from "react"
import { Link } from "react-router-dom"

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const bcrypt = require("bcryptjs")


export default class Register extends Component {

	constructor(props) {
	  super(props)
  
	  // Setting up functions
	  this.onChangeName = this.onChangeName.bind(this);
	  this.onChangeEmail = this.onChangeEmail.bind(this);
	  this.onChangePassword = this.onChangePassword.bind(this);
	  this.onSubmit = this.onSubmit.bind(this);
  
	  // Setting up state
	  this.state = {
		name: '',
		email: '',
		password: ''
	  }
	}
  
	onChangeName(e) {
	  this.setState({ name: e.target.value })
	}
  
	onChangeEmail(e) {
	  this.setState({ email: e.target.value })
	}
  
	onChangePassword(e) {
	  this.setState({ password: e.target.value })
	}
  
	async onSubmit(e) {
		e.preventDefault()
		try {
			var res = await axios.post('http://localhost:4000/users/register', this.state)

			this.setState({ name: '', email: '', password: '' })
			this.props.history.push("/login")

		} catch (err) {
			console.log(err)
		}
	}

	render() {
	  return (
	  <div className="form-wrapper">
		<h4>Register</h4>
		<Form onSubmit={this.onSubmit}>
		  <Form.Group controlId="Name">
			<Form.Label>Name</Form.Label>
			<Form.Control type="text" value={this.state.name} onChange={this.onChangeName} />
		  </Form.Group>
  
		  <Form.Group controlId="Email">
			<Form.Label>Email</Form.Label>
			<Form.Control type="email" value={this.state.email} onChange={this.onChangeEmail} />
		  </Form.Group>
  
		  <Form.Group controlId="Password">
			<Form.Label>Password</Form.Label>
			<Form.Control type="text" value={this.state.password} onChange={this.onChangePassword} />
		  </Form.Group>
  
		  <Button variant="danger" size="lg" block="block" type="submit" className="mt-4">
			Register
		  </Button>
		  </Form>
		<p>
			Already a user? <Link to="/login">Login</Link>
		</p>
	  </div>
	  );
	}
  }