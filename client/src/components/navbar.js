import React from "react";
// import { Route, Routes, useLocation } from "react-router-dom";
import { Nav, Navbar } from 'react-bootstrap';

import "../views/css/main.css";

export default function NB(props) {
  return (
    // <Navbar className="bg-dark navbar-dark flex-column" bg="dark" expand="lg">
    //   <Nav activeKey="/">
	// 	  <Nav.Link href="/">Home</Nav.Link>
	// 	  <Nav.Link href="/progress">Progress</Nav.Link>
	// 	  <Nav.Link href="/settings">Settings</Nav.Link>

	//   </Nav>
    // </Navbar>

	<nav className="nav flex-column nav-col">
		<a className="nav-link active" href="/">Home</a>
		<hr />
		<a className="nav-link" href="/progress">Progress</a>
		<hr />
		<a className="nav-link" href="/settings">Settings</a>
		<hr />
		<a className="nav-link" href="/lift">Lift Catalogue</a>
		<hr />
		<a className="nav-link" href="/dev/todo">(dev) To Do</a>
	</nav>
  );
}
