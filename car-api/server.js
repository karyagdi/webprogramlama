const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// Log Middleware
app.use((req, res, next) => {
    console.log(
        `[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`
    );
    next();
});

// Örnek Veriler
let cars = [
    {
        id: 1,
        brand: "BMW",
        model: "M3",
        year: 2024,
        price: 4500000,
        type: "Sedan"
    },
    {
        id: 2,
        brand: "Toyota",
        model: "Corolla",
        year: 2023,
        price: 1200000,
        type: "Sedan"
    }
];

// Ana Sayfa
app.get("/", (req, res) => {
    res.json({
        message: "Car Management API",
        endpoints: [
            "GET /cars",
            "GET /cars/:id",
            "POST /cars",
            "PUT /cars/:id",
            "DELETE /cars/:id",
            "GET /search/:brand",
            "GET /stats"
        ]
    });
});

// Tüm Araçları Getir
app.get("/cars", (req, res) => {
    res.json(cars);
});

// ID ile Araç Getir
app.get("/cars/:id", (req, res) => {

    const id = Number(req.params.id);

    const car = cars.find(
        car => car.id === id
    );

    if (!car) {
        return res.status(404).json({
            error: "Araç bulunamadı"
        });
    }

    res.json(car);
});

// Yeni Araç Ekle
app.post("/cars", (req, res) => {

    const {
        brand,
        model,
        year,
        price,
        type
    } = req.body;

    if (
        !brand ||
        !model ||
        !year ||
        !price ||
        !type
    ) {
        return res.status(400).json({
            error: "Tüm alanlar zorunludur"
        });
    }

    const newCar = {
        id: cars.length > 0
            ? cars[cars.length - 1].id + 1
            : 1,
        brand,
        model,
        year,
        price,
        type
    };

    cars.push(newCar);

    res.status(201).json({
        message: "Araç başarıyla eklendi",
        data: newCar
    });

});

// Araç Güncelle
app.put("/cars/:id", (req, res) => {

    const id = Number(req.params.id);

    const car = cars.find(
        car => car.id === id
    );

    if (!car) {
        return res.status(404).json({
            error: "Araç bulunamadı"
        });
    }

    car.brand = req.body.brand || car.brand;
    car.model = req.body.model || car.model;
    car.year = req.body.year || car.year;
    car.price = req.body.price || car.price;
    car.type = req.body.type || car.type;

    res.json({
        message: "Araç güncellendi",
        data: car
    });

});

// Araç Sil
app.delete("/cars/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = cars.findIndex(
        car => car.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            error: "Araç bulunamadı"
        });
    }

    const deletedCar = cars.splice(index, 1);

    res.json({
        message: "Araç silindi",
        data: deletedCar
    });

});

// Marka Ara
app.get("/search/:brand", (req, res) => {

    const brand =
        req.params.brand.toLowerCase();

    const result = cars.filter(
        car =>
            car.brand
                .toLowerCase()
                .includes(brand)
    );

    res.json(result);

});

// İstatistikler
app.get("/stats", (req, res) => {

    const totalCars = cars.length;

    const averagePrice =
        totalCars > 0
            ? Math.round(
                cars.reduce(
                    (sum, car) => sum + car.price,
                    0
                ) / totalCars
            )
            : 0;

    const typeDistribution = {};

    cars.forEach(car => {

        typeDistribution[car.type] =
            (typeDistribution[car.type] || 0) + 1;

    });

    res.json({
        totalCars,
        averagePrice,
        typeDistribution
    });

});

// 404
app.use((req, res) => {

    res.status(404).json({
        error: "Endpoint bulunamadı"
    });

});

// Global Hata Yakalama
app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        error: "Sunucu hatası oluştu"
    });

});

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});