import React, { useState, useEffect } from "react";
import '../css/header/index.css';
import { EnvelopeSimple, LockKey,User,DeviceMobile } from 'phosphor-react'

export default function Header(props) {
    const [loginmodal, setModal] = useState(false);
    const [signupmodal, setsignupModal] = useState(false);
    const [auth, setAuth] = useState();

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')


    const [signupName, setSignupName] = useState('')
    const [signupEmail, setSignupEmail] = useState('')
    const [signupMobile, setSignupMobile] = useState('')
    const [signupPassword, setSignupPassword] = useState('')
    const [signupError, setSignupError] = useState('')



    const toggleModal = () => {
        setModal(!loginmodal);
    };

    if (loginmodal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }


    const toggleModal1 = () => {
        setsignupModal(!signupmodal);
    };

    const alreadyhaveaccount = () => {
        setsignupModal(false)
        setModal(true)
    }



    const handleLogin = () => {
        setError('')
        setSuccess('')
        console.log(loginEmail);
        if (!loginEmail) {
            setError("Email Required")
        } else if (!loginPassword) {
            setError("Password Required")
        } else {
            fetch('http://localhost:5000/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: loginEmail, password: loginPassword })
            }).then(res => res.json()).then(
                async data => {
                    console.log(data);
                    if (data.success == false) {
                        setError(data.message);
                    } else if (data.success == true) {
                        console.log(data, data.token);
                        localStorage.setItem("FeedbackCurrentUser", JSON.stringify(data));
                        window.location.replace("/");
                    }
                }
            )
        }
    }


    const handleSignup = () => {
        setSignupError('')
        setSuccess('')
        console.log(loginEmail);
        if (!signupName) {
            setSignupError("Name Required")
        } else if (!signupEmail) {
            setSignupError("Email Required")
        } else if (!signupMobile) {
            setSignupError("Phone NO. Required")
        } else if (signupMobile.length != 10) {
            setSignupError("Enter Valid Phone no")
        } else if (!signupPassword) {
            setSignupError("Password Required")
        } else {
            fetch('http://localhost:5000/v1/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: signupName, email: signupEmail, phone: signupMobile, password: signupEmail })
            }).then(res => res.json()).then(
                async data => {
                    console.log(data);
                    if (data.success == false) {
                        setSignupError(data.message);
                    } else if (data.success == true) {
                        alert("done")
                        console.log(data, data.token);
                        setsignupModal(false)
                        setModal(true)
                    }
                }
            )
        }
    }

    const logout = () => {
        localStorage.clear("FeedbackCurrentUser");
        window.location.replace("/");
    }
    console.log(props.login, "from test");


    useEffect(() => {
        console.log(props.login, "from");
        const Auth = JSON.parse(localStorage.getItem("FeedbackCurrentUser"))
        if (Auth) {
            setAuth(Auth.data)
        }
    }, [])
    return (
        <>
            <div className="Header">
                <p>Feedback</p>
                <div className="loginsignup">
                    {
                        auth ? <><p style={{ marginRight: 10, cursor: 'pointer' }} onClick={logout}>Log out</p><p>{auth.name}</p> </> : <> <p className="login" onClick={toggleModal}>Login</p>
                            <p className="signup" onClick={toggleModal1}>Signup</p></>
                    }

                </div>
            </div>

            {
                loginmodal && (
                    <div className="modal">
                        <div onClick={toggleModal} className="overlay"></div>

                        <div className="modal-content">
                            <div className="firstpartofmodal">
                                {error && <p style={{ color: 'red' }}>{error}</p>}

                                <p style={{ fontSize: 22, fontWeight: '700', marginBottom: 5 }}>Login to continue</p>
                                {/* <form> */}

                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                                    <span style={{ top: 18, textAlign: 'center', position: 'absolute', marginRight: 10 }}><EnvelopeSimple size={30} /></span>
                                    <input type="text" name="name" placeholder="Email" className="imputfild" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={{ marginLeft: 35 }} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                                    <span style={{ top: 18, textAlign: 'center', position: 'absolute', marginRight: 20 }}><LockKey size={30} /></span>
                                    <input type="password" name="name" placeholder="Password" className="imputfild" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={{ marginLeft: 35 }} />
                                </div>


                                <br></br><input type="submit" value="Log in" className="addbtn" onClick={handleLogin} />

                                {/* </form> */}
                            </div>
                            <div className="secondpartofmodal">
                                <p style={{ fontSize: 32, color: 'white' }}>Feedback</p>
                                <p style={{ fontSize: 22, color: 'white' }}>Add your product and rate other items....</p>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                signupmodal && (
                    <div className="modal">
                        <div onClick={toggleModal1} className="overlay"></div>
                        <div className="modal-content">
                            <div className="firstpartofmodal">
                                {signupError && <p style={{ color: 'red' }}>{signupError}</p>}

                                <p style={{ fontSize: 22, fontWeight: '700', marginBottom: 5 }}>SignUp to continue</p>
                                {/* <form> */}

                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                                    <span style={{ top: 18, textAlign: 'center', position: 'absolute', marginRight: 20 }}><User size={30} weight="fill" /></span>
                                    <input type="text" name="name" placeholder="Name" className="imputfild" value={signupName} onChange={(e) => setSignupName(e.target.value)} style={{ marginLeft: 35 }}/>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                                    <span style={{ top: 18, textAlign: 'center', position: 'absolute', marginRight: 20 }}><EnvelopeSimple size={30} /></span>
                                    <input type="text" name="name" placeholder="Email" className="imputfild" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} style={{ marginLeft: 35 }}/>
                                </div>


                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                                    <span style={{ top: 18, textAlign: 'center', position: 'absolute', marginRight: 20 }}><DeviceMobile size={30} /></span>
                                    <input type="text" name="name" placeholder="Mobile" maxLength={10} className="imputfild" value={signupMobile} onChange={(e) => setSignupMobile(e.target.value)} style={{ marginLeft: 35 }}/>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                                    <span style={{ top: 18, textAlign: 'center', position: 'absolute', marginRight: 20 }}><LockKey size={30} weight="fill" /></span>
                                    <input type="password" name="name" placeholder="Password" className="imputfild" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} style={{ marginLeft: 35 }}/>
                                </div>


                                <p style={{ marginBottom: -20 }}>Already have an account ? <a href="#" onClick={alreadyhaveaccount}>Login</a></p>

                                <br></br><input type="submit" value="Signup" className="addbtn" onClick={handleSignup} />

                                {/* </form> */}
                            </div>
                            <div className="secondpartofmodal">
                                <p style={{ fontSize: 32, color: 'white' }}>Feedback</p>
                                <p style={{ fontSize: 22, color: 'white' }}>Add your product and rate other items....</p>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
