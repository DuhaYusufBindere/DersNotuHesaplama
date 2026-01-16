# Üniversite Not Hesaplayıcı

Çan eğrisi (Z-skoru) sistemini kullanarak üniversite notlarını hesaplayan ve takip eden tam kapsamlı bir uygulama.

## Gereksinimler
- **Node.js**: Bilgisayarınızda Node.js yüklü olmalıdır. [Buradan İndirin](https://nodejs.org/)

## Kurulum

### 1. Backend (Sunucu) Kurulumu
`server` klasöründe bir terminal açın:
```bash
cd server
npm install
npm start
```
Sunucu `http://localhost:3000` adresinde çalışacaktır.

### 2. Frontend (Arayüz) Kurulumu
`client` klasöründe yeni bir terminal açın:
```bash
cd client
npm install
npm run dev
```
Uygulama başlayacaktır (genellikle `http://localhost:5173` adresinde).

## Kullanım
1. Web uygulamasını açın.
2. "+ Ders Ekle" butonuna tıklayarak ders ekleyin.
3. Dönem (örn: "Güz 2023"), Ders Adı, Notunuz, Sınıf Ortalaması ve Standart Sapma bilgilerini girin.
4. Sistem otomatik olarak Harf Notunuzu ve Ortalamanızı hesaplayacaktır.
