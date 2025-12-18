import type { IdDataResponse } from "../../types/index.type";
import Button from "../../components/Button/Button";
import FormField from "../../components/FormField/FormField";
import { getBirthDateStringFromIIN } from "../../utils";

type IdParserProps = {
    value: IdDataResponse | null;
    onChange: (data: IdDataResponse | null) => void;
    errors?: string[];
    onParse?: (idFile: File | null) => void;
    loading?: boolean;
};

const IdParser = ({
    value,
    onChange,
    errors,
    onParse,
    loading,
}: IdParserProps) => {
    // обновление конкретного поля объекта id
    const updateIdField = (
        field: keyof IdDataResponse,
        val: string | File | null
    ) => {
        if (field === "iin") {
            const birthDate = getBirthDateStringFromIIN(val as string);

            onChange({
                ...(value || {}), // если value null — создаём объект
                [field as string]: val,
                birthDate: birthDate as string
            })
        } else {
            onChange({
                ...(value || {}), // если value null — создаём объект
                [field]: val,
            });
        }
    };

    return (
        <div>
            <div className="flex gap-2 flex-col my-4">
                <FormField
                    id="idFile"
                    type="file"
                    label="Файл удостоверения личности"
                    onChange={(value) => {
                        updateIdField("idFile", value);
                    }}
                    value={value?.idFile}
                    actions={
                        <Button
                            onClick={() => onParse?.(value?.idFile ?? null)}
                            disabled={loading || !value?.idFile}
                            loading={loading}
                            type="button"
                        >
                            Получить данные
                        </Button>
                    }
                />
            </div>

            <div className="flex flex-col gap-3 mt-4">
                <FormField
                    label="Фамилия"
                    error={errors?.includes("surname")}
                    value={value?.surname || ""}
                    onChange={(val) => updateIdField("surname", val as string)}
                />
                <FormField
                    label="Имя"
                    error={errors?.includes("name")}
                    value={value?.name || ""}
                    onChange={(val) => updateIdField("name", val as string)}
                />
                <FormField
                    label="Отчество"
                    value={value?.patronymic || ""}
                    onChange={(val) =>
                        updateIdField("patronymic", val as string)
                    }
                />
                <FormField
                    label="ИИН"
                    type="text"
                    error={errors?.includes("iin")}
                    value={value?.iin || ""}
                    onChange={(val) => {
                        const iin = val as string;
                        updateIdField("iin", iin);


                    }}
                />
                <FormField
                    label="Дата рождения"
                    type="date"
                    error={errors?.includes("birthDate")}
                    value={value?.birthDate || ""}
                    onChange={(val) => {
                        updateIdField("birthDate", val as string);
                    }}
                />

                <FormField
                    error={errors?.includes("idNumber")}
                    label="Номер удостоверения"
                    value={value?.idNumber || ""}
                    onChange={(val) =>
                        updateIdField("idNumber", val as string)
                    }
                />

                <FormField
                    label="Дата выдачи"
                    type="date"
                    error={errors?.includes("issueDate")}
                    value={value?.issueDate || ""}
                    onChange={(val) =>
                        updateIdField("issueDate", val as string)
                    }
                />

                <FormField
                    label="Дата окончания"
                    error={errors?.includes("expiryDate")}
                    type="date"
                    value={value?.expiryDate || ""}
                    onChange={(val) =>
                        updateIdField("expiryDate", val as string)
                    }
                />
                <FormField
                    label="Кем выдано"
                    error={errors?.includes("issuer")}
                    value={value?.issuer || ""}
                    onChange={(val) =>
                        updateIdField("issuer", val as string)
                    }
                />
            </div>
        </div>
    );
};

export default IdParser;
