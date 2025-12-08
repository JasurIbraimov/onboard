import { useState } from "react";
import {
    type WorkScheme,
    type MerchantResponse,
    type PersonData,
    type BankData,
    Steps,
    type AgreementType,
} from "./types/index.type";

import Nav from "./components/Nav/Nav";
import VariantPicker from "./components/VariantPicker/VariantPicker";
import toast, { Toaster } from "react-hot-toast";
import Button from "./components/Button/Button";
import MerchantForm from "./features/MerchantForm/MerchantForm";
import PersonForm from "./features/PersonForm/PersonForm";
import BankForm from "./features/BankForm/BankForm";
import Fieldset from "./components/FormField/Fieldset";
import { api } from "./api";
import { LuPlus, LuTriangleAlert } from "react-icons/lu";
import Modal from "./components/Modal/Modal";
import { AGREEMENT_TYPES, SYSTEM_TYPES } from "./constants";
import PersonsTable from "./features/PersonsTable/PersonsTable";


const App = () => {
    const StepOrder: Steps[] = [
        Steps.FORMAT,
        Steps.MERCHANT,
        Steps.INDIVIDUALS,
        Steps.BANK,
    ];

    const [step, setStep] = useState<Steps>(Steps.FORMAT);
    const [workSchemes, setWorkSchemes] = useState<WorkScheme[]>([]);
    const [agreementTypes, setAgreementTypes] =
        useState<AgreementType[]>([]);

    const [merchant, setMerchant] = useState<MerchantResponse | null>(null);
    const [bankData, setBankData] = useState<BankData | null>(null);
    const [persons, setPersons] = useState<PersonData[]>([]);
    const [currentPerson, setCurrentPerson] = useState<PersonData | null>(null);
    const [loading] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [isPersonFormOpen, setIsPersonFormOpen] = useState(false);

    const handleEditPerson = (person: PersonData, index: number) => {
        setCurrentPerson(person);
        setIsPersonFormOpen(true);
        setEditIndex(index);
    };


    const handleGenerate = async () => {
        try {
            console.log(window.electronAPI)
            const outputPath = await window.electronAPI.generateDoc({
            company: {
                name: "ТОО ТЕСТОВЫЙ СЕРВИС",
                region: "Республика Казахстан",
                id: "100100100100",
                kbe: 17,
                url: "https://test.kz",
                okeds: "4910 - Тест"
            }
        })
            console.log("Документ создан:", outputPath);
        } catch (err) {
            console.error("Ошибка генерации DOCX:", err);
        }
    

    }

    const handleAddPerson = (person: PersonData) => {
        if (editIndex !== null) {
            // Редактирование
            setPersons((prev) =>
                prev.map((p, i) => (i === editIndex ? person : p))
            );
            toast.success("Данные физического лица обновлены");
        } else {
            // Добавление
            setPersons((prev) => [...prev, person]);
            toast.success("Физическое лицо успешно добавлено");
        }
        setIsPersonFormOpen(false);
        setEditIndex(null);
        setCurrentPerson(null);
    };

    const goNextStep = () => {
        const currentIndex = StepOrder.indexOf(step);
        const nextStep = StepOrder[currentIndex + 1];
        if (nextStep) setStep(nextStep);
    };

    const goPreviousStep = () => {
        const currentIndex = StepOrder.indexOf(step);
        const prevStep = StepOrder[currentIndex - 1];
        if (prevStep) setStep(prevStep);
    };

    // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();

    //     if (!merchant?.identifier) {
    //         toast.error("Введите корректный БИН (12 цифр)");
    //         return;
    //     }
    //     if (!bankData?.iik || !bankData.bank) {
    //         toast.error("Заполните банковские реквизиты");
    //         return;
    //     }
    //     if (persons.length === 0) {
    //         toast.error("Добавьте хотя бы одного человека");
    //         return;
    //     }

    //     try {
    //         setLoading(true);

    //         await api.generateApplication({
    //             merchant,
    //             persons,
    //             bank: bankData,
    //         });

    //         toast.success("Заявление успешно сгенерировано");
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Ошибка при генерации приложения");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const handleDeletePerson = (index: number) => {
        // Создаем переменную для отмены

        // Показываем toast с таймером и кнопкой "Отмена"
        toast(
            (t) => (
                <div className="flex items-center gap-2">
                    <span>Удалить это лицо?</span>
                    <Button
                        variant="error"
                        onClick={() => {
                            setPersons((prev) =>
                                prev.filter((_, i) => i !== index)
                            );
                            toast.success("Физическое лицо удалено");
                            toast.dismiss(t.id);
                        }}
                    >
                        Удалить
                    </Button>
                    <Button
                        onClick={() => {
                            toast.dismiss(t.id); // скрываем уведомление
                        }}
                    >
                        Отменить
                    </Button>
                </div>
            ),
            {
                duration: 5000, // 5 секунд таймер
                style: { padding: "8px 12px" },
                icon: <LuTriangleAlert />,
                position: "top-center",
            }
        );
    };

    const stepForm =
        step === Steps.FORMAT ? (
            <Fieldset legend="Формат приложения">
                <VariantPicker<WorkScheme>
                    options={SYSTEM_TYPES}
                    value={workSchemes}
                    mode="multiple"
                    onChange={(value) => setWorkSchemes(value as WorkScheme[])}
                    title="Схема работы"
                />
                <VariantPicker<AgreementType>
                    options={AGREEMENT_TYPES}
                    value={agreementTypes}
                    mode="multiple"
                    onChange={(value) =>
                        setAgreementTypes(value as AgreementType[])
                    }
                    title="Вид договора"
                />
            </Fieldset>
        ) : step === Steps.MERCHANT ? (
            <MerchantForm value={merchant} onChange={setMerchant} />
        ) : step === Steps.INDIVIDUALS ? (
            <Fieldset legend="Физические лица">
                <Button
                    type="button"
                    variant="accent"
                    onClick={() => {
                        setIsPersonFormOpen(true);
                        setEditIndex(null);
                        setCurrentPerson(null);
                    }}
                >
                    Добавить <LuPlus />
                </Button>
                <Modal
                    isOpen={isPersonFormOpen}
                    onClose={() => {
                        setIsPersonFormOpen(false);
                        setCurrentPerson(null);
                    }}
                >
                    {/* Добавление людей */}
                    <PersonForm
                        onSave={handleAddPerson}
                        prepopulate={currentPerson}
                        key={
                            currentPerson
                                ? currentPerson.idData?.iin + "_" + Date.now()
                                : Date.now()
                        }
                    />
                </Modal>

                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 mt-5">
                    {persons.length > 0 && (
                        <PersonsTable
                            persons={persons}
                            onDeletePerson={handleDeletePerson}
                            onEditPerson={handleEditPerson}
                        />
                    )}
                </div>
            </Fieldset>
        ) : (
            <>
                {/* Банковыские реквизиты */}
                <BankForm onChange={setBankData} data={bankData} />
            </>
        );

    return (
        <div className="">
            <Toaster position="top-center" />
            <Nav />
            <main className="container relative">
                <p className="font-bold bg-base-300 rounded-full text-sm left-[101%] top-2 size-10 flex items-center justify-center">
                    {StepOrder.indexOf(step) + 1}/{StepOrder.length}
                </p>
                <form
                    // onSubmit={handleSubmit}
                    className="flex flex-col gap-2 mt-2"
                >
                    {stepForm}
                    <Fieldset className="flex gap-4">
                        {StepOrder.indexOf(step) > 0 && (
                            <Button type="button" onClick={goPreviousStep}>
                                Назад
                            </Button>
                        )}
                        {StepOrder.indexOf(step) < StepOrder.length - 1 ? (
                            <Button
                                loading={loading}
                                type="button"
                                onClick={goNextStep}
                            >
                                Вперед
                            </Button>
                        ) : (
                            <>
                                <Button loading={loading} type="button" onClick={handleGenerate}>
                                    Сгенерировать
                                </Button>
                            </>
                        )}
                    </Fieldset>
                </form>
            </main>
        </div>
    );
};

export default App;
