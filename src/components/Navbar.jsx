import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Diya, Flame } from './Diya';
import { deityLabel, splitBhajan } from '../utils/text';
import '../App.css';

const Navbar = (props) => {
  const navigate = useNavigate();
  const searchList = props.searchList;
  const activeCategory = props.activeCategory;
  const [searchResultList, setSearchResultList] = useState([]);

  // On mobile the rail is a slide-over; close it after a choice.
  const closeMobileMenu = () => {
    const menuContent = document.getElementById('menuContent');
    const menuButton = document.getElementById('menuButton');
    if (menuButton && menuContent) {
      const display = window
        .getComputedStyle(menuButton)
        .getPropertyValue('display');
      if (display !== 'none') menuContent.style.display = 'none';
    }
  };

  const handleCategorySelect = (category) => {
    props.setSelectedCategory(category);
    closeMobileMenu();
    navigate('/bhajan-pedia');
  };

  const handleMenuToggle = () => {
    const menuContent = document.getElementById('menuContent');
    menuContent.style.display =
      menuContent.style.display === 'block' ? 'none' : 'block';
  };

  const changeSelectedBhajan = (e) => {
    const el = e.currentTarget;
    props.setSelectedBhajan({
      row: el.getAttribute('data-row'),
      column: el.getAttribute('data-column'),
      bhajanTitle: el.getAttribute('data-title'),
    });
    setSearchResultList([]);
    closeMobileMenu();
    navigate('/bhajan-pedia/bhajan');
  };

  const search = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setSearchResultList([]);
      return;
    }
    setSearchResultList(
      searchList.filter((item) =>
        item.bhajanTitle.toLowerCase().includes(q)
      )
    );
  };

  return (
    <nav className="rail">
      <button
        id="menuButton"
        className="rail__toggle"
        onClick={handleMenuToggle}
        aria-label="Open deities and search"
      >
        ☰
      </button>

      <div id="menuContent" className="rail__content">
        <div className="brand">
          <Diya className="brand__lamp" />
          <div>
            <h1 className="brand__name">भजनपीडिया</h1>
            <span className="brand__sub">Bhajanpedia</span>
          </div>
        </div>

        <div className="search" id="searchContainer">
          <input
            type="text"
            id="searchInput"
            className="search__input"
            placeholder="किसी भजन का नाम खोजें · Search"
            aria-label="Search bhajans by title"
            onChange={(e) => search(e.target.value)}
          />
          <div id="searchResultList" className="search__results">
            {searchResultList.map((bhajan) => {
              const { deva } = splitBhajan(bhajan.bhajanTitle);
              return (
                <button
                  key={bhajan.id}
                  className="search__result"
                  data-column={bhajan.column}
                  data-row={bhajan.row}
                  data-title={bhajan.bhajanTitle}
                  onClick={changeSelectedBhajan}
                >
                  {deva}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rail__label">देवता · Deities</div>
        <div className="deity-list">
          {props.categories.map((category, i) => {
            const { deva, roman } = deityLabel(category);
            const isActive = category === activeCategory;
            return (
              <button
                key={category + i}
                className={`deity${isActive ? ' is-active' : ''}`}
                onClick={() => handleCategorySelect(category)}
                aria-current={isActive ? 'true' : undefined}
              >
                <Flame className="deity__mark" />
                <span className="deity__text">
                  <span className="deity__deva">{deva}</span>
                  {roman ? <span className="deity__roman">{roman}</span> : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
