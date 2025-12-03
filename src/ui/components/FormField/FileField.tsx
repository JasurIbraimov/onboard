import clsx from "clsx";
import React, { useEffect, useState, type ReactNode } from "react";
import { LuImage } from "react-icons/lu";

interface FileFieldProps {
    file?: File | null;
    onChange?: (file: File | null) => void;
    actions?: ReactNode;
    id?: string;
    error?: boolean
}

const FileField = ({
    id,
    onChange,
    file: providedFile,
    actions,
    error,
    ...props
}: FileFieldProps) => {
    const [file, setFile] = useState<File | null | undefined>(providedFile);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const truncateFileName = (fileName: string) => {
        if (fileName.length <= 20) return fileName;

        const lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex === -1) {
            return fileName.slice(0, 20) + "...";
        }

        const name = fileName.slice(0, lastDotIndex);
        const ext = fileName.slice(lastDotIndex + 1);

        return name.slice(0, 17) + "..." + ext;
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = e.target.files?.[0] ?? null;
        setFile(newFile);
        onChange?.(newFile);
    };

    useEffect(() => {
        if (!file) return setPreviewUrl(null);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    return (
        <div className="flex grow w-full items-center gap-2">
            <label
                htmlFor={id}
                className={clsx("relative grow w-full input h-fit min-h-10 overflow-hidden cursor-pointer", error && "border-error")}
            >
                {file && file.type.startsWith("image/") && (
                    <img
                        src={previewUrl as string}
                        alt="Предпросмотр"
                        className="mt-2 max-h-48 rounded shadow"
                    />
                )}
                <span className="text-gray-500 absolute w-full h-full flex items-center justify-center gap-2 top-0 left-0">
                    {!file ? (
                        <>
                            Выберите файл <LuImage />
                        </>
                    ) : !file.type.startsWith("image/") ? (
                        <>
                            Выберите другой файл <LuImage />
                        </>
                    ) : null}
                </span>
            </label>

            <input
                id={id}
                type="file"
                className="hidden"
                onChange={handleOnChange}
                {...props}
            />

            {file && (
                <p className="text-blue-400">{`Вы выбрали: ${truncateFileName(
                    file.name
                )}`}</p>
            )}
            {actions}
        </div>
    );
};

export default FileField;
