import React from "react";
import ReactDOM from "react-dom/client";
import Filteration from "./components/Filteration";
import JobCard from "./components/JobCard";
import JobsRender from "./components/Jobs-render";

const App=()=>{
  return <div>
    
<Filteration/>
<JobsRender/>
  </div>
}
const root=ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>)