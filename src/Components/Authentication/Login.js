import React from 'react';
import {signInWithEmailAndPassword} from '@firebase/auth';
import { TextField,Box,Button } from '@mui/material';
import {useState} from 'react';
import { auth } from '../../firebase';
const Login = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const handleSubmit = async() => {
        if(!email || !password){
           alert("Please enter all the fields");
           return;
        }
        try{
            const result = await signInWithEmailAndPassword(auth,email, password);
            alert(`login successfull. Welcome ${result.user.email}`)
        }catch(e){
            alert(e.message);
            return;
        }
       
    }
  return (
    <Box p={3}
    style={{display:"flex",flexDirection:"column",gap:"20px"}}
    >
     <TextField
     variant="outlined"
     type="email"
     label="Enter email"
     value={email}
     onChange={(e)=>setEmail(e.target.value)}
     fullWidth={true}
     />
     <TextField
     variant="outlined"
     type="password"
     label="Enter password"
     value={password}
     onChange={(e)=>setPassword(e.target.value)}
     fullWidth={true}
     />
    
     <Button variant="contained"
      size='large'
      sx={{ backgroundColor: 'gold', color: 'black' }}
       onClick={handleSubmit}

        >Login</Button>
    </Box>
  )
}

export default Login
