import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import '../../App.css';
const Home = (props) => {
    const navigate = useNavigate();
    const [bhajanList, setBhajanList] = useState([]);
    let selectedCategory = props.selectedCategory;
    let setSelectedCategory = props.setSelectedCategory;
    let categories = props.categories;
    let results = props.results;
    useEffect(() => {
        let tempList = [];
        if (selectedCategory === '' && categories[0]) {
            setSelectedCategory(categories[0]);
        }
        if (results.data) {
            let columnIndex = categories.indexOf(selectedCategory);
            for (let i = 2; i < results.data.length; i++) {
                let row = results.data[i];
                if (row[columnIndex] != '') {
                    tempList.push(row[columnIndex]);
                }
            }
            setBhajanList(tempList)
        }
    }, [selectedCategory, results])

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
    return (
        <>
            <div className='body'>
                <Navbar categories={categories} setSelectedCategory={setSelectedCategory} searchList={props.searchList} setSelectedBhajan={props.setSelectedBhajan}/>
                <div className="content-container">
                    <h2>{selectedCategory}</h2>
                    <div className='bhajanList'>Bhajan List is :
                            {
                                bhajanList.map((bhajan, index) => (
                                    <div column={selectedCategory} row={index + 1} bhajanTitle={bhajan} onClick={(e) => changeSelectedBhajan(e)} className='bhajanName'>{bhajan}</div>
                                ))
                            }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home