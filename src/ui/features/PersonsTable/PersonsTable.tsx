import type { PersonData } from "../../types/index.type";
import { countryNames } from "../../utils";
import { LuCheck, LuPen, LuTrash, LuX } from "react-icons/lu";
import Button from "../../components/Button/Button";

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
                    <th>Должность</th>
                    <th>Удостоверение личности</th>
                    <th>Дата рождения</th>
                    <th>Гражданство</th>
                    <th>Налоговое резиденство</th>
                    <th>Публичное лицо?</th>
                    <th>Аффилированное лицо?</th>
                    <th>Доля (%)</th>
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
                        <td>{p.post}</td>
                        <td>
                            ИИН: {p.idData?.iin}
                            <br />
                            Номер удостоверения: {p.idData?.id_number}
                            <br />
                            Дата выдачи: {p.idData?.id_issue_date}
                            <br />
                            Срок действия: {p.idData?.id_expiry_date}
                            <br />
                            Кем выдано: {p.idData?.id_issuer}
                        </td>
                        <td>{p.idData?.birth_date}</td>
                        <td>
                            {p.citizenships.map((citizenship) => (
                                <p key={citizenship.country}>
                                    {countryNames[citizenship.country]}
                                </p>
                            ))}
                        </td>
                        <td>
                            {p.taxResidency.map((taxResidency) => (
                                <p key={taxResidency.country}>
                                    {countryNames[taxResidency.country]}
                                </p>
                            ))}
                        </td>
                        <td>{p.isPublic === "yes" ? <LuCheck /> : <LuX />}</td>
                        <td>
                            {p.isAffiliated === "yes" ? <LuCheck /> : <LuX />}
                        </td>
                        <td>{p.share}%</td>
                        <td>
                            {p.phoneNumbers.map((phone) => (
                                <p key={phone.number}>
                                    {phone.number} - {phone.usage}
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
