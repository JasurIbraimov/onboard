import type { PersonData } from "../../types/index.type";
import { getCountryName } from "../../utils";
import { LuCheck, LuPen, LuTrash, LuX } from "react-icons/lu";
import Button from "../../components/Button/Button";
import { PHONE_USAGES, ROLES } from "../../constants";

interface IProps {
    persons: PersonData[];
    onEditPerson: (person: PersonData, index: number) => void;
    onDeletePerson: (index: number) => void;
}

const PersonsTable = ({ persons, onDeletePerson, onEditPerson }: IProps) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>ФИО</th>
                    <th>Роли</th>
                    <th>Доля (%)</th>
                    <th>Должность</th>
                    <th>Удостоверение личности</th>
                    <th>Дата рождения</th>
                    <th>Гражданство</th>
                    <th>Налоговое резиденство</th>
                    <th>Публичное лицо?</th>
                    <th>Аффилированное лицо?</th>
                    <th>Контактное лицо?</th>
                    <th>Номера телефонов</th>
                    <th>Электронная почта</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                {persons.map((p, i) => (
                    <tr key={i}>
                        <td>
                            {p.idData?.surname} {p.idData?.name}{" "}
                            {p.idData?.patronymic}
                        </td>
                        <td>
                            {p.roles.map(role => (
                                <p key={role}>{ROLES.find(r => r.role === role)?.label}</p>))}
                        </td>
                        <td>{p.share}</td>
                        <td>{p.post}</td>
                        <td>
                            ИИН: {p.idData?.iin}
                            <br />
                            Номер удостоверения: {p.idData?.idNumber}
                            <br />
                            Дата выдачи: {p.idData?.issueDate}
                            <br />
                            Срок действия: {p.idData?.expiryDate}
                            <br />
                            Кем выдано: {p.idData?.issuer}
                        </td>
                        <td>{p.idData?.birthDate}</td>
                        <td>
                            {p.citizenships.map(({ country }) => (
                                <p key={country}>
                                    {getCountryName(country)}
                                </p>
                            ))}
                        </td>
                        <td>
                            {p.taxResidency.map(({ country }) => (
                                <p key={country}>
                                    {getCountryName(country)}
                                </p>
                            ))}
                        </td>
                        <td>{p.isPublic ? <LuCheck /> : <LuX />}</td>
                        <td>
                            {p.isAffiliated ? <LuCheck /> : <LuX />}
                        </td>
                        <td>
                            {p.isContact ? <LuCheck /> : <LuX />}
                        </td>
                        <td>
                            {p.phoneNumbers.filter(phone => phone.usage === "work").map((phone) => (
                                <p key={phone.number}>
                                    {PHONE_USAGES.find(p => p.value === phone.usage)?.label}: {phone.number}
                                </p>
                            ))}
                            {p.phoneNumbers.filter(phone => phone.usage === "personal").map((phone) => (
                                <p key={phone.number}>
                                    {PHONE_USAGES.find(p => p.value === phone.usage)?.label}: {phone.number}
                                </p>
                            ))}
                        </td>
                        <td>{p.email}</td>
                        <td>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="accent"
                                    onClick={() => onEditPerson(p, i)}
                                >
                                    <LuPen />
                                </Button>

                                <Button
                                    variant="error"
                                    onClick={() => onDeletePerson(i)}
                                    type="button"
                                >
                                    <LuTrash />
                                </Button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PersonsTable;
