import React from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import NB from "./components/navbar";
import WorkoutCalendar from "./components/workoutCalendar";
import Edit from "./components/edit";
import Create from "./components/create";
import Settings from "./components/settings";
import Header from "./components/header";
import Progress from "./components/progress";
import Daily from "./components/daily";
import Delete from "./components/deleteall";
import Todo from "./components/dev/todo";
import GetLifts from "./components/lift/list";
import AddLift from "./components/lift/create";
import Populate from "./components/dev/pop_db";
import UserList from "./components/user/list";

const App = () => {
    return (
		<div className="page">
			<NB />

			<Header />
			<div className="page-content">
				<Routes>
					<Route exact path="/" element={<WorkoutCalendar />} />
					<Route path="/edit/:id" element={<Edit />} />
					<Route path="/record/create" element={<Create />} />
					<Route path="/settings" element={<Settings />} />
					<Route path="/progress" element={<Progress />} />
					<Route path="/record/:date" element={<Daily />} />
					<Route path="/deleteall" element={<Delete />} />
					<Route path="/dev/todo" element={<Todo />} />

					<Route path="/lift/" element={<GetLifts />} />
					<Route path="/lift/add" element={<AddLift />} />

					<Route path="/program/populate" element={<Populate />} />

					<Route path="/user" element={<UserList />} />



				</Routes>
			</div>
		</div>
    );
};

export default App;
