import React from "react";
import { Link } from 'react-router-dom';

const Header = () => {
    return <nav>
    <ul>
      <li>
        <Link to="/home">Page One</Link>
      </li>
      <li>
        <Link to="/personal">Page Two</Link>
      </li>
      <li>
        <Link to="/bank-accounts">Page Two</Link>
      </li>
      <li>
        <Link to="/cache-invoices">Page Two</Link>
      </li>
      <li>
        <Link to="/operations">Page Two</Link>
      </li>
      <li>
        <Link to="/financial-goals">Page Two</Link>
      </li>
      <li>
        <Link to="/regular-spends">Page Two</Link>
      </li>
      <li>
        <Link to="/login">Page Two</Link>
      </li>
      <li>
        <Link to="/register">Page Two</Link>
      </li>
    </ul>
  </nav>
}

export default  Header;