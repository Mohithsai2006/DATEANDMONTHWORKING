import io
import base64
import matplotlib.pyplot as plt
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from prophet import Prophet

app = Flask(__name__)
CORS(app)

# Load the dataset (ensure your data path is correct)
DATA_PATH = "GERUSOPPAORIGINAL.xlsx"  # Replace with your file path
df = pd.read_excel(DATA_PATH)
df['Date'] = pd.to_datetime(df['Date'])

# Prepare data for Prophet
level_data = df[['Date', 'Level']].rename(columns={'Date': 'ds', 'Level': 'y'})
storage_data = df[['Date', 'Storage']].rename(columns={'Date': 'ds', 'Storage': 'y'})

# Train models
model_level = Prophet(yearly_seasonality=True, daily_seasonality=True)
model_level.fit(level_data)

model_storage = Prophet(yearly_seasonality=True, daily_seasonality=True)
model_storage.fit(storage_data)

@app.route("/forecast", methods=["POST"])
def forecast():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Missing 'year' or 'selected_date' in request data"}), 400

        year = data.get("year")
        selected_date = data.get("selected_date")

        if year:
            return get_yearly_forecast(year)

        if selected_date:
            return get_datewise_forecast(selected_date)

        return jsonify({"error": "Invalid data provided"}), 400

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500


def get_yearly_forecast(year):
    # Generate dates for the requested year
    future_dates = pd.date_range(f"{year}-01-01", f"{year}-12-31")
    future_level = pd.DataFrame({"ds": future_dates})
    future_storage = pd.DataFrame({"ds": future_dates})

    # Predict Level and Storage
    forecast_level = model_level.predict(future_level)
    forecast_storage = model_storage.predict(future_storage)

    # Group by Month
    forecast_level["Year-Month"] = forecast_level["ds"].dt.to_period("M")
    forecast_storage["Year-Month"] = forecast_storage["ds"].dt.to_period("M")

    monthly_level = forecast_level.groupby("Year-Month")["yhat"].mean()
    monthly_storage = forecast_storage.groupby("Year-Month")["yhat"].mean()

    # Generate two separate graphs for Level and Storage (Monthly Forecast)
    fig, axs = plt.subplots(2, 1, figsize=(10, 8))
    
    # Level vs Month Graph
    axs[0].plot(monthly_level.index.astype(str), monthly_level, label="Level")
    axs[0].set_xlabel("Month")
    axs[0].set_ylabel("Level")
    axs[0].set_title(f"Monthly Forecast for Level - {year}")
    axs[0].legend()

    # Storage vs Month Graph
    axs[1].plot(monthly_storage.index.astype(str), monthly_storage, label="Storage", color='orange')
    axs[1].set_xlabel("Month")
    axs[1].set_ylabel("Storage")
    axs[1].set_title(f"Monthly Forecast for Storage - {year}")
    axs[1].legend()

    # Save the plot to a BytesIO object (to avoid interactive GUI)
    img = io.BytesIO()
    plt.tight_layout()
    plt.savefig(img, format="png")
    img.seek(0)
    
    # Return the image as a base64 string
    img_b64 = base64.b64encode(img.getvalue()).decode('utf-8')

    return jsonify({"graph": f"data:image/png;base64,{img_b64}"})


def get_datewise_forecast(selected_date):
    selected_date = pd.to_datetime(selected_date)
    future_dates = pd.date_range(selected_date, periods=15)

    future_level = pd.DataFrame({"ds": future_dates})
    future_storage = pd.DataFrame({"ds": future_dates})

    # Predict Level and Storage
    forecast_level = model_level.predict(future_level)
    forecast_storage = model_storage.predict(future_storage)

    # Create 2 subplots (one for Level and one for Storage)
    fig, axs = plt.subplots(2, 1, figsize=(10, 8))

    # # Plot Level vs Date
    # axs[0].plot(forecast_level['ds'], forecast_level['yhat'], label="Level")
    # axs[0].set_xlabel("Date")
    # axs[0].set_ylabel("Level")
    # axs[0].set_title(f"Datewise Forecast for Level - {selected_date.strftime('%Y-%m-%d')}")
    # axs[0].legend()

    # # Plot Storage vs Date
    # axs[1].plot(forecast_storage['ds'], forecast_storage['yhat'], label="Storage", color='orange')
    # axs[1].set_xlabel("Date")
    # axs[1].set_ylabel("Storage")
    # axs[1].set_title(f"Datewise Forecast for Storage - {selected_date.strftime('%Y-%m-%d')}")
    # axs[1].legend()

    # Save the plot to a BytesIO object
    img = io.BytesIO()
    plt.tight_layout()
    plt.savefig(img, format="png")
    img.seek(0)
    
    # Return the image as a base64 string
    img_b64 = base64.b64encode(img.getvalue()).decode('utf-8')

    return jsonify({"graph": f"data:image/png;base64,{img_b64}"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
