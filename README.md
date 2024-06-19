# SERVER
# server.mjs
1. Importo komandos
`import express from "express";`Paskirtis: Importuoja Express modulį, kuris naudojamas serveriui kurti ir maršrutams valdyti.

`import dotenv from "dotenv";`Paskirtis: Importuoja dotenv modulį, kad įkeltų aplinkos kintamuosius iš .env failo į process.env.

`import passport from "./strategies/auth.mjs";` Paskirtis: Importuoja autentifikavimo strategijas iš vietinio auth.mjs failo, esančio strategies kataloge.

`import { connectDB } from "./db/postgresConnection.mjs";` Paskirtis: Importuoja funkciją connectDB iš postgresConnection.mjs failo, kuris atsakingas už prisijungimą prie PostgreSQL duomenų bazės.

`import usersRouter from "./routes/index.mjs";` ir`import excursionsRouter from "./routes/index.mjs";` Paskirtis: Importuoja maršrutus iš index.mjs failo, esančio routes kataloge. Pastaba: abu maršrutai importuojami iš to paties failo, nors paprastai tai būtų skirtingi failai skirtingoms maršrutų grupėms.

`import cors from "cors";` Paskirtis: Importuoja CORS modulį, kad leistų nustatyti tarpinių serverių užklausų valdymą.

2. dotenv konfigūravimas
`dotenv.config();` Paskirtis: Įkrauna aplinkos kintamuosius iš .env failo į process.env, kad jie būtų prieinami programoje.

3. Express programos kūrimas
`const app = express();` Paskirtis: Sukuria naują Express programos egzempliorių.

4. Serverio paleidimo funkcija
`const startServer = async () => {`
  `try {`
    `const message = await connectDB();`
    `console.log(message);` Paskirtis: Sukuria asinchroninę funkciją, kuri paleidžia serverį ir prisijungia prie duomenų bazės. Bando prisijungti prie duomenų bazės ir atspausdina pranešimą, jei pavyksta.

`app.use(`
     ` cors({`
        `origin: "http://localhost:3000", // Change this to your frontend URL`
        `credentials: true, // Allow cookies and authorization headers`
      `})`
    `);` Paskirtis: Nustato CORS taisykles, kad leistų užklausas iš jūsų frontend domeno (http://localhost:3000)Leisti naudoti slapukus ir autorizacijos antraštes.

`app.use(express.json()); ` Paskirtis: Nustato Express programą naudoti JSON užklausų kūnui analizuoti. Ši komanda turi būti prieš maršrutų apibrėžimą.

`app.use(passport.initialize());`Paskirtis: Inicializuoja Passport autentifikavimo sistemą.

`app.use("/api/vilniustour", usersRouter, excursionsRouter);`Paskirtis: Nustato maršrutus programoje. Visi maršrutai, pradedantys /api/vilniustour, bus tvarkomi usersRouter ir excursionsRouter.

`const PORT = process.env.PORT || 3000;`Paskirtis: Nustato serverio klausymo prievadą. Jei process.env.PORT yra nustatytas, naudoja jį, kitaip naudoja 3000 prievadą.

`app.listen(PORT, () => {`
      `console.log(`Server is listening on port ${PORT}`);`
   ` });` 
  `} catch (error) {`
    `console.error("Failed to connect to the server or database", error);`
 ` }`
`};`
Paskirtis: Paleidžia serverį ir klauso nurodyto prievado. Atspausdina pranešimą, kad serveris veikia ir klauso nurodyto prievado. Paskirtis: Gaudo bet kokias klaidas, kurios įvyksta bandant paleisti serverį arba prisijungti prie duomenų bazės, ir atspausdina klaidos pranešimą.

5. Serverio paleidimas
`startServer();` Paskirtis: Iškviečia startServer funkciją, kad paleistų serverį ir prisijungtų prie duomenų bazės.

# .env
`.env` failas yra naudojamas konfigūracijos kintamiesiems saugoti. Šie kintamieji yra naudojami jūsų programoje, kad būtų galima nustatyti duomenų bazės ryšį, serverio prievadą, slapto rakto reikšmę ir kt. Failo turinys yra paprastas tekstas, kuriame kiekvienas kintamasis yra priskirtas savo reikšmei.

1. Duomenų bazės konfigūracijos kintamieji
`DB_USER=postgres` Paskirtis: Nustato vartotojo vardą, kuris bus naudojamas prisijungti prie PostgreSQL duomenų bazės. Šiuo atveju vartotojo vardas yra postgres.

`DB_HOST=localhost` Paskirtis: Nustato duomenų bazės serverio adresą. localhost reiškia, kad duomenų bazė veikia tame pačiame kompiuteryje kaip ir jūsų aplikacija.

`DB_NAME=VilniusTours` Paskirtis: Nustato duomenų bazės pavadinimą, prie kurios jūsų aplikacija prisijungs. Šiuo atveju duomenų bazės pavadinimas yra VilniusTours.

`DB_PASSWORD=0195` Paskirtis: Nustato slaptažodį, kuris bus naudojamas prisijungti prie PostgreSQL duomenų bazės su nurodytu vartotojo vardu.

2. Serverio konfigūracijos kintamasis
`PORT=3000` Paskirtis: Nustato prievadą, kuriame jūsų serveris klausys užklausų. Šiuo atveju prievadas yra 3000.

3. JWT (JSON Web Token) konfigūracijos kintamasis
`JWT_SECRET=myjwtsecretkey` Paskirtis: Nustato slapto rakto reikšmę, kuri naudojama JWT generavimui ir patikrinimui. Šis raktas turėtų būti laikomas paslaptyje ir niekada neturėtų būti dalijamasi su kitais, nes jis yra naudojamas saugumo tikslais.

Kaip šie kintamieji naudojami programoje?
Naudojant dotenv paketą, šie kintamieji yra įkraunami į process.env, kad juos būtų galima naudoti jūsų Node.js aplikacijoje. Štai kaip tai atrodo:
`import dotenv from "dotenv";`
Įkrauname kintamuosius iš .env failo į process.env
dotenv.config();

const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbPassword = process.env.DB_PASSWORD;
const port = process.env.PORT;
const jwtSecret = process.env.JWT_SECRET;

console.log(`Prisijungimo duomenys: Vartotojas - ${dbUser}, Pavadinimas - ${dbName}`);
Kai jūsų aplikacija paleidžiama, dotenv.config() funkcija įkrauna kintamuosius iš .env failo į process.env, todėl jūs galite juos pasiekti visur savo programoje naudodami process.env.KINTAMASIS.

Tai leidžia lengvai konfigūruoti jūsų aplikaciją ir apsaugoti jautrią informaciją, nes .env failas paprastai nėra įtraukiamas į versijų valdymo sistemą (pvz., git), todėl jis nėra viešai prieinamas.

# validators
Tikrina duomenų galiojimą. Ar jie sudaryti pagal reikalavimus numatytus.
1. `excursionValidator.mjs`
Šis failas yra skirtas tikrinti ekskursijų duomenis naudojant express-validator modulį. `checkSchema` funkcija leidžia apibrėžti tikrinimo taisykles tam tikriems laukams.

`import { checkSchema } from "express-validator";` Paskirtis: Importuoja checkSchema funkciją iš express-validator modulio. Ši funkcija naudojama tikrinimo schemos apibrėžimui.
`export const excursionValidationSchema = checkSchema({...});` Paskirtis: Eksportuoja tikrinimo schemą, kuri naudojama ekskursijų duomenims tikrinti.

Paaiškinimai
`trim:` Pašalina tarpus iš pradžios ir pabaigos.
`isLength: options:` Nustato, kad lauko ilgis turi būti nuo 2 iki 50 simbolių.
`errorMessage:` Klaidos pranešimas, jei lauko ilgis neatitinka reikalavimų.
`isString:` Patikrina, ar laukas yra eilutė.
`errorMessage:` Klaidos pranešimas, jei laukas nėra eilutė.
`price: isNumeric:` Patikrina, ar laukas yra skaitinis.
`errorMessage: `Klaidos pranešimas, jei laukas nėra skaitinis.
`duration:isInt:` Patikrina, ar laukas yra sveikasis skaičius.
`errorMessage:` Klaidos pranešimas, jei laukas nėra sveikasis skaičius.
`image: optional:` Laukas nėra privalomas.
`isURL:` Patikrina, ar laukas yra galiojantis URL.
`errorMessage:` Klaidos pranešimas, jei laukas nėra galiojantis URL.

2. `userValidator.mjs`
Šis failas yra skirtas tikrinti vartotojų duomenis naudojant express-validator modulį. Jame apibrėžiamos dvi tikrinimo schemos: viena vartotojo registracijai, kita – prisijungimui (login).

Importuoja `checkSchema` ir param iš express-validator modulio. checkSchema naudojama tikrinimo schemoms kurti.
Importuoja `userModel`, kuris naudojamas tikrinant, ar el. paštas jau egzistuoja duomenų bazėje.

Šiame pavyzdyje, kai POST užklausa siunčiama į /register arba /login maršrutus, duomenys yra tikrinami pagal atitinkamas tikrinimo schemas. Jei yra klaidų, jos grąžinamos kaip atsakymas su klaidų sąrašu. Jei klaidų nėra, duomenys apdorojami toliau.
Tai padeda užtikrinti, kad į jūsų sistemą patektų tik galiojantys duomenys, atitinkantys nustatytas taisykles.

# strategies
Naudojamas autentifikavimo ir autorizacijos strategijoms apibrėžti.
`auth.mjs:` Bendras autentifikavimo strategijų apibrėžimas.
`jwtStrategy.mjs:` JWT (JSON Web Token) autentifikavimo strategija.
`localStrategy.mjs:` Vietinė autentifikavimo strategija (pvz., vartotojo vardo ir slaptažodžio pagrindu).

1. `auth.mjs`
Importuoja `passport` modulį, kuris naudojamas autentifikavimui.
Importuoja vietinę strategiją iš `localStrategy.mjs`.
Importuoja funkciją `createJwtStrategy` iš `jwtStrategy.mjs`, kuri sukuria ir grąžina JWT strategiją.
Paskirtis: Sukuria asinchroninę funkciją `initializePassport`, kuri inicializuoja Passport ir prideda autentifikavimo strategijas.
`passport.use(localStrategy)`: Prideda vietinę strategiją prie Passport.
`const jwtStrategy = await createJwtStrategy():` Asinchroniškai sukuria JWT strategiją ir priskiria ją kintamajam jwtStrategy.
`passport.use(jwtStrategy):` Prideda JWT strategiją prie Passport.

2. `jwtStrategy.mjs`
Importuoja J`wtStrategy` ir `ExtractJwt` iš `passport-jwt` modulio. JwtStrategy yra strategija, naudojama autentifikavimui su JSON Web Token, o ExtractJwt yra naudojamas išgauti JWT iš užklausos antraštės.
Importuoja `dotenv` modulį, kad galėtų įkelti aplinkos kintamuosius.
Importuoja `userModel`, kuris naudojamas vartotojo duomenims gauti iš duomenų bazės.

`jwtFromRequest: `Nurodo, kaip išgauti JWT iš užklausos. Šiuo atveju, JWT bus išgaunamas iš autorizacijos antraštės, kaip Bearer token.
`secretOrKey:` Slaptas raktas, naudojamas JWT patikrinimui. Jis gaunamas iš aplinkos kintamojo `JWT_SECRET`.

Apibrėžia asinchroninę funkciją `createJwtStrategy`, kuri sukuria ir grąžina JWT strategiją.
`jwtStrategy:` Sukuria naują JwtStrategy egzempliorių su pateiktomis parinktimis (opts).
`async (jwt_payload, done):` Asinchroninė funkcija, kuri yra iškviečiama, kai JWT yra iššifruotas.
`jwt_payload:` Dekoduotas JWT krovinys (payload).
`done:` Funkcija, kurią reikia iškviesti po autentifikavimo bandymo.
`const user = await userModel.getUserById(jwt_payload.id):` Bando rasti vartotoją pagal ID iš JWT krovinio.
`if (user):` Jei vartotojas rastas, grąžina vartotoją.
`else: `Jei vartotojas nerastas, grąžina false.
`catch (error):` Jei įvyksta klaida ieškant vartotojo, grąžina klaidą ir false.

3. `localStrategy.mjs` 
Importuoja `bcrypt`, naudojamą slaptažodžių palyginimui.
Importuoja `LocalStrategy` iš passport-local modulio, kuris naudojamas vietinei autentifikavimo strategijai sukurti.
Importuoja `userModel`, naudojamą vartotojo duomenims gauti iš duomenų bazės.

Apibrėžia ir sukuria vietinę autentifikavimo strategiją.
`LocalStrategy:` Konstruktorius, kuriantis naują LocalStrategy egzempliorių.
`usernameField: "login":` Nurodo lauką, kuris naudojamas kaip vartotojo vardas (šiuo atveju, el. paštas).
`passwordField: "password":` Nurodo lauką, kuris naudojamas kaip slaptažodis.
`async (login, password, done):` Asinchroninė funkcija, kuri yra iškviečiama, kai vartotojas bando prisijungti.
`login:` Vartotojo įvestas el. pašto adresas.
`password:` Vartotojo įvestas slaptažodis.
`done:` Funkcija, kurią reikia iškviesti po autentifikavimo bandymo.
`try: `Bando surasti vartotoją ir patikrinti slaptažodį.
`const user = await userModel.login({ email: login }):` Bando rasti vartotoją pagal el. pašto adresą.
`const match = await bcrypt.compare(password, user.password):` Palygina įvestą slaptažodį su duomenų bazėje išsaugotu slaptažodžiu.
`if (!match):` Jei slaptažodis neatitinka, grąžina klaidą.
`return done(null, false, { message: "Invalid credentials." }):` Grąžina klaidą, jei slaptažodis neteisingas.
`return done(null, user):` Jei slaptažodis teisingas, grąžina vartotoją.
`catch (error):` Jei įvyksta klaida ieškant vartotojo ar palyginant slaptažodį, grąžina klaidą.
`if (error.message === "User not found"):` Jei vartotojas nerastas, grąžina klaidą su pranešimu "User not found".
return done(error): Grąžina klaidą, jei įvyksta kita klaida.

# routes
Apibrėžia URL maršrutus ir susijusius valdiklius.
`excursions.mjs:` Maršrutai, susiję su ekskursijomis.
`index.mjs:` Pagrindinis maršrutų failas, gali jungti kitus maršrutus.
`registrations.mjs:` Maršrutai, susiję su registracijomis.
`schedule.mjs:` Maršrutai, susiję su tvarkaraščiais.
`users.mjs:` Maršrutai, susiję su vartotojais.

1. `excursions.mjs`
Maršrutų apibrėžimai
   1. Visų ekskursijų gavimas
`router.get("/", excursionsController.getExcursions);` Paskirtis: Apibrėžia GET maršrutą /, kuris iškviečia getExcursions metodą iš excursionsController ir grąžina visas ekskursijas.

   2. Vienos ekskursijos gavimas pagal ID
`router.get("/:id", excursionsController.getExcursionById);` Paskirtis: Apibrėžia GET maršrutą /:id, kuris iškviečia getExcursionById metodą iš excursionsController ir grąžina ekskursiją pagal nurodytą ID.

   3. Ekskursijos ištrynimas
`router.delete("/:id", excursionsController.deleteExcursion);` Paskirtis: Apibrėžia DELETE maršrutą /:id, kuris iškviečia deleteExcursion metodą iš excursionsController ir ištrina ekskursiją pagal nurodytą ID.

   4. Ekskursijos sukūrimas
`router.post(`
 ` "/",`
 ` validate(excursionValidationSchema),`
  `excursionsController.createExcursion`
`);` Paskirtis: Apibrėžia POST maršrutą /, kuris iškviečia createExcursion metodą iš excursionsController. Prieš iškvietimą, duomenys tikrinami naudojant validate funkciją ir excursionValidationSchema.

   5. Ekskursijos redagavimas
`router.patch(`
  `"/:id",`
 ` validate(excursionValidationSchema),`
  `excursionsController.updateExcursion`
`);` Paskirtis: Apibrėžia PATCH maršrutą /:id, kuris iškviečia updateExcursion metodą iš excursionsController. Prieš iškvietimą, duomenys tikrinami naudojant validate funkciją ir excursionValidationSchema.

   6. Atsiliepimo sukūrimas
`router.post("/:id/addreview", excursionsController.createReview);` Paskirtis: Apibrėžia POST maršrutą /:id/addreview, kuris iškviečia createReview metodą iš excursionsController ir sukuria atsiliepimą ekskursijai.

   7. Vidurkio gavimas
`router.get(`
 ` "/:id/average-rating",`
  `excursionsController.getAverageRatingForExcursion`
`);` Paskirtis: Apibrėžia GET maršrutą /:id/average-rating, kuris iškviečia getAverageRatingForExcursion metodą iš excursionsController ir grąžina ekskursijos vidutinį reitingą.

   8. Ekskursijos tvarkaraščio gavimas
`router.get("/:id/schedule", excursionsController.getExcursionSchedule);` Paskirtis: Apibrėžia GET maršrutą /:id/schedule, kuris iškviečia getExcursionSchedule metodą iš excursionsController ir grąžina ekskursijos tvarkaraštį.

   9. Ekskursijos tvarkaraščio atnaujinimas
r`outer.patch(`
  `"/:id/schedule",`
  `excursionsController.updateExcursionSchedule` 
`);` Paskirtis: Apibrėžia PATCH maršrutą /:id/schedule, kuris iškviečia updateExcursionSchedule metodą iš excursionsController ir atnaujina ekskursijos tvarkaraštį.

   10. Registracijos sukūrimas
`router.post("/:id/register", excursionsController.createRegistration);` Paskirtis: Apibrėžia POST maršrutą /:id/register, kuris iškviečia createRegistration metodą iš excursionsController ir sukuria registraciją ekskursijai.

   11. Registracijos būsenos gavimas
`router.get(`
 ` "/:id/registrationStatus",`
  `excursionsController.getRegistrationStatusForUser`
`);` Paskirtis: Apibrėžia GET maršrutą /:id/registrationStatus, kuris iškviečia getRegistrationStatusForUser metodą iš excursionsController ir grąžina vartotojo registracijos būseną ekskursijai.

Failas excursions.mjs apibrėžia įvairius maršrutus, susijusius su ekskursijomis, naudojant Express. Jis naudoja valdiklius (controllers), tikrinimo schemas (validators) ir viduriniąsias programines įrangas (middlewares), kad valdytų užklausas ir užtikrintų, jog duomenys būtų tinkamai tikrinami ir apdorojami.

2. `registrations.mjs:`
   1. Visų registracijų gavimas (admin)
`router.get("/admin/excursions", registrationsController.getAllRegistrations);` Paskirtis: Apibrėžia GET maršrutą /admin/excursions, kuris iškviečia getAllRegistrations metodą iš registrationsController ir grąžina visas registracijas. Šis maršrutasskirtas administratoriams.

   2. Registracijos patvirtinimas (admin)
`router.put(`
  `"/admin/confirm/:registrationId",`
  `registrationsController.confirmRegistration`
`);` Paskirtis: Apibrėžia PUT maršrutą /admin/confirm/:registrationId, kuris iškviečia confirmRegistration metodą iš registrationsController ir patvirtina registraciją pagal nurodytą registracijos ID. Šis maršrutas taip pat skirtas administratoriams.

   3. Registracijos detalių gavimas
`router.get("/details", registrationsController.getRegistrationsDetails);` Paskirtis: Apibrėžia GET maršrutą /, kuris iškviečia getRegistrationsDetails metodą iš registrationsController ir grąžina registracijų detales.

   4. Registracijų gavimas
`router.get("/list", registrationsController.getRegistrations);`
Paskirtis: Apibrėžia GET maršrutą /, kuris iškviečia getRegistrations metodą iš registrationsController ir grąžina registracijas. 

3. `schedule.mjs:`
   1. Ekskursijos tvarkaraščio gavimas pagal ID
`router.get("/:id", scheduleController.getExcursionSchedule);` Paskirtis: Apibrėžia GET maršrutą /:id, kuris iškviečia getExcursionSchedule metodą iš scheduleController ir grąžina ekskursijos tvarkaraštį pagal nurodytą ekskursijos ID.

   2. Naujos datos ir laiko ekskursijai pridėjimas
`router.post("/:id/addTimeSlot", scheduleController.addExcursionTimeSlot);` Paskirtis: Apibrėžia POST maršrutą /:id/addTimeSlot, kuris iškviečia addExcursionTimeSlot metodą iš scheduleController ir prideda naują laiko tarpsnį ekskursijai pagal nurodytą ekskursijos ID.

   3. Ekskursijos laiko tarpsnio ištrynimas
`router.delete(`
  `:id/deleteTimeSlot/:timeSlotId",`
  `scheduleController.deleteExcursionTimeSlot`
`);` Paskirtis: Apibrėžia DELETE maršrutą /:id/deleteTimeSlot/:timeSlotId, kuris iškviečia deleteExcursionTimeSlot metodą iš scheduleController ir ištrina nurodytą laiko tarpsnį pagal ekskursijos ir laiko tarpsnio ID.


`router.put('/:id/updateTimeSlot/:timeSlotId', scheduleController.updateExcursionTimeSlot);` Paskirtis: naudojamas ekskursijos laiko tarpsnio atnaujinimui, jei būtų aktyvus. Jei norite pridėti šį funkcionalumą, galite atkomentuoti šią eilutę ir sukurti atitinkamą metodą scheduleController.

4. `users.mjs`
   1. Vartotojo registracija
`router.post(`
  `"/register",`
  `userValidationSchema,`
  `(req, res, next) => {`
    `const errors = validationResult(req);`
    `if (!errors.isEmpty()) {`
     ` return res.status(400).json({ errors: errors.array() });`
   ` }`
    `next();`
  `},`
  `usersController.createUser`
`);` Paskirtis: Apibrėžia POST maršrutą /register, kuris registruoja naują vartotoją.
`userValidationSchema:` Tikrina užklausos duomenis pagal vartotojo registracijos schemą.
`validationResult:` Patikrina, ar yra klaidų tikrinant duomenis.
`usersController.createUser:` Jei nėra klaidų, iškviečia createUser metodą iš usersController, kad sukurtų naują vartotoją.

   2. Vartotojo prisijungimas
`router.post(`
  `"/login",`
  `validate(loginValidationSchema),`
  `passport.authenticate("local", { session: false }),`
  `isUser,`
  `(req, res) => {`
   ` const token = jwt.sign(`
    `  { id: req.user.id, name: req.user.name, role: req.user.role },`
      `process.env.JWT_SECRET,`
      `{ expiresIn: "1h" }`
   ` );`
    `res.status(200).json({ message: "Logged", token });`
  `},`
  `usersController.login`
`);` Paskirtis: Apibrėžia POST maršrutą /login, kuris autentifikuoja vartotoją.
`validate(loginValidationSchema):` Tikrina užklausos duomenis pagal prisijungimo schemą.
`passport.authenticate("local", { session: false }):` Autentifikuoja vartotoją naudojant vietinę strategiją.
`isUser:` Tikrina, ar vartotojas turi vartotojo rolę.
`jwt.sign:` Sukuria JWT, kuris grąžinamas vartotojui.
`usersController.login:` Jei autentifikacija sėkminga, iškviečia login metodą iš usersController.

   3. Vartotojo ekskursijų gavimas
`router.get("/my-excursions/:userId", usersController.getUserExcursions);` Paskirtis: `Apibrėžia GET maršrutą /my-excursions/:userId`, kuris grąžina vartotojo ekskursijas pagal vartotojo ID.
`usersController.getUserExcursions: `Iškviečia getUserExcursions metodą iš usersController.

   4. Vartotojo ekskursijų atšaukimas
`router.delete("/:registrationId", usersController.cancelRegistration);` Paskirtis: `Apibrėžia DELETE maršrutą /:registrationId`, kuris atšaukia vartotojo registraciją pagal registracijos ID.
`usersController.cancelRegistration:` Iškviečia cancelRegistration metodą iš usersController.

# models
# db
1. `postgrresConnection.mjs`
`import pg from 'pg';` Importuoja `pg` modulį PostgreSQL sąveikai
`import dotenv from 'dotenv';` Importuoja `dotenv` modulį, kad įkrautų aplinkos kintamuosius
`const { Pool } = pg;`Ištraukia `Pool` klasę iš `pg` modulio
`pool.on('connect', () => {`
  `console.log('Connected to the database');});` Išveda pranešimą, kai prisijungiama prie duomenų bazės
........................................................
# CLIENT
# main.jsx
`import React from 'react';` Importuoja React biblioteką
`import ReactDOM from 'react-dom/client';`Importuoja ReactDOM biblioteką, skirtą React komponentų renderinimui DOM medyje
`import App from './App.jsx';` Importuoja pagrindinį aplikacijos komponentą
`import './index.css';` Importuoja pagrindinius stilius
`import './reset.css';` Importuoja stilių reset failą, kuris pašalina numatytuosius naršyklės stilius
`import { BrowserRouter } from 'react-router-dom';` Importuoja BrowserRouter komponentą iš react-router-dom, skirtą maršrutizacijai
`import { AuthProvider } from './utils/AuthContext.jsx';` Importuoja AuthProvider komponentą, skirtą autentifikacijos kontekstui

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

1. Importai:
`React:` Reikalingas norint naudoti JSX ir kurti komponentus.
`ReactDOM:` Leidžia renderinti React komponentus į DOM medį.
`App: `Importuoja pagrindinį aplikacijos komponentą.
`CSS failai:` Importuoja stilius. index.css - bendri stiliai, reset.css - naršyklės numatytųjų stilių pašalinimas.
`BrowserRouter: `React Router komponentas, skirtas maršrutizacijai.
`AuthProvider:` Konteksto teikėjas, skirtas autentifikacijai valdyti.

2. Renderinimas:
`ReactDOM.createRoot: `Sukuria root elementą, kuriame bus renderinama aplikacija.
`React.StrictMode:` Naudojamas vystymo metu, kad aptiktų galimas problemas.
`BrowserRouter:` Apvynioja visą aplikaciją, suteikdamas maršrutizaciją.
`AuthProvider:` Apvynioja App komponentą, suteikdamas autentifikacijos kontekstą.
`App:` Pagrindinis komponentas, kuriame bus visa aplikacija.

# Components
1. Importai:
`axios:` Naudojamas HTTP užklausoms.
`useContext, useState:` React hooks naudojami kontekstui ir būsenai valdyti.
`useNavigate, useParams:` React Router hooks, naudojami navigacijai ir URL parametrams gauti.
`styled-components:` Naudojama kurti styled komponentus.
`SyncLoader:` Pakrovimo indikatorius iš react-spinners.
`AuthContext:` Naudojamas autentifikacijos kontekstui.
`useState:` React hook, naudojamas komponento būsenai valdyti.

2. Styled komponentai:
`ReviewContainer:` Pagrindinis konteineris.
`StyledForm:` Forma.
`FormField:` Formos laukas.
`Label:` Etiketė.
`Input:` Įvesties laukas.
`TextArea: `Teksto sritis.
`SubmitButton:` Pateikimo mygtukas.
`LoadingContainer:` Pakrovimo konteineris.
`ErrorMessage:` Klaidos pranešimas.
`RegistrationContainer:` Pagrindinis konteineris formos išdėstymui.
`FormTitle:` Formos antraštė.
`TypeSelect:` Išskleidžiamasis sąrašas ekskursijos tipui pasirinkti.
`DateTimeField: `Laukas datai ir laikui.
`AddandRemoveButton:` Mygtukas pridėti ir pašalinti datą ir laiką.
`ModalOverlay: `Modal'o foninis sluoksnis.
`ModalContent:` Modal'o turinys.
`Title:` Modal'o antraštė.
`Message:` Modal'o pranešimas.
`ButtonContainer:` Mygtukų konteineris.
`Button:` Bendras mygtuko stilius.
`ConfirmButton: `Patvirtinimo mygtukas.
`CancelButton:` Atšaukimo mygtukas.


3. Komponento būsenos:
`errors:` Klaidos būsena.
`loading:` Pakrovimo būsena.
`formData:` Formos duomenų būsena.

4. Funkcijos:
`handleChange:` Atnaujina formos duomenų būseną.
`validateForm:` Validuoja formos duomenis.
`handleSubmit:` Tvarko formos pateikimą.
`addDateTime: `Prideda naują datą ir laiką.
`removeDateTime:` Pašalina pasirinktą datą ir laiką.
`handleConfirmClick: `Iškviečia onDelete ir onClose funkcijas.
`handleCancelClick:` Iškviečia onClose funkciją.
