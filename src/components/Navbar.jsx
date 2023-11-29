import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../App.css';
const Navbar = (props) => {
    const navigate = useNavigate();
    const searchList = props.searchList;
    const [searchResultList,setSearchResultList] = useState([]);
    const handleCategorySelect = (category) => {
        props.setSelectedCategory(category);
        console.log("hi")
        const menuContent = document.getElementById('menuContent');
        const menuButton = document.getElementById('menuButton');
        if(menuButton){
            const display = window.getComputedStyle(menuButton).getPropertyValue('display')
            if(display=='block'){menuContent.style.display = 'none';}
        }
        navigate('/');
    }
    const handleMenuToggle = () => {
        const menuContent = document.getElementById('menuContent');
        const currentDisplay = menuContent.style.display;
        if(currentDisplay == 'block'){
            menuContent.style.display = 'none';
        }
        else if(currentDisplay == 'none' || currentDisplay == ''){
            menuContent.style.display = 'block';
        }
    }
    const changeSelectedBhajan = (e) => {
        const column = e.currentTarget.getAttribute('column');
        const row = e.currentTarget.getAttribute('row');
        const bhajanTitle = e.currentTarget.getAttribute('bhajanTitle');
        props.setSelectedBhajan({
            row: row,
            column: column,
            bhajanTitle: bhajanTitle
        })
        navigate('/bhajan');
    }
    const search = (query) => {
        if(query.length === 0){
            setSearchResultList([]);
        }
        if(query.length > 0){
            let tempResult = searchList.filter(item => item.bhajanTitle.toLowerCase().includes(query.toLowerCase()));
            setSearchResultList(tempResult);
        }
    }
    return (
        <>
            <div className="navbar-container">
                <button id="menuButton" onClick={handleMenuToggle}>&gt;</button>
                <div id="menuContent">
                    <h1 className='logo'>Bhajan-pedia</h1>
                    <div id='searchContainer'>
                        <input type='text' placeholder='Search by Bhajan Title' onChange={(e)=>search(e.target.value)} id="searchInput"/>
                        <div id="searchResultList">
                            {
                            searchResultList.map((bhajan)=>(
                                <div key={bhajan.id} 
                                column={bhajan.column} 
                                row={bhajan.row} 
                                bhajanTitle={bhajan.bhajanTitle}
                                onClick={(e) => changeSelectedBhajan(e)}
                                className='searchResult'
                                >{bhajan.bhajanTitle}</div>
                            ))}
                        </div>
                    </div>
                    <div className='categoryList'>
                        {
                            props.categories.map((category) => (
                                <div onClick={() => handleCategorySelect(category)} className='categoryName'>{category}</div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar