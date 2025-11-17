# 📦 Sistema Gestione Magazzino Laboratori

Un'applicazione web moderna per la gestione dei magazzini dei laboratori scolastici di **Estetica**, **Acconciatura** e **Ristorazione**.

## ✨ Caratteristiche Principali

- 🔐 **Autenticazione Microsoft 365** - Login con credenziali scolastiche
- 📱 **Scanner Barcode** - Scansiona prodotti da smartphone/tablet
- 📊 **Dashboard Completa** - Statistiche e panoramica magazzino
- 🏢 **Multi-laboratorio** - Gestione separata per ogni laboratorio
- 📋 **Operazioni Complete**: Carico, Scarico, Trasferimenti, Inventario
- 📄 **Upload Documenti** - Carica bolle di accompagnamento
- 📱 **Responsive** - Funziona su desktop, tablet e smartphone
- ☁️ **Cloud Gratuito** - Hosted su Azure Static Web Apps

## 🚀 Setup Rapido

### 1. Prerequisiti
- Account Azure con sottoscrizione attiva
- Account Microsoft 365 per l'autenticazione
- Node.js 18+ installato

### 2. Installazione
```bash
# Clona il repository
git clone https://github.com/your-org/magazzino-laboratori.git
cd magazzino-laboratori

# Installa le dipendenze
npm install

# Copia il file di configurazione
copy .env.example .env

# Avvia in modalità sviluppo
npm run dev
```

### 3. Configurazione Azure

#### Azure Active Directory (per l'autenticazione)
1. Vai al [Portale Azure](https://portal.azure.com)
2. **Azure Active Directory** → **Registrazioni app** → **+ Nuova registrazione**
3. Nome: `Gestione Magazzino Laboratori`
4. **URI di reindirizzamento**: Aggiungi il tuo dominio Azure Static Web App
5. Copia **Application (client) ID** e **Directory (tenant) ID**

#### Azure Cosmos DB (database gratuito)
1. **Crea risorsa** → **Azure Cosmos DB** → **Core (SQL)**
2. Scegli il piano **Gratuito** (sempre gratis!)
3. Copia **URI** e **Chiave primaria** dalle impostazioni

#### Azure Static Web Apps (hosting gratuito)
1. **Crea risorsa** → **App Web statica**
2. Collega al repository GitHub
3. Build preset: **React**
4. App location: `/`
5. Output location: `dist`

### 4. Configurazione Variabili d'Ambiente

Modifica il file `.env`:
```env
# Azure Active Directory
VITE_AZURE_CLIENT_ID=tu_client_id_qui
VITE_AZURE_TENANT_ID=tu_tenant_id_qui

# Azure Cosmos DB (Gratis!)  
VITE_COSMOS_ENDPOINT=https://tuoacccount.documents.azure.com:443/
VITE_COSMOS_KEY=tua_chiave_primaria_qui
```

### 5. Deploy Automatico
Il deploy su Azure avviene automaticamente ad ogni push su `main` grazie a GitHub Actions.

## 🏗️ Architettura

```
Frontend (React + TypeScript)
    ↓
Azure Active Directory (Autenticazione)
    ↓
Azure Static Web Apps (Hosting)
    ↓
Azure Cosmos DB (Database - Gratuito)
```

## 📖 Utilizzo

### Per i Docenti
1. **Login** con credenziali Microsoft 365
2. **Scanner** → Scansiona barcode prodotto
3. **Carico** → Aggiungi prodotti al magazzino
4. **Scarico** → Preleva prodotti dal magazzino
5. **Trasferimento** → Sposta tra laboratori
6. **Upload Bolla** → Carica documenti di accompagnamento

### Per gli Amministratori
- **Dashboard** → Panoramica completa
- **Prodotti** → Gestisci catalogo prodotti
- **Laboratori** → Configura laboratori e permessi
- **Inventario** → Riconciliazione periodica

## 🛠️ Tecnologie Utilizzate

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Lucide Icons
- **Autenticazione**: Microsoft MSAL (Azure AD)
- **Database**: Azure Cosmos DB
- **Hosting**: Azure Static Web Apps
- **Build**: GitHub Actions
- **Scanner**: Camera API + ZXing

## 🔒 Sicurezza

- ✅ Autenticazione Azure AD obbligatoria
- ✅ Tracciamento completo di ogni operazione
- ✅ Permessi per laboratorio
- ✅ HTTPS obbligatorio
- ✅ Dati criptati in Azure Cosmos DB

## 💰 Costi

### Completamente Gratuito per scuole!
- **Azure Static Web Apps**: Gratuito (100GB bandwidth/mese)
- **Azure Cosmos DB**: Gratuito (25GB + 1000 RU/s)
- **Azure Active Directory**: Incluso con Microsoft 365 Education

## 📞 Supporto

Per assistenza:
1. Controlla le [Issues su GitHub](../../issues)
2. Consulta la documentazione Azure
3. Contatta l'amministratore di sistema

## 🤝 Contributi

Contributi benvenuti! Leggi le [linee guida](CONTRIBUTING.md) per iniziare.

## 📄 Licenza

Questo progetto è sotto licenza MIT - vedi il file [LICENSE](LICENSE) per dettagli.

---

🏫 **Sviluppato per l'educazione** - Sistema pensato specificamente per le esigenze dei laboratori scolastici italiani. - gestione inventario laboratori
