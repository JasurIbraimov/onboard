import type { ADDRESS_TYPES } from "../constants";

// --- Role Types ---
export type Roles =
    | "founder"
    | "beneficiary"
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

export interface PersonData {
    roles: Roles[];
    idData: IdDataResponse | null;
    citizenships: Country[];
    taxResidency: Country[];
    isPublic: boolean;
    isAffiliated: boolean;
    isContact: boolean;
    share: number;
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
    birthDate?: string;
    idNumber?: string;
    issueDate?: string;
    expiryDate?: string;
    issuer?: string;
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

export type AddressType = typeof ADDRESS_TYPES[number]["value"];

// --- Merchant Types ---
export type MerchantType = "TOO" | "IP" | "AO";

export type OkedResponse = {
    code: string;
    name_ru?: string;
};

export type MerchantResponse = {
    id: string;
    name: string;
    fullName?: string | null;
    addresses?: Partial<Record<AddressType, string>>;
    registerDate?: string | null;
    lastRegisterDate?: string | null;
    type: MerchantType;
    mainOked?: OkedResponse | null;
    extraOkeds: OkedResponse[];
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
