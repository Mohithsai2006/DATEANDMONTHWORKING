from flask import Flask, request, jsonify
import pandas as pd
from prophet import Prophet
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the dataset
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
        # Parse request
        data = request.json
        if not data:
            return jsonify({"error": "Missing 'year' or 'selected_date' in request data"}), 400

        year = data.get("year")
        selected_date = data.get("selected_date")

        if year:  # Yearly forecast
            return get_monthly_forecast(year)

        if selected_date:  # Datewise forecast
            return get_datewise_forecast(selected_date)

        return jsonify({"error": "Invalid data provided"}), 400

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Internal Server Error", "message": str(e)}), 500


def get_monthly_forecast(year):
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

    response = {
        "year": year,
        "monthly_level": {str(k): v for k, v in monthly_level.items()},
        "monthly_storage": {str(k): v for k, v in monthly_storage.items()},
    }
    return jsonify(response)


def get_datewise_forecast(selected_date):
    selected_date = pd.to_datetime(selected_date)
    future_dates = pd.date_range(selected_date, periods=15)

    future_level = pd.DataFrame({"ds": future_dates})
    future_storage = pd.DataFrame({"ds": future_dates})

    # Predict Level and Storage
    forecast_level = model_level.predict(future_level)
    forecast_storage = model_storage.predict(future_storage)

    datewise_level = forecast_level.set_index("ds")["yhat"].to_dict()
    datewise_storage = forecast_storage.set_index("ds")["yhat"].to_dict()

    response = {
        "selected_date": selected_date.strftime("%Y-%m-%d"),
        "datewise_level": {str(k): v for k, v in datewise_level.items()},
        "datewise_storage": {str(k): v for k, v in datewise_storage.items()},
    }
    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
