import React from 'react';
import { Navigate } from 'react-router-dom';
import { Diya } from '../components/Diya';
import { useCatalog } from '../context/CatalogProvider';
import '../App.css';

// "/" sends the reader to the first deity's index once the catalog has loaded.
const RootRedirect = () => {
  const { loading, deities } = useCatalog();

  if (loading) {
    return (
      <div className="notfound">
        <Diya className="notfound__lamp" />
        <div className="notfound__deva">पृष्ठ खुल रहे हैं…</div>
        <p className="notfound__note">Opening the songbook.</p>
      </div>
    );
  }

  if (!deities.length) {
    return (
      <div className="notfound">
        <Diya className="notfound__lamp" />
        <div className="notfound__deva">पोथी अभी खाली है</div>
        <p className="notfound__note">
          The songbook couldn’t be loaded right now. Please try again in a moment.
        </p>
      </div>
    );
  }

  return <Navigate to={`/${deities[0].slug}`} replace />;
};

export default RootRedirect;
