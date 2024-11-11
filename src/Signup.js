import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie"
import img2 from "./img2.jpg"
import "./Signup.css"

const Signup=()=>{

    const [username,setusername]=useState("");
    const [pwd,setpwd]=useState("")
    const [res,setres]=useState("")
    const navigate=useNavigate()

    const usernamefunc=(e)=>{
        setusername(e.target.value)
    }

    const pwdfunc=(e)=>{
        setpwd(e.target.value)
        const regexPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const res= regexPattern.test(pwd);
    }

    const handlesubmit=(event)=>{
        event.preventDefault();
        const regexPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const res= regexPattern.test(pwd);
        if(pwd.length>0 && username.length>0){
            Cookies.set("result","success")
            navigate("/users")
        }
        else{
            setres("*Inputs should not be empty")
        }
        localStorage.setItem("username",username)
        localStorage.setItem("pwd",pwd)
    }

    return(
    <div className="bg">
        <form className="form">
            <div className="inner-form">
                <h1>Signup Form</h1>
                <label>User Name</label>
                <br />
                <input type="text" onChange={usernamefunc} />
                <br />
                <label>Password</label>
                <br />
                <input type="password" onChange={pwdfunc} />
                <br />
                <div className='btn'>
                <button type="submit" onClick={handlesubmit}>Submit</button>
                </div>
                <p>Existing User?<Link to="/" className="signup">Login</Link></p>
            </div>
            <img src={img2} alt="no-data" className='l-image'/>
        </form>  
    </div>   
)
}
 
export default Signup