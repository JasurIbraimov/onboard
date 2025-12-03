import axios, { type AxiosInstance } from "axios";
import type {
    Application,
    IdDataResponse,
    MerchantResponse,
} from "../types/index.type";
import { getCountryName } from "../utils";
class Api {
    private client: AxiosInstance;

    constructor(baseURL = import.meta.env.VITE_API_URL) {
        this.client = axios.create({
            baseURL,
            timeout: 10000,
        });

        // Перехватчик ошибок
        this.client.interceptors.response.use(
            (res) => res,
            (err) => {
                const msg =
                    err.response?.data?.error ||
                    err.message ||
                    "Ошибка при запросе к API";
                return Promise.reject(new Error(msg));
            }
        );
    }

    /** 🔹 Распознавание ID через OCR */
    async parseId(idFile: File): Promise<IdDataResponse | null> {
        const formData = new FormData();
        formData.append("file", idFile);

        try {
            const response = await this.client.post<IdDataResponse>(
                "/parse-id/",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return response.data;
        } catch (error) {
            // 🔹 OCR не сработал → нужно ручное заполнение
            if (error instanceof Error && error.message.includes("401")) {
                return null;
            }
            throw error;
        }
    }

    /** 🔹 Поиск мерчанта по BIN/IIN */
    async searchByIdentifier(
        identifier: string
    ): Promise<MerchantResponse | null> {
        try {
            const response = await this.client.post<MerchantResponse>(
                "/search-by-identifier/",
                { bin: identifier }
            );
            return response.data;
        } catch (error) {
            if (error instanceof Error && error.message.includes("404")) {
                return null; // нужен ручной ввод
            }
            throw error;
        }
    }

    /** 🔹 Генерация заявки (скачивание docx) */
    async generateApplication(application: Application) {
        const formData = new FormData();

        formData.append(
            "merchant",
            JSON.stringify({
                ...application.merchant,
                region: getCountryName(application.merchant.region as string),
            })
        );
        formData.append(
            "persons",
            JSON.stringify(
                application.persons.map((person) => ({
                    ...person,
                    citizenships: person.citizenships.map((item) =>
                        getCountryName(item.country)
                    ),
                    taxResidency: person.taxResidency.map((item) =>
                        getCountryName(item.country)
                    ),
                }))
            )
        );
        formData.append(
            "bank",
            JSON.stringify({
                iik: application.bank.iik,
                name: application.bank.bank.label,
                bik: application.bank.bank.value,
            })
        );

        console.log(application);
        const response = await this.client.post("/application/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            responseType: "blob", // чтобы скачать файл
        });

        // Создаём файл на фронте
        const blob = new Blob([response.data], {
            type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;

        let filename = "Приложение_заполненное.docx";
        const disposition = response.headers["content-disposition"];
        if (disposition && disposition.includes("filename=")) {
            filename = disposition.split("filename=")[1].replace(/"/g, "");
        }

        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}

export const api = new Api();
