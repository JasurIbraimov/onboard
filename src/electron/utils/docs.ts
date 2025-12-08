import fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import path from "path";


export function generateDoc(data: any) {
    const templatePath = path.join(__dirname, "src/electron/templates/Пр1_Заявление_Мерчанты_ЮЛ СЭП.doc");
    const content = fs.readFileSync(templatePath, "binary");

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    doc.render(data);

    const buffer = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
    });

    const outputPath = path.join(__dirname, "output.docx");
    fs.writeFileSync(outputPath, buffer);

    return outputPath;
}
