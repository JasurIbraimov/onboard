// --- Role Types ---
export type Roles =
    | "founder"
    | "first_head"
    | "signatory"
    | "questionnaire_filler"
    | "merchant_authorized_user"
    | "chief_accountant";

export type Role = {
    label: string;
    role: Roles;
};

// --- Person Types ---
export type PhoneType = "work" | "personal";

export type PhoneNumber = {
    number: string;
    usage: PhoneType;
};

export type Country = { country: string };
export type YesNo = "no" | "yes"

export interface PersonData {
    roles: Roles[];
    idData: IdDataResponse | null;
    citizenships: Country[];
    taxResidency: Country[];
    isPublic: YesNo;
    isAffiliated: YesNo;
    share: string;
    phoneNumbers: PhoneNumber[];
    email: string;
    post: string;
    registrationAddress: string;
}

// --- ID Card Types ---
export type IdDataResponse = {
    iin?: string;
    name?: string;
    idFile?: null | File;
    surname?: string;
    patronymic?: string;
    birth_date?: string;
    id_number?: string;
    id_issue_date?: string;
    id_expiry_date?: string;
    id_issuer?: string;
};

// --- Bank Types ---
export type Bank = {
    label: string;
    value: string;
};

export type BankData = {
    bank: Bank;
    iik: string;
    bankAccountFile: File | null;
};

// --- Application Types ---
export type Application = {
    merchant: MerchantResponse;
    persons: PersonData[];
    bank: BankData
};

export type WorkScheme = "СЭП" | "СЭД";

export type AgreementType = "Публичная оферта" | "Договор"



// --- Merchant Types ---
export type MerchantType = "TOO" | "IP" | "AO";

export type OkedResponse = {
    code: string;
    name_ru?: string;
};

export type MerchantResponse = {
    identifier: string;
    name: string;
    full_name?: string | null;
    law_address?: string | null;
    register_date?: string | null;
    last_register_date?: string | null;
    type: MerchantType;
    main_oked?: OkedResponse | null;
    extra_okeds: OkedResponse[];
    kbe?: string | null;
    region?: string | null;
};

// --- Input Types ---
export type InputType = "country" | "bank";

export const Steps = {
    FORMAT: "FORMAT",
    MERCHANT: "MERCHANT",
    INDIVIDUALS: "INDIVIDUALS",
    BANK: "BANK",
} as const;

export type Steps = (typeof Steps)[keyof typeof Steps];
