import type { IdDataResponse } from "../../types/index.type";
import Button from "../../components/Button/Button";
import FormField from "../../components/FormField/FormField";

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
        onChange({
            ...(value || {}), // если value null — создаём объект
            [field]: val,
        });
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
                        updateIdField("iin", val as string);
                    }}
                />

                <FormField
                    error={errors?.includes("id_number")}
                    label="Номер удостоверения"
                    value={value?.id_number || ""}
                    onChange={(val) =>
                        updateIdField("id_number", val as string)
                    }
                />

                <FormField
                    label="Дата выдачи"
                    type="date"
                    error={errors?.includes("id_issue_date")}
                    value={value?.id_issue_date || ""}
                    onChange={(val) =>
                        updateIdField("id_issue_date", val as string)
                    }
                />

                <FormField
                    label="Дата окончания"
                    error={errors?.includes("id_expiry_date")}
                    type="date"
                    value={value?.id_expiry_date || ""}
                    onChange={(val) =>
                        updateIdField("id_expiry_date", val as string)
                    }
                />
                <FormField
                    label="Кем выдано"
                    error={errors?.includes("id_issuer")}
                    value={value?.id_issuer || ""}
                    onChange={(val) =>
                        updateIdField("id_issuer", val as string)
                    }
                />
            </div>
        </div>
    );
};

export default IdParser;
