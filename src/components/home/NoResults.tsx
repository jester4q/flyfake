import './no-results.scss';
import { useTranslation } from 'react-i18next';

export default function NoResults() {
    const [t] = useTranslation('common');
    return (
        <div className="no-results">
            <div>
                <span className="no-results__icon">
                    <svg>
                        <use xlinkHref="#kb_error"></use>
                    </svg>
                </span>
                <h1>{t('noresults.title')}</h1>
                <p>{t('noresults.text')}</p>
            </div>
        </div>
    );
}
