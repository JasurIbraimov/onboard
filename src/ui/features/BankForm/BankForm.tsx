// components/BankForm/BankForm.tsx
import { useState } from "react";
import type { Bank } from "../../types/index.type";
import { BANKS } from "../../constants";
import Fieldset from "../../components/FormField/Fieldset";
import FormField from "../../components/FormField/FormField";

export interface BankData {
    bank: Bank;
    iik: string;
    bankAccountFile: File | null;
}

interface BankFormProps {
    onChange: (data: BankData) => void;
    data?: BankData | null
}

const BankForm = ({ onChange, data: providedData }: BankFormProps) => {
    const [data, setData] = useState<BankData>(providedData || {
        bank: BANKS[0],
        iik: "",
        bankAccountFile: null,
    });

    const updateField = (patch: Partial<BankData>) => {
        const newData = { ...data, ...patch };
        setData(newData);
        onChange(newData);
    };

    return (
        <Fieldset legend="Банковские реквизиты">
            {/* <FormField
                id="bankAccount"
                label="Файл банковских реквизитов"
                type="file"
                onChange={(file) =>
                    updateField({ bankAccountFile: file as File | null })
                }
            /> */}

            <FormField
                required
                type="bank"
                id="bank"
                label="Банк"
                value={data.bank.value}
                onChange={(value) => {
                    const found =
                        BANKS.find((b) => b.value === value) ?? BANKS[0];
                    updateField({ bank: found });
                }}
            />

            <p className="bg-base-100 p-2">{data.bank.value}</p>

            <FormField
                id="iik"
                label="ИИК"
                value={data.iik}
                onChange={(val) => updateField({ iik: val as string })}
                required
            />
        </Fieldset>
    );
};

export default BankForm;
