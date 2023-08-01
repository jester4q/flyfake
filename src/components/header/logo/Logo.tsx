import { Link } from 'react-router-dom';

export default function Logo() {
    return (
        <Link to="/">
            <div className="header__logo"></div>
        </Link>
    );
}
