const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/forecast", (req, res) => {
  const { year, selected_date } = req.body;

  if (year) {
    // Mock monthly data
    const monthly_level = {};
    const monthly_storage = {};

    for (let i = 1; i <= 12; i++) {
      const month = i.toString().padStart(2, "0");
      monthly_level[`${year}-${month}`] = Math.random() * 50 + 50; // Random values
      monthly_storage[`${year}-${month}`] = Math.random() * 0.2 + 0.1; // Random values
    }

    res.json({
      year,
      monthly_level,
      monthly_storage,
    });
  } else if (selected_date) {
    // Mock datewise data
    const datewise_level = {};
    const datewise_storage = {};
    const startDate = new Date(selected_date);

    for (let i = 0; i < 15; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const formattedDate = date.toISOString().split("T")[0];
      datewise_level[formattedDate] = Math.random() * 50 + 50; // Random values
      datewise_storage[formattedDate] = Math.random() * 0.2 + 0.1; // Random values
    }

    res.json({
      selected_date,
      datewise_level,
      datewise_storage,
    });
  } else {
    res.status(400).json({ error: "Invalid request parameters" });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
