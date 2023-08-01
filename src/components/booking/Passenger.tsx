import { DOCUMENT_TYPES, GENDER } from '../../data/dict';
import Date from '../common/date/Date';
import Input from '../common/input/Input';
import SelectBox from '../common/selectbox/SelectBox';
import Switch from '../common/switch/Switch';

import citizenship from '../../data/citizenship.json';
import { TBookPassenger, TDictItem, TDocumentType, TGender, TLanguage, TPassengers } from '../../types';
import { useTranslation } from 'react-i18next';
import { BookPassenger } from '../../domain/Book';

function buildCitizenshipDict(lng: string): TDictItem[] {
    const favorit = ['RU', 'UA', 'BY', 'KZ'];
    const key: 'en' | 'ru' = lng !== 'ru' ? 'en' : 'ru';
    return citizenship
        .map((item) => {
            return {
                id: item.code,
                title: item.name_loc[key],
            };
        })
        .sort((a, b) => {
            const x = favorit.indexOf(a.id);
            const y = favorit.indexOf(b.id);
            if (x !== -1 && y !== -1) {
                return x - y;
            }
            if (x !== -1) {
                return -1;
            }
            if (y !== -1) {
                return 1;
            }
            return ('' + a.title).localeCompare(b.title);
        });
}

export default function Passenger({ value, no, setValue }: { value: TBookPassenger; no: number; setValue: (v: TBookPassenger) => void }) {
    const [t, i18nConfig] = useTranslation('common');
    const lng = i18nConfig.language;
    const citizenshipDict = buildCitizenshipDict(lng);
    let docKindDict = [DOCUMENT_TYPES[3]];
    const passanger = value;
    const changeCitizenship = (v: string) => {
        let kind = passanger.dctKind;
        if (v == 'RU') {
            if (kind == 'PASSPORT_ID') {
                kind = 'PASSPORT_ITN';
            }
        } else {
            kind = 'PASSPORT_ID';
        }
        setValue && setValue({ ...value, dctKind: kind, citizenship: v });
    };

    const changeDocKind = (v: string) => {
        setValue && setValue({ ...value, dctKind: v as TDocumentType });
    };

    const changeDocNo = (v: string) => {
        setValue && setValue({ ...value, dctNo: v });
    };

    const changeDocExpDate = (v: string) => {
        setValue && setValue({ ...value, dctExpired: v });
    };

    const changeDob = (v: string) => {
        setValue && setValue({ ...value, dob: v });
    };

    const changeFistName = (v: string) => {
        setValue && setValue({ ...value, firstName: v });
    };

    const changeLastName = (v: string) => {
        setValue && setValue({ ...value, lastName: v });
    };

    const changeMiddleName = (v: string) => {
        setValue && setValue({ ...value, middleName: v });
    };

    const changeCard = (v: string) => {
        setValue && setValue({ ...value, card: v });
    };

    const changeGender = (v: string) => {
        setValue && setValue({ ...value, gender: v as TGender });
    };

    if (passanger.citizenship == 'RU') {
        if (passanger.type == 'adult') {
            docKindDict = [DOCUMENT_TYPES[0], DOCUMENT_TYPES[1], DOCUMENT_TYPES[2]];
        } else {
            docKindDict = [DOCUMENT_TYPES[1], DOCUMENT_TYPES[2]];
        }
    }
    let docNoLabel = t('booking.document_number');
    if (passanger.dctKind === 'PASSPORT_RF') {
        docNoLabel = t('booking.document_seria_and_no');
    }
    if (passanger.dctKind === 'BIRTH_CRTF') {
        docNoLabel = t('booking.birth_certificate_seria_and_no');
    }

    const isFailed = (key: keyof TBookPassenger['error']) => {
        return passanger.error[key] !== undefined && !passanger.error[key];
    };

    return (
        <div className="booking__passenger">
            <div className="booking__passenger__title">
                <div>
                    {passanger.type == 'adult' && <h1>{t('booking.passenger_adult', { no: no })}</h1>}
                    {passanger.type == 'child' && <h1>{t('booking.passenger_child', { no: no })}</h1>}
                    {passanger.type == 'infant' && <h1>{t('booking.passenger_infant', { no: no })}</h1>}
                </div>
            </div>
            <div className="booking__passenger__line">
                <SelectBox
                    value={passanger.citizenship}
                    className="citizenship"
                    label={t('booking.nationality')}
                    dict={citizenshipDict}
                    setValue={changeCitizenship}
                    failed={isFailed('citizenship')}
                ></SelectBox>
            </div>
            <div className="booking__passenger__line">
                <SelectBox
                    value={passanger.dctKind}
                    className="document__type"
                    label={t('booking.document_type')}
                    dict={docKindDict}
                    setValue={changeDocKind}
                    disabled={docKindDict.length < 2}
                    failed={isFailed('dctKind')}
                ></SelectBox>
                <Input label={docNoLabel} placeholder={t('booking.seria_and_no')} value={passanger.dctNo} setValue={changeDocNo} failed={isFailed('dctNo')} />
                {!['PASSPORT_RF', 'BIRTH_CRTF'].includes(passanger.dctKind) && (
                    <Date label={t('booking.valid_until')} value={passanger.dctExpired} setValue={changeDocExpDate} failed={isFailed('dctExpired')} />
                )}
            </div>
            <div className="booking__passenger__line">
                <Input
                    label={t('booking.lastname')}
                    placeholder={t('booking.lastname_ph')}
                    value={passanger.lastName}
                    setValue={changeLastName}
                    failed={isFailed('lastName')}
                />
                <Input
                    label={t('booking.firstname')}
                    placeholder={t('booking.firstname_ph')}
                    value={passanger.firstName}
                    setValue={changeFistName}
                    failed={isFailed('firstName')}
                />
                <Input
                    label={t('booking.middlename')}
                    placeholder={t('booking.middlename_ph')}
                    value={passanger.middleName}
                    setValue={changeMiddleName}
                    failed={isFailed('middleName')}
                />
            </div>
            <div className="booking__passenger__line">
                <Date value={passanger.dob} label={t('booking.dob')} setValue={changeDob} />
                <Switch value={passanger.gender} label={t('booking.gender')} dict={GENDER} setValue={changeGender} failed={isFailed('gender')} />
                <Input label={t('booking.mile_card')} value={passanger.card} setValue={changeCard} failed={isFailed('card')} />
            </div>
        </div>
    );
}
