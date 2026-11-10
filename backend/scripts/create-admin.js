// Pakai (dari folder backend):
//   node scripts/create-admin.js "Nama Admin" admin@contoh.com PasswordKuat123
require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("../src/config/database");

(async () => {
    const [name, email, password] = process.argv.slice(2);
    if (!name || !email || !password) {
        console.error('Pakai: node scripts/create-admin.js "Nama" email password');
        process.exit(1);
    }
    const hash = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hash, "admin"]);
    console.log(`Admin ${email} dibuat.`);
    process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
