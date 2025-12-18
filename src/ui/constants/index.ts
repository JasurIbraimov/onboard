import type {
    WorkScheme,
    Bank,
    PhoneType,
    Role,
    AgreementType,
} from "../types/index.type";

export const ROLES: Role[] = [
    {
        label: "Учредитель",
        role: "founder",
    },
    {
        label: "Первый руководитель",
        role: "first_head",
    },
    {
        label: "Подписант",
        role: "signatory",
    },
    {
        label: "Заполнитель анкеты",
        role: "questionnaire_filler",
    },
    {
        label: "Пользователь в системе",
        role: "merchant_authorized_user",
    },
    {
        label: "Главный бухгалтер",
        role: "chief_accountant",
    },
        {
        label: "Бенефициар",
        role: "beneficiary",
    },
] as const;

export const YESNO: { value: boolean; label: string }[] = [
    { value: false, label: "Нет" },
    { value: true, label: "Да" },
];

export const PHONE_USAGES: { value: PhoneType; label: string }[] = [
    { value: "personal", label: "Личный" },
    { value: "work", label: "Рабочий" },
] as const;

export const BANKS: Bank[] = [
    { label: "Alatau City Bank", value: "TSESKZKA" },
    { label: "Altyn Bank", value: "ATYNKZKA" },
    { label: "Банк Китая в Казахстане", value: "BKCHKZKA" },
    { label: "Bereke Bank", value: "BRKEKZKA" },
    { label: "Kaspi Bank", value: "CASPKZKA" },
    { label: "Центральный депозитарий ценных бумаг", value: "CEDUKZKA" },
    { label: "Ситибанк Казахстан", value: "CITIKZKA" },
    { label: "Банк развития Казахстана", value: "DVKAKZKA" },
    { label: "Евразийский банк", value: "EURIKZKA" },
    { label: "Жилищный сберегательный банк «Отбасы банк»", value: "HCSKKZKA" },
    { label: "Исламский Банк «Al Hilal»", value: "HLALKZKZ" },
    { label: "Народный Банк Казахстана (Halyk Bank)", value: "HSBKKZKX" },
    {
        label: "Торгово-промышленный банк Китая в Алматы (ICBC)",
        value: "ICBKKZKX",
    },
    { label: "Home Credit Bank", value: "INLMKZKA" },
    { label: "ForteBank", value: "IRTYKZKA" },
    { label: "Банк ЦентрКредит (Bank CenterCredit)", value: "KCJBKZKX" },
    { label: "Bank RBK", value: "KINCKZKA" },
    { label: "Kassa Nova (дочерний банк ForteBank)", value: "KSNVKZKA" },
    { label: "Казахстан-Зираат Интернешнл Банк", value: "KZIBKZKA" },
    { label: "Национальный Банк Республики Казахстан", value: "NBRKKZKX" },
    { label: "Нурбанк", value: "NURSKZKX" },
    { label: "Шинхан Банк Казахстан", value: "SHBKKZKA" },
    { label: "Tengri Bank", value: "TNGRKZKX" },
    { label: "ВТБ (Казахстан)", value: "VTBAKZKZ" },
    { label: "Zaman-Bank (Исламский банк)", value: "ZAJSKZ22" },
] as const;

export const SYSTEM_TYPES: WorkScheme[] = ["СЭД", "СЭП"]
export const AGREEMENT_TYPES: AgreementType[] = ["Публичная оферта", "Договор"]
export const ADDRESS_TYPES = [
    {
        label: "Юридический",
        value: "law"
    },
    {
        label: "Фактический",
        value: "actual"
    },
    {
        label: "Почтовый",
        value: "mailing"
    },
] as const


export const MERCHANT_TYPES = [
    { value: "TOO", label: "ТОО" },
    { value: "IP", label: "ИП" },
    { value: "AO", label: "АО" },
] as const;




export const DEFAULT_TEMPLATE_USER = {
    iin: "",
    name: "",
    surname: "",
    patronymic: "",
    birthDate: "",
    id: "",
    fullName:"",
    citizenships: [],
    taxResidency: [],
    share: "",
    phoneNumbers: [],
    email:"",
    post: "",
    registrationAddress:""
}