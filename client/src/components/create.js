import React, { useState } from "react";
import { useNavigate } from "react-router";

import "../views/css/main.css";
 
export default function Create() {
 const [form, setForm] = useState({
   date: "",
   day: "",
   status: "",
 });
 const navigate = useNavigate();
 
 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
 
 // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();
 
   // When a post request is sent to the create url, we'll add a new record to the database.
   const newDaily = { ...form };
 
   await fetch("http://localhost:5000/record/add", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newDaily),
   })
   .catch(error => {
     window.alert(error);
     return;
   });
 
   setForm({ date: "", day: "", status: "" });
   navigate("/");
 }

 const goBack = () => {
  navigate('/');
  };
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3>Create New Record</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="date">Date</label>
         <input
           type="text"
           className="form-control"
           id="date"
           value={form.date}
           onChange={(e) => updateForm({ date: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="day">Day</label>
         <input
           type="text"
           className="form-control"
           id="day"
           value={form.day}
           onChange={(e) => updateForm({ day: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="status">Status</label>
         <input
           type="text"
           className="form-control"
           id="status"
           value={form.status}
           onChange={(e) => updateForm({ status: e.target.value })}
         />
       </div>
       
       <div className="form-group">
         <input
           type="submit"
           value="Add"
           className="btn btn-dark"
         />
       </div>

       <div className="form-group">
         <input
           type="button"
           value="Back"
           className="btn btn-secondary"
           onClick={goBack}
         />
       </div>
     </form>
   </div>
 );
}