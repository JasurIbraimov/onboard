import axios, { type AxiosInstance } from "axios";
import type { MerchantResponse, OkedResponse, MerchantType } from "../types/index.type"; // твои типы


class MerchantAPI {

    private api: AxiosInstance;

    constructor(baseURL = "https://gateway.kompra.kz/company", timeout = 10000) {
        this.api = axios.create({
            baseURL,
            timeout
        });

        this.initInterceptors();
    }

    // ------- Public API --------

    async fetchByIdentifier(identifier: string): Promise<MerchantResponse | null> {
        try {
            const res = await this.api.get(`/${identifier}`);
            return this.transformApiData(identifier, res.data);
        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    // ------- Interceptors --------

    private initInterceptors(): void {
        this.api.interceptors.response.use(
            response => response,
            error => {
                console.warn("API response error:", error?.response?.status);
                return Promise.reject(error);
            }
        );
    }

    // ------- Transformer --------
    private transformApiData(identifier: string, data: any): MerchantResponse {

        const fullName = data.full_name || "";

        return {
            identifier,
            name: data.name,
            full_name: data.full_name || null,
            law_address: this.formatLawAddress(data.law_address || "", this.normalizeRegion(data.region)),
            register_date: this.parseDate(data.register_date),
            last_register_date: this.parseDate(data.last_register_date),
            main_oked: this.buildOked(data.oked),
            extra_okeds: this.parseSecondaryOkeds(data.secondary_oked),
            kbe: data.kbe || null,
            region: this.normalizeRegion(data.region),
            type: this.detectCompanyType(fullName, data.ip, data.type),
        };
    }

    // ------- Helpers --------

    private detectCompanyType(fullName: string, isIp: boolean, apiType?: string): MerchantType {
        const lower = fullName.toLowerCase();

        if (isIp) return "IP";
        if (lower.includes("товарищество с ограниченной ответственностью")) return "TOO";
        if (lower.includes("акционерное общество")) return "AO";

        return (apiType as MerchantType) ?? "TOO"; // default на TOO
    }

    private buildOked(okedData: any): OkedResponse | null {
        if (!okedData || !okedData.code) return null;

        return {
            code: String(okedData.code),
            name_ru: okedData.name_ru,
        };
    }

    private parseSecondaryOkeds(raw?: string): OkedResponse[] {
        if (!raw) return [];

        return raw.split(",")
            .map(code => code.trim())
            .filter(code => code)
            .map(code => ({
                code: code,
                name_ru: ""
            }));
    }

    private parseDate(dateStr?: string): string | null {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? null : d.toISOString().split("T")[0];
    }

    private normalizeRegion(region?: string): string | null {
        return region ? region.trim() : null;
    }

    private formatLawAddress(address: string, region?: string | null): string | null {
        if (!address && !region) return null;
        return region ? `${region}, ${address}` : address;
    }

    private handleError(error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("[MerchantAPI]", error.response?.status, error.message);
        } else {
            console.error("[MerchantAPI] Unknown error:", error);
        }
    }

}


export default new MerchantAPI();