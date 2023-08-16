import React, { useState, useEffect } from "react";
import Header from "../../header";
import img1 from '../../assest/homeimg.png'
import '../../css/main/index.css';
import { Chat, CaretUp, ChatCircleText, PaperPlaneRight } from 'phosphor-react';



export default function Home() {
    const [filter, setFilter] = useState('all');
    const [modal, setModal] = useState(false);
    const [messagemodel, setMessageModel] = useState('');
    const [auth, setAuth] = useState();
    const [forAddProductAuth, setForAddProductAuth] = useState(false);
    const [token, setToken] = useState();
    const [getAllProductState, setGetAllProductState] = useState([]);
    const [switchProductType, setSwitchProductType] = useState('');
    const [currendtId, setCurrentId] = useState();
    const [comment, setComment] = useState();


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
    const toggleModal = async (type, currentProductId) => {
        console.log(type);
        if (auth) {
            setModal(!modal);
            setSwitchProductType(type)

        } else {
            setForAddProductAuth(false)
            console.log(modal);
        }
        if (type == 'edit') {
            let result1 = await fetch(`http://localhost:5000/v1/product/getProductById/?id=${currentProductId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
            );
            result1 = await result1.json();
            if (result1) {
                var data1 = result1;
                console.log(data1);
                setProductName(data1.data.companyName)
                setProductCategory(data1.data.category.toString())
                setProductLogoUrl(data1.data.logoURL)
                setProductLink(data1.data.productLink)
                setProductDescription(data1.data.discription)
            }
            setCurrentId(currentProductId)
            console.log(currentProductId);
        }

    };




    const handleAddProduct = () => {
        setError('')
        setSuccess('')
        console.log(token);
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
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ companyName: productName, category: productCategory, logoURL: productLogoUrl, productLink: productLink, discription: productDescription })
            }).then(res => res.json()).then(
                async data => {
                    console.log(data);
                    if (data.success == false) {
                        setError(data.message);
                    } else if (data.success == true) {
                        // alert("done")
                        // window.location.reload();
                        setModal(false)
                        toggleModal()
                        getAllProduct('all')
                    }
                }
            )
        }
    }

    const handleEditProduct = () => {
        console.log(currendtId);
        fetch(`http://localhost:5000/v1/product/updateProduct/${currendtId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ companyName: productName, category: productCategory.split(","), logoURL: productLogoUrl, productLink: productLink, discription: productDescription })
        }).then(res => res.json()).then(
            async data => {
                console.log(data);
                if (data.success == false) {
                    setError(data.message);
                } else if (data.success == true) {
                    // window.location.reload();
                    setModal(false)
                    toggleModal()
                    getAllProduct('all')

                }
            }
        )
    }

    const handleComment = async (currentProductId) => {
        let newComment;

        let result1 = await fetch(`http://localhost:5000/v1/product/getProductById/?id=${currentProductId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        );
        result1 = await result1.json();
        if (result1) {
            var data1 = result1;
            // console.log(data1.data.comment);

            // console.log(data1);
            newComment = data1.data.comment;
            let obj = {
                "Msg": comment
            }
            newComment.push(obj);

            fetch(`http://localhost:5000/v1/product/updateProduct/${currentProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ comment: newComment })
            }).then(res => res.json()).then(
                async data => {
                    console.log(data);
                    if (data.success == false) {
                        setError(data.message);
                    } else if (data.success == true) {
                        // window.location.reload();
                        getAllProduct('all')
                    }
                }
            )

            // console.log(data1.data.comment);
            // console.log(comment + newComment);
        }
    }


    const handleVote = async (currentProductId) => {
        let result1 = await fetch(`http://localhost:5000/v1/product/getProductById/?id=${currentProductId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        );
        result1 = await result1.json();
        if (result1) {
            var data1 = result1;
            console.log(data1.data);
            fetch(`http://localhost:5000/v1/product/updateProduct/${currentProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ vote: data1.data.vote + 1 })
            }).then(res => res.json()).then(
                async data => {
                    console.log(data);
                    if (data.success == false) {
                        setError(data.message);
                    } else if (data.success == true) {
                        getAllProduct('all')
                    }
                }
            )
        }
    }

    const getAllProduct = async (item) => {
        // console.log(token);
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
            // console.log(result);
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
                            <p style={{fontSize:32,color:'white'}}>Feedback</p>
                            <p style={{fontSize:18,color:'white',marginTop:-30}}>Apply Filter</p>
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
                                <button onClick={() => { toggleModal('add', null) }} className="addproduct">+ Add Product</button>
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
                                                        <CaretUp size={19} onClick={() => { handleVote(ind._id) }} />
                                                        <p style={{ marginTop: -5 }}>{ind.vote}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: 50 }}>
                                                        <div style={{ alignItems: 'center', textAlign: 'center' }}>
                                                            {
                                                                ind.category.map((val) => {
                                                                    return (
                                                                        <>
                                                                            <button className="btn1" >{val}</button>
                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                            <ChatCircleText size={32} className="hiiicon" onClick={() => { setMessageModel(ind._id) }} />
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: 0 }}>
                                                            {auth && <button className="btnedit" onClick={() => { toggleModal('edit', ind._id) }} >Edit</button>}
                                                            <div style={{ display: 'flex' }} onClick={() => { setMessageModel(ind._id) }}>
                                                                <p style={{ marginRight: 5 }}>{ind.comment.length}</p><p><Chat size={22} weight="fill" /></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    messagemodel == ind._id &&
                                                    <div style={{ maxHeight: 200, overflowY: 'scroll' }}>
                                                        <div className="commentComp" >
                                                            <PaperPlaneRight size={24} style={{ position: 'absolute', textAlign: 'center', right: '6%', paddingTop: 10, cursor: 'pointer' }} color="#ABABAB" onClick={() => { handleComment(ind._id) }} />
                                                            <input type="text" placeholder="Add a comment...." className="commentInput" value={comment} onChange={(e) => setComment(e.target.value)} />
                                                        </div>
                                                        {
                                                            (ind.comment).map((commentdan) => {
                                                                return (<p>{commentdan.Msg}</p>)
                                                            })
                                                        }
                                                    </div>
                                                }

                                            </div>
                                        </>
                                    )
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
                                <p style={{ fontSize: 22, fontWeight: '600', marginBottom: 5 }}>{switchProductType == 'add' ? 'Add' : 'Edit'} Your Product</p>
                                {/* <form> */}
                                <input type="text" name="name" placeholder="Name of the Company" className="imputfild" value={productName} onChange={(e) => setProductName(e.target.value)} />

                                <input type="text" name="name" placeholder="Category" className="imputfild" value={productCategory} onChange={(e) => setProductCategory(e.target.value)} />

                                <input type="text" name="name" placeholder="Add logo url" className="imputfild" value={productLogoUrl} onChange={(e) => setProductLogoUrl(e.target.value)} />

                                <input type="text" name="name" placeholder="Link of product" className="imputfild" value={productLink} onChange={(e) => setProductLink(e.target.value)} />

                                <input type="text" name="name" placeholder="Add disctioption" className="imputfild" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />


                                <br></br>
                                {switchProductType == 'add' ? <input type="submit" value="+Add" className="addbtn" onClick={handleAddProduct} /> : <input type="submit" value="Edit" className="addbtn" onClick={handleEditProduct} />}

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
