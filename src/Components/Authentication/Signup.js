import {React,useState} from 'react'
import { TextField,Box,Button } from '@mui/material';
import { auth } from '../../firebase';
import {createUserWithEmailAndPassword} from '@firebase/auth';

const Signup = ({handleClose}) => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const[confirmPassword,setConfirmPassword] = useState("");

    const handleSubmit = async() => {
       if(password!=confirmPassword) {
        alert("Passwords do not match");
    }
    try{
        const result = await createUserWithEmailAndPassword(auth, email,password);
        alert(`Sign up successfull. Welcome ${result.user.email}`);

        handleClose();
    }
    catch(error){
        alert(error.message);
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
    <TextField
    variant="outlined"
    type="password"
    label="Confirm password"
    value={confirmPassword}
    onChange={(e)=>setConfirmPassword(e.target.value)}
    fullWidth={true}
    />
    <Button variant="contained"
    size='large'
    sx={{ backgroundColor: 'gold', color: 'black' }}
    onClick={handleSubmit}
    >Signup</Button>

   </Box>
  )
}

export default Signup;
