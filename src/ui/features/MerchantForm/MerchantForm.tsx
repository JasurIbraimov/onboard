import { useState } from "react";
import type { AddressType, MerchantResponse, OkedResponse } from "../../types/index.type";
import FormField from "../../components/FormField/FormField";
import EditableList from "../../components/EditableList/EditableList";
import Fieldset from "../../components/FormField/Fieldset";
import Button from "../../components/Button/Button";
import { countryNames } from "../../utils";
import MerchantAPI from "../../api/merchant"
import VariantPicker from "../../components/VariantPicker/VariantPicker";
import { ADDRESS_TYPES } from "../../constants";


type Props = {
    value: MerchantResponse | null;
    onChange: (merchant: MerchantResponse | null) => void;
};

const MerchantForm = ({ value, onChange }: Props) => {
    const [merchant, setMerchant] = useState<MerchantResponse>(
        value ?? {
            id: "",
            name: "",
            type: "TOO",
            extraOkeds: [],
            lastRegisterDate: "",
            registerDate: "",
            region: "KZ",
        }
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [addressTypes, setAddressTypes] = useState<AddressType[]>(["law"]);

    const updateField = <K extends keyof MerchantResponse>(
        key: K,
        val: MerchantResponse[K]
    ) => {
        const updated = { ...merchant, [key]: val };
        setMerchant(updated);
        onChange(updated);
    };

    const fetchMerchant = async () => {
        if (!merchant.id) return;

        setLoading(true);
        setError(null);

        try {
            const found = await MerchantAPI.fetchByIdentifier(merchant.id);
            if (found) {
                setMerchant({
                    ...found,
                    region:
                        Object.entries(countryNames).find(
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            ([_, name]) => name === found.region
                        )?.[0] || found.region,
                });
                onChange(found);
            } else {
                setError("Организация не найдена, заполните вручную");
            }
        } catch (err: Error | unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Ошибка при поиске организации"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fieldset legend="Данные организации">
            <div className="flex flex-col items-start gap-2">
                <FormField
                    actions={
                        <Button
                            type="button"
                            onClick={fetchMerchant}
                            disabled={loading || !merchant.id}
                            loading={loading}
                        >
                            Получить данные
                        </Button>
                    }
                    id="identifier"
                    label="БИН/ИИН"
                    value={merchant.id}
                    onChange={(val) => updateField("id", val as string)}
                    required
                />
                {error && <span className="text-red-600 text-sm">{error}</span>}
            </div>

            <FormField
                id="name"
                label="Наименование"
                value={merchant.name}
                onChange={(val) => updateField("name", val as string)}
                required
            />

            <VariantPicker<AddressType>
                options={ADDRESS_TYPES}
                value={addressTypes}
                mode="multiple"
                onChange={(value) => setAddressTypes(value as AddressType[])}
                title="Адреса"
                className="flex-wrap"
            />

            {addressTypes.map((addressValue) => {
                const addressType = ADDRESS_TYPES.find(
                    (t) => t.value === addressValue
                );

                if (!addressType) return null;

                return (
                    <FormField
                        key={addressValue}
                        id={addressValue}
                        label={addressType.label}
                        value={merchant?.addresses?.[addressValue]}
                        onChange={(val) =>
                            updateField("addresses", {
                                ...(merchant?.addresses ?? {}),
                                [addressValue]: val as string,
                            })
                        }
                    />
                );
            })}

            <FormField
                id="region"
                label="Регион"
                type="country"
                value={merchant.region ?? ""}
                onChange={(val) => updateField("region", val as string)}
            />

            <FormField
                id="kbe"
                label="КБЕ"
                value={merchant.kbe ?? ""}
                onChange={(val) => updateField("kbe", val as string)}
            />
            <div className="flex gap-2 flex-wrap md:flex-nowrap">
                <FormField
                    label="Дата регистрации"
                    type="date"
                    value={merchant.registerDate || ""}
                    onChange={(val) =>
                        updateField("registerDate", val as string)
                    }
                />

                <FormField
                    label="Дата последней перерегистрации"
                    type="date"
                    value={merchant.lastRegisterDate || ""}
                    onChange={(val) =>
                        updateField("lastRegisterDate", val as string)
                    }
                />
            </div>

            <EditableList<OkedResponse>
                title="Основной ОКЭД"
                items={merchant.mainOked ? [merchant.mainOked] : []}
                onChange={(items) => updateField("mainOked", items[0] ?? null)}
                unique
                renderItem={(item) => (
                    <>
                        {item.code} — {item.name_ru}
                    </>
                )}
                schema={{
                    code: { type: "text", placeholder: "Код ОКЭД" },
                    name_ru: {
                        type: "text",
                        placeholder: "Название (рус)",
                    },
                }}
            />

            <EditableList<OkedResponse>
                title="Доп. ОКЭДы"
                items={merchant.extraOkeds}
                onChange={(items) => updateField("extraOkeds", items)}
                unique
                renderItem={(item) => (
                    <>
                        {item.code} — {item.name_ru}
                    </>
                )}
                schema={{
                    code: { type: "text", placeholder: "Код ОКЭД" },
                    name_ru: {
                        type: "text",
                        placeholder: "Название (рус)",
                    },
                }}
            />
        </Fieldset>
    );
};

export default MerchantForm;
