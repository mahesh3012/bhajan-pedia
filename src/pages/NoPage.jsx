import React from 'react';
import { Link } from 'react-router-dom';
import { Diya } from '../components/Diya';
import '../App.css';

const NoPage = () => (
  <div className="notfound">
    <Diya className="notfound__lamp" />
    <div className="notfound__deva">यह पृष्ठ नहीं मिला</div>
    <p className="notfound__note">
      This page isn’t in the songbook — but the lamp is still lit at the
      beginning.
    </p>
    <Link className="notfound__home" to="/">
      अनुक्रमणिका पर लौटें · Back to the index
    </Link>
  </div>
);

export default NoPage;
