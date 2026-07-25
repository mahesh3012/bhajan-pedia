import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Diya, Flame } from './Diya';
import { Notice } from './Notice';
import { useCatalog } from '../context/CatalogProvider';
import { bhajanRefFor } from '../utils/catalog';
import { splitBhajan } from '../utils/text';
import '../App.css';

const Navbar = () => {
  const { deities, searchIndex } = useCatalog();
  const { deitySlug } = useParams();
  const [results, setResults] = useState([]);

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

  const handleMenuToggle = () => {
    const menuContent = document.getElementById('menuContent');
    menuContent.style.display =
      menuContent.style.display === 'block' ? 'none' : 'block';
  };

  const search = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults([]);
      return;
    }
    setResults(
      searchIndex.filter((item) =>
        item.rawTitle.toLowerCase().includes(q)
      )
    );
  };

  const onLinkNav = () => {
    setResults([]);
    closeMobileMenu();
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
        <Link className="brand" to="/" onClick={onLinkNav}>
          <Diya className="brand__lamp" />
          <div>
            <h1 className="brand__name">भजनपीडिया</h1>
            <span className="brand__sub">Bhajanpedia</span>
          </div>
        </Link>

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
            {results.map((r) => {
              const { deva } = splitBhajan(r.rawTitle);
              return (
                <Link
                  key={r.id}
                  className="search__result"
                  to={`/${r.deitySlug}/${bhajanRefFor(r)}`}
                  onClick={onLinkNav}
                >
                  {deva}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rail__label">देवता · Deities</div>
        <div className="deity-list">
          {deities.map((d) => {
            const isActive = d.slug === deitySlug;
            return (
              <Link
                key={d.slug}
                className={`deity${isActive ? ' is-active' : ''}`}
                to={`/${d.slug}`}
                onClick={onLinkNav}
                aria-current={isActive ? 'true' : undefined}
              >
                <Flame className="deity__mark" />
                <span className="deity__text">
                  <span className="deity__deva">{d.deva}</span>
                  {d.roman ? (
                    <span className="deity__roman">{d.roman}</span>
                  ) : null}
                </span>
              </Link>
            );
          })}
          {deities.length === 0 ? (
            <Notice deva="…" note="Loading deities" />
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
