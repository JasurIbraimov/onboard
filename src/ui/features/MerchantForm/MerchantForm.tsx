import { useState } from "react";
import type { MerchantResponse, OkedResponse } from "../../types/index.type";
import FormField from "../../components/FormField/FormField";
import EditableList from "../../components/EditableList/EditableList";
import Fieldset from "../../components/FormField/Fieldset";
import Button from "../../components/Button/Button";
import { countryNames } from "../../utils";
import MerchantAPI from "../../api/merchant"


type Props = {
    value: MerchantResponse | null;
    onChange: (merchant: MerchantResponse | null) => void;
};

const MerchantForm = ({ value, onChange }: Props) => {
    const [merchant, setMerchant] = useState<MerchantResponse>(
        value ?? {
            identifier: "",
            name: "",
            type: "TOO",
            extra_okeds: [],
            last_register_date: "",
            register_date: "",
            law_address: "",
            region: "KZ",
        }
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateField = <K extends keyof MerchantResponse>(
        key: K,
        val: MerchantResponse[K]
    ) => {
        const updated = { ...merchant, [key]: val };
        setMerchant(updated);
        onChange(updated);
    };

    const fetchMerchant = async () => {
        if (!merchant.identifier) return;

        setLoading(true);
        setError(null);

        try {
            const found = await MerchantAPI.fetchByIdentifier(merchant.identifier);
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
                            disabled={loading || !merchant.identifier}
                            loading={loading}
                        >
                            Получить данные
                        </Button>
                    }
                    id="identifier"
                    label="БИН/ИИН"
                    value={merchant.identifier}
                    onChange={(val) => updateField("identifier", val as string)}
                    placeholder="Введите БИН/ИИН"
                    required
                />
                {error && <span className="text-red-600 text-sm">{error}</span>}
            </div>

            <FormField
                id="name"
                label="Наименование"
                value={merchant.name}
                onChange={(val) => updateField("name", val as string)}
                placeholder="Например: ТОО «Компания»"
                required
            />

            <FormField
                id="law_address"
                label="Юридический адрес"
                value={merchant.law_address ?? ""}
                onChange={(val) => updateField("law_address", countryNames[val as string])}
                placeholder="Например, Республика Казахстан, г. Астана, ул. ..."
            />

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
                    value={merchant.register_date || ""}
                    onChange={(val) =>
                        updateField("register_date", val as string)
                    }
                />

                <FormField
                    label="Дата последней перерегистрации"
                    type="date"
                    value={merchant.last_register_date || ""}
                    onChange={(val) =>
                        updateField("last_register_date", val as string)
                    }
                />
            </div>

            <EditableList<OkedResponse>
                title="Основной ОКЭД"
                items={merchant.main_oked ? [merchant.main_oked] : []}
                onChange={(items) => updateField("main_oked", items[0] ?? null)}
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
                items={merchant.extra_okeds}
                onChange={(items) => updateField("extra_okeds", items)}
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
