import React, { useEffect, useState } from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
import { useCookies } from 'react-cookie';

// We import all the components we need in our app
import NB from "./components/navbar";
import WorkoutCalendar from "./components/workoutCalendar";
import Edit from "./components/edit";
import Create from "./components/create";
import Settings from "./components/settings";
import Header from "./components/header";
import Progress from "./components/progress";
import DayInfo from "./components/dayInfoPage";
import Delete from "./components/deleteall";
import Todo from "./components/dev/todo";
import GetProgram from "./components/lift/programPage";
import AddLift from "./components/lift/create";
import Populate from "./components/dev/pop_db";
import PopulateColorThemes from "./components/dev/pop_colors";
import UserList from "./components/user/list";
import UserLogin from "./components/user/login";
import Rec from "./components/rec";

const App = () => {
	const [cookies, setCookie] = useCookies(['theme'])
	const [loading, setLoading] = useState(true)
	
	useEffect(() => {
		setCookie('ColorTheme', cookies.ColorTheme ?? 'Ender', {path:'/'})
		setLoading(false)
	},[])


	const [username, setUsername] = useState(''); 

	if (loading) {
		return (
			<div className="page" style={{backgroundColor:'grey'}}></div>
		)
	}
	else {
		return (
			<div className="page" data-theme={cookies.ColorTheme??'Ender'}>
				{/* navbar */}
				<NB />
	
				{/* header */}
				<Header username={username}/>
	
				{/* content */}
				<div className="page-content-area">
					<Routes>
						<Route exact path="/" element={<WorkoutCalendar />} />
						<Route path="/edit/:id" element={<Edit />} />
						<Route path="/record/create" element={<Create />} />
						<Route path="/settings" element={<Settings />} />
						{/* <Route path="/progress" element={<Progress />} /> */}
						<Route path="/record/:date" element={<DayInfo />} />
						<Route path="/deleteall" element={<Delete />} />
						<Route path="/dev/todo" element={<Todo />} />
	
						<Route path="/program" element={<GetProgram />} />
						<Route path="/lift/add" element={<AddLift />} />
	
						<Route path="/program/populate" element={<Populate />} />
	
						<Route path="/user" element={<UserList />} />
						<Route path="/user/login" element={<UserLogin headerUsername={username}/>} />
	
						<Route path="/color/populate" element={<PopulateColorThemes />} />
	
						<Route path="/record" element={<Rec />} />
	
					</Routes>
				</div>
			</div>
		);
	}
    
};

export default App;
