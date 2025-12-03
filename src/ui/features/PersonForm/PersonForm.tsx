import React, { useState } from "react";
import type {
    Roles,
    PhoneNumber,
    PersonData,
    Country,
    YesNo,
    IdDataResponse,
} from "../../types/index.type";
import { ROLES, YESNO, PHONE_USAGES } from "../../constants";
import VariantPicker from "../../components/VariantPicker/VariantPicker";
import FormField from "../../components/FormField/FormField";
import IdParser from "../IdParser/IdParser";
import EditableList from "../../components/EditableList/EditableList";
import Button from "../../components/Button/Button";
import { getCountryName } from "../../utils";
import Fieldset from "../../components/FormField/Fieldset";
import toast from "react-hot-toast";
import { api } from "../../api";

interface PersonFormProps {
    onSave: (person: PersonData) => void;
    prepopulate?: PersonData | null;
}

const initialState: PersonData = {
    roles: [],
    idData: null,
    citizenships: [],
    taxResidency: [],
    isPublic: "no",
    isAffiliated: "no",
    share: "100",
    phoneNumbers: [],
    email: "",
    post: "",
    registrationAddress: "",
};

const PersonForm: React.FC<PersonFormProps> = ({ onSave, prepopulate }) => {
    const [person, setPerson] = useState<PersonData>(
        prepopulate ?? initialState
    );
    const [errors, setErrors] = useState<string[]>([]);
    const [loadingId, setLoadingId] = useState(false);

    const updateField = <K extends keyof PersonData>(
        field: K,
        value: PersonData[K]
    ) => {
        setErrors(prev => prev.filter((f) => f !== field))
        setPerson((prev) => ({ ...prev, [field]: value }));
    };

    const removeError = (...field: string[]) => {
        field.forEach((f) => {
            setErrors((prev) => prev.filter((pf) => f !== pf));
        })
    };

    const addError = (...field: string[]) => {
        setErrors((prev) => [...prev, ...field]);
    };

    const validate = (): boolean => {
        const { idData } = person;
        if (!person.roles.length) {
            toast.error("Выберите хотя бы одну роль");
            addError("roles");
            return false;
        }

        if (!person.post.trim()) {
            toast.error("Введите должность");
            addError("post");
            return false;
        }

        if (!idData?.surname?.trim()) {
            toast.error("Введите фамилию");
            addError("surname");
            return false;
        }

        if (!idData?.name?.trim()) {
            toast.error("Введите имя");
            addError("name");
            return false;
        }

        if (!idData?.iin?.trim()) {
            toast.error("Введите ИИН");
            addError("iin");
            return false;
        }

        if (!/^\d{12}$/.test(idData.iin)) {
            toast.error("ИИН должен содержать 12 цифр");
            addError("iin");
            return false;
        }

        if (!idData?.id_number?.trim()) {
            addError("id_number");
            toast.error("Введите номер удостоверения личности");
            return false;
        }

        if (!idData?.id_issue_date?.trim()) {
            toast.error("Укажите дату выдачи документа");
            addError("id_issue_date");

            return false;
        }

        if (!idData?.id_expiry_date?.trim()) {
            toast.error("Укажите дату окончания срока действия документа");
            addError("id_expiry_date");

            return false;
        }

        // Проверка дат: дата окончания > дата выдачи
        if (
            idData.id_issue_date &&
            idData.id_expiry_date &&
            new Date(idData.id_expiry_date) <= new Date(idData.id_issue_date)
        ) {
            toast.error(
                "Дата окончания действия должна быть позже даты выдачи"
            );
            addError("id_expiry_date", "id_issue_date");

            return false;
        }

        if (person.citizenships.length === 0) {
            toast.error("Укажите гражданство");
            addError("citizenships");
            return false;
        }

        if (person.taxResidency.length === 0) {
            toast.error("Укажите налоговое резиденство");
            addError("taxResidency");
            return false;
        }


        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(person.email)) {
            toast.error("Некорректный формат email");
            addError("email");
            return false;
        }

        const share = Number(person.share);
        if (isNaN(share) || share <= 0 || share > 100) {
            toast.error("Доля должна быть числом от 1 до 100");
            addError("share");
            return false;
        }

        // Проверка номеров телефонов
        if (person.phoneNumbers.length === 0) {
            toast.error("Добавьте хотя бы один номер телефона");
            addError("phoneNumbers");
            return false;
        }

        for (const phone of person.phoneNumbers) {
            if (!phone.number.trim()) {
                toast.error("Поле номера телефона не должно быть пустым");
                addError("phoneNumbers");
                return false;
            }
            if (!/^\+?\d{7,15}$/.test(phone.number)) {
                toast.error(`Некорректный формат телефона: ${phone.number}`);
                addError("phoneNumbers");
                return false;
            }
        }
        if (!person.email.trim()) {
            toast.error("Укажите электронную почту");
            addError("email");
            return false;
        }

        return true;
    };

    const handleSave = () => {
        if (!validate()) return;
        onSave(person);
        setPerson(initialState);
    };

    const handleParseId = async (idFile: File | null) => {
        try {
            setLoadingId(true);
            if (!idFile) {
                toast.error("Выберите документ удостоверения личности.");
                return;
            }
            const data = await api.parseId(idFile);
            console.log(data);
            updateField("idData", { ...data, idFile })
        } catch {
            toast.error("Ошибка при чтении документа, заполните вручную.");
        } finally {
            setLoadingId(false);
        }
    };

    return (
        <Fieldset >
            <VariantPicker<Roles>
                className="flex-wrap"
                error={errors.includes("roles")}
                title="Выберите роли:"
                options={ROLES.map(({ role, label }) => ({
                    value: role as Roles,
                    label,
                }))}
                value={person.roles}
                onChange={(val) => updateField("roles", val as Roles[])}
                mode="multiple"
            />

            <FormField
                id="post"
                error={errors.includes("post")}
                label="Должность"
                value={person.post}
                onChange={(val) => updateField("post", val as string)}
                placeholder="Должность"
            />

            <IdParser
                errors={errors}
                value={person.idData}
                loading={loadingId}
                onParse={handleParseId}
                onChange={(val) => {
                    updateField("idData", val);
                    removeError(...Object.keys(val as IdDataResponse))
                }}
            />

            <EditableList<Country>
                title="Гражданство"
                items={person.citizenships}
                error={errors.includes("citizenships")}
                onChange={(val) => updateField("citizenships", val)}
                unique
                renderItem={(item) => <>{getCountryName(item.country)}</>}
                schema={{
                    country: {
                        type: "text",
                        inputType: "country",
                        placeholder: "Выберите страну",
                    },
                }}
            />
            <EditableList<Country>
                title="Налоговое резиденство"
                items={person.taxResidency}
                error={errors.includes("taxResidency")}
                onChange={(val) => updateField("taxResidency", val)}
                unique
                renderItem={(item) => <>{getCountryName(item.country)}</>}
                schema={{
                    country: {
                        type: "text",
                        inputType: "country",
                        placeholder: "Выберите страну",
                    },
                }}
            />

            <VariantPicker<string>
                title="Является публичным лицом?"
                options={YESNO}
                value={person.isPublic}
                onChange={(val) => updateField("isPublic", val as YesNo)}
                mode="single"
            />

            <VariantPicker<string>
                title="Является аффилированным лицом?"
                options={YESNO}
                value={person.isAffiliated}
                onChange={(val) => updateField("isAffiliated", val as YesNo)}
                mode="single"
            />

            <FormField
                id="share"
                error={errors.includes("share")}
                label="Доля (%)"
                value={person.share}
                onChange={(val) => updateField("share", val as string)}
                required
                type="number"
            />

            <EditableList<PhoneNumber>
                title="Номера телефонов"
                items={person.phoneNumbers}
                error={errors.includes("phoneNumbers")}
                onChange={(val) => updateField("phoneNumbers", val)}
                unique
                renderItem={(item) => (
                    <>
                        {item.number} —{" "}
                        {item.usage === "personal" ? "Личный" : "Рабочий"}
                    </>
                )}
                schema={{
                    number: {
                        placeholder: "Номер телефона",
                        type: "text",
                    },
                    usage: {
                        type: "variant",
                        options: PHONE_USAGES,
                    },
                }}
            />

            <FormField
                id="email"
                label="Электронная почта"
                value={person.email}
                error={errors.includes("email")}
                onChange={(val) => updateField("email", val as string)}
                placeholder="Электронная почта"
                type="email"
                required
            />

            <Button onClick={handleSave} type="button" className="mt-1">
                Сохранить
            </Button>
        </Fieldset>
    );
};

export default PersonForm;
