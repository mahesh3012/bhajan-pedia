import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Diya } from '../../components/Diya';
import { deityLabel, splitBhajan } from '../../utils/text';
import '../../App.css';

const Home = (props) => {
  const navigate = useNavigate();
  const [bhajanList, setBhajanList] = useState([]);
  const { selectedCategory, setSelectedCategory, categories, results } = props;

  useEffect(() => {
    if (selectedCategory === '' && categories[0]) {
      setSelectedCategory(categories[0]);
    }
    if (results.data) {
      const columnIndex = categories.indexOf(selectedCategory);
      const tempList = [];
      for (let i = 2; i < results.data.length; i++) {
        const row = results.data[i];
        if (row[columnIndex] && row[columnIndex] !== '') {
          tempList.push(row[columnIndex]);
        }
      }
      setBhajanList(tempList);
    }
  }, [selectedCategory, results, categories, setSelectedCategory]);

  const changeSelectedBhajan = (e) => {
    const el = e.currentTarget;
    props.setSelectedBhajan({
      row: el.getAttribute('data-row'),
      column: el.getAttribute('data-column'),
      bhajanTitle: el.getAttribute('data-title'),
    });
    navigate('/bhajan-pedia/bhajan');
  };

  const label = deityLabel(selectedCategory);
  const loading = !results.data;

  return (
    <div className="app-shell">
      <Navbar
        categories={categories}
        setSelectedCategory={setSelectedCategory}
        searchList={props.searchList}
        setSelectedBhajan={props.setSelectedBhajan}
        activeCategory={selectedCategory}
      />

      <main className="stage">
        <div className="stage__inner">
          {loading ? (
            <div className="state">
              <div className="state__deva">पृष्ठ खुल रहे हैं…</div>
              <div className="state__note">Opening the songbook.</div>
            </div>
          ) : (
            <>
              <header className="deity-head">
                <h2 className="deity-head__name">{label.deva}</h2>
                {label.epithet ? (
                  <div className="deity-head__epithet">{label.epithet}</div>
                ) : null}
                {label.roman ? (
                  <div className="deity-head__roman">{label.roman}</div>
                ) : null}
                <div className="deity-head__rule">
                  <Diya className="deity-head__lamp" />
                </div>
              </header>

              {bhajanList.length === 0 ? (
                <div className="state">
                  <div className="state__deva">इस देवता के भजन शीघ्र ही।</div>
                  <div className="state__note">
                    No bhajans here yet — pick another deity from the left.
                  </div>
                </div>
              ) : (
                <div className="index">
                  {bhajanList.map((bhajan, index) => {
                    const { deva, roman } = splitBhajan(bhajan);
                    return (
                      <button
                        key={index}
                        className="index__item"
                        data-column={selectedCategory}
                        data-row={index + 1}
                        data-title={bhajan}
                        onClick={changeSelectedBhajan}
                      >
                        <span className="index__ord">{index + 1}</span>
                        <span className="index__text">
                          <span className="index__deva">{deva}</span>
                          {roman ? (
                            <span className="index__roman">{roman}</span>
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
