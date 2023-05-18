import path from "path";
import * as bcrypt from "bcrypt";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateHash(text) {
    const hash = await bcrypt.hash(text, 10);
    return hash;
}

async function compareHash(text, hash) {
    const result = await bcrypt.compare(text, hash);
    return result;
}

export {
    __filename,
    __dirname,
    generateHash,
    compareHash
};
