import React, { useState, useEffect } from "react";
import Header from "../../header";
import img1 from '../../assest/homeimg.png'
import '../../css/main/index.css';
import { Chat, CaretUp, ChatCircleText } from 'phosphor-react';



export default function Home() {
    const [filter, setFilter] = useState('all');
    const [modal, setModal] = useState(false);
    const [auth, setAuth] = useState();
    const [forAddProductAuth, setForAddProductAuth] = useState(false);
    const [token, setToken] = useState();
    const [getAllProductState, setGetAllProductState] = useState([]);


    const [productName, setProductName] = useState('')
    const [productCategory, setProductCategory] = useState('')
    const [productLogoUrl, setProductLogoUrl] = useState('')
    const [productLink, setProductLink] = useState('')
    const [productDescription, setProductDescription] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handlefilter = (item) => {
        setFilter(item)
        getAllProduct(item)

    }
    const toggleModal = () => {
        if (auth) {
            setModal(!modal);
        } else {
            setForAddProductAuth(false)
            console.log(modal);
        }

    };

    if (modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }


    const handleAddProduct = () => {
        setError('')
        setSuccess('')
        if (!productName) {
            setError("Product Name Required")
        } else if (!productCategory) {
            setError("Product Category Required")
        } else if (!productLogoUrl) {
            setError("Product Logo url Required")
        } else if (!productLink) {
            setError("Link of product")
        } else if (!productDescription) {
            setError("Product description Required")
        } else {
            fetch('http://localhost:5000/v1/product/addProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ companyName: productName, category: productCategory, logoURL: productLogoUrl, productLink: productLink, discription: productDescription })
            }).then(res => res.json()).then(
                async data => {
                    console.log(data);
                    if (data.success == false) {
                        setError(data.message);
                    } else if (data.success == true) {
                        alert("done")
                        console.log(data, data.token);
                    }
                }
            )
        }
    }

    const getAllProduct = async (item) => {
        console.log(token);
        console.log("item name from get product" + item);
        if (item == 'all') {
            let result = await fetch(`http://localhost:5000/v1/product/getAllProduct`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZDMwNmI4YzM3N2M3YmEzNmM2M2YxZCIsImlhdCI6MTY5MTU1MTQ2Mn0.8UH7lz4WEoCiLu2YPGDqwXZkJjW_IDQW8tb9nBPPHWg'
                }
            }
            );
            result = await result.json();
            if (result) {
                var data1 = result;
                setGetAllProductState(data1);
            }
        } else {
            let result1 = await fetch(`http://localhost:5000/v1/product/filterProduct/${item}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZDMwNmI4YzM3N2M3YmEzNmM2M2YxZCIsImlhdCI6MTY5MTU1MTQ2Mn0.8UH7lz4WEoCiLu2YPGDqwXZkJjW_IDQW8tb9nBPPHWg'
                }
            }
            );
            result1 = await result1.json();
            if (result1) {
                var data1 = result1;
                setGetAllProductState(data1);
            }
        }

    }

    useEffect(() => {
        const Auth = JSON.parse(localStorage.getItem("FeedbackCurrentUser"))
        if (Auth) {
            setAuth(Auth.data)
            setToken(Auth.token)
        }

        getAllProduct('all')

    }, [])
    return (
        <>
            <Header login={forAddProductAuth} />
            <div>
                <div className="homecomp">
                    <img src={img1} alt="Logo" className="homecompimg" />
                    <div className="homecomptext">
                        <p style={{ fontSize: 32, fontWeight: '500' }}>Add your products and give your valuable feedback</p>
                        <p>Easily give your feedback in a matter of minutes. Access your audience on all platforms. Observe result manually in real time</p>
                    </div>
                </div>

                <div className="filtercomp">
                    <div className="filterinnercomp">
                        <div className="feedbackandfilter">
                            <p>Feedback</p>
                            <p>Apply Filter</p>
                        </div>
                        <p className="filtername">Filter:</p>
                        <div className="filteritem">
                            <button className="btn" onClick={() => { handlefilter('all') }}>All</button>
                            <button className="btn" onClick={() => { handlefilter('Fintech') }}>Fintech</button>
                            <button className="btn" onClick={() => { handlefilter('EdTech') }}>EdTech</button>
                            <button className="btn" onClick={() => { handlefilter('B2B') }}>B2B</button>
                            <button className="btn" onClick={() => { handlefilter('Saas') }}>Saas</button>
                            <button className="btn" onClick={() => { handlefilter('AgriTech') }}>AgriTech</button>
                            <button className="btn" onClick={() => { handlefilter('MedTech') }}>MedTech</button>
                        </div>
                    </div>
                    <div className="businesslistComp">
                        <div className="Suggestion">
                            <div style={{ display: 'flex' }}>
                                <p style={{ fontSize: 17, fontWeight: '600', marginRight: 10 }}>{getAllProductState.length} Suggestion</p>
                                <p>sort by:<span style={{ fontSize: 17, fontWeight: '600', marginLeft: 5, marginTop: 10 }}>Upvotes<CaretUp size={19} /></span></p>
                            </div>
                            <div>
                                <button onClick={() => { toggleModal() }} className="addproduct">+ Add Product</button>
                            </div>
                        </div>
                        <div className="businessmaincomp">
                            {/* {filter} */}
                            {
                                getAllProductState.map((ind) => {
                                    return (
                                        <>
                                            <div className="businessCard">
                                                <div style={{ display: "flex", alignItems: 'center', justifyContent: 'space-between', }}>
                                                    <div style={{ display: "flex", alignItems: 'center', }}>
                                                        <img src={img1} height={50} width={50} alt="Logo" style={{ borderRadius: 40 }} />
                                                        <div style={{ marginLeft: 10 }}>
                                                            <p style={{ paddingTop: 0, color: '#36416A', fontSize: 22, fontWeight: '600' }}>{ind.companyName}</p>
                                                            <p style={{ marginTop: -20 }}>{ind.discription}</p>
                                                        </div>
                                                    </div>
                                                    <div className="noofupvote">
                                                        <CaretUp size={19} />
                                                        <p style={{ marginTop: -5 }}>999</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: 50 }}>
                                                        <div style={{alignItems:'center',textAlign:'center'}}>
                                                            {
                                                                ind.category.map((val) => {
                                                                    return (
                                                                        <>
                                                                            <button className="btn1" >{val}</button>
                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                            <ChatCircleText size={32} className="hiiicon"/>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: 0 }}>
                                                            {auth && <button className="btnedit" disabled>Edit</button>}
                                                            <div style={{ display: 'flex' }}>
                                                                <p style={{ marginRight: 5 }}>7</p><p><Chat size={22} weight="fill" /></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </>)
                                })
                            }
                        </div>
                    </div>

                </div>
            </div>



            {
                modal && (
                    <div className="modal">
                        <div onClick={toggleModal} className="overlay"></div>
                        <div className="modal-content">
                            <div className="firstpartofmodal">
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                <p style={{ fontSize: 22, fontWeight: '600', marginBottom: 5 }}>Add Your Product</p>
                                {/* <form> */}
                                <input type="text" name="name" placeholder="Name of the Company" className="imputfild" value={productName} onChange={(e) => setProductName(e.target.value)} />

                                <input type="text" name="name" placeholder="Category" className="imputfild" value={productCategory} onChange={(e) => setProductCategory(e.target.value)} />

                                <input type="text" name="name" placeholder="Add logo url" className="imputfild" value={productLogoUrl} onChange={(e) => setProductLogoUrl(e.target.value)} />

                                <input type="text" name="name" placeholder="Link of product" className="imputfild" value={productLink} onChange={(e) => setProductLink(e.target.value)} />

                                <input type="text" name="name" placeholder="Add disctioption" className="imputfild" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />


                                <br></br><input type="submit" value="+Add" className="addbtn" onClick={handleAddProduct} />

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
