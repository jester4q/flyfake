import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

import common_ru from './data/translations/ru/common.json';
import common_en from './data/translations/en/common.json';
import { factorySearchFilter } from './domain/SearchFilter';

const searchFilter = factorySearchFilter();

const i18nConfig = {
    interpolation: { escapeValue: false },
    lng: (searchFilter.language && searchFilter.language.toLowerCase()) || 'en',
    resources: {
        en: {
            common: common_en, // 'common' is our custom namespace
        },
        ru: {
            common: common_ru,
        },
    },
};

i18next.init(i18nConfig);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <I18nextProvider i18n={i18next}>
                <App />
            </I18nextProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
