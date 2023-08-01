import LangAndCurrency from '../lang-currency/LangAndCurrency';
import { Link } from '../common/link';
import { useTranslation } from 'react-i18next';
import { TLngCurPair } from '../../types';
import { factorySearchFilter } from '../../domain/SearchFilter';

export default function Header() {
    const [t, i18n] = useTranslation('common');
    const searchFilter = factorySearchFilter();

    const saveLngAndCur = (val: TLngCurPair) => {
        searchFilter.currancy = val.currency;
        searchFilter.language = val.language;
        i18n.changeLanguage(val.language.toLowerCase());
    };
    return (
        <header className="header">
            <div className="header__container">
                <nav>
                    <Link title="flyfake.com" to="/">
                        <div className="header__logo">FLY FAKE</div>
                    </Link>
                </nav>
                <nav>
                    {/*<div className="drop-down">Help</div>*/}
                    <div className="drop-down" style={{ marginLeft: 40 }}>
                        <LangAndCurrency value={{ currency: searchFilter.currancy, language: searchFilter.language }} onChange={saveLngAndCur} />
                    </div>
                    <div className="drop-down" style={{ marginLeft: 20 }}>
                        <button className="login-button">
                            <span className="">
                                <span className="">{t('menu.signup')}</span>
                            </span>
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}
