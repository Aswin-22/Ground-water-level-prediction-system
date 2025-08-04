import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
import requests
import datetime
import joblib

pd.set_option('future.no_silent_downcasting', True)

# Load data
df = pd.read_excel('full_data.xlsx')

# Preprocess precipitation
df['precip'] = df['precip'].replace(0, np.nan).bfill().fillna(0.01)

# Calculate solar radiation max
MAX_SOLAR_RADIATION = df['solarradiation'].max()

# Enhanced soil moisture calculation with geographical weighting
df['soil_moisture_proxy'] = df['precip'] * (df['humidity']/100) * \
                            np.sqrt(1 - df['solarradiation']/MAX_SOLAR_RADIATION)

# State-based groundwater depth baselines (customize these per state)
STATE_BASELINES = {
    'kerala': 3.5,
    'tamil nadu': 8.5,
    'karnataka': 12.0,
    'andhra pradesh': 10.0,
    'telangana': 15.0,
    'odisha': 7.0,
    'default': 10.0
}

# Parse date
df['datetime'] = pd.to_datetime(df['datetime'])
df['month'] = df['datetime'].dt.month
df['year'] = df['datetime'].dt.year
df.drop(columns=['datetime'], inplace=True)

# Create state-depth mapping
df['state_baseline'] = df['name'].str.lower().map(STATE_BASELINES).fillna(STATE_BASELINES['default'])

# Feature engineering
df['temp_range'] = df['tempmax'] - df['tempmin']
df['season'] = df['month'].apply(lambda m: 1 if m in [3,4,5] else 2 if m in [6,7,8,9] else 3)  # 1=summer, 2=monsoon, 3=winter

# Feature matrix & target
features = ['temp', 'humidity', 'precip', 'windspeed', 'cloudcover', 
            'dew', 'solarradiation', 'year', 'month', 'state_baseline',
            'temp_range', 'season']
X = df[features]
y = df['soil_moisture_proxy']

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, shuffle=False, random_state=42)

# Create preprocessor
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), ['temp', 'humidity', 'precip', 'windspeed', 
                                   'cloudcover', 'dew', 'solarradiation', 'year',
                                   'temp_range']),
        ('cat', 'passthrough', ['month', 'season', 'state_baseline'])
    ])

# Preprocess data
X_train_processed = preprocessor.fit_transform(X_train)
X_test_processed = preprocessor.transform(X_test)

# Train model
groundwater_model = RandomForestRegressor(
    n_estimators=200,
    min_samples_split=5,
    max_depth=15,
    random_state=42
)
groundwater_model.fit(X_train_processed, y_train)

# Calculate dynamic thresholds
LOW_THRESHOLD = np.percentile(y_train, 33)
HIGH_THRESHOLD = np.percentile(y_train, 66)

print(f"Groundwater Model R²: {r2_score(y_test, groundwater_model.predict(X_test_processed)):.3f}")
print(f"Dynamic Thresholds - Low: {LOW_THRESHOLD:.4f}, High: {HIGH_THRESHOLD:.4f}")

# Save model and preprocessor
joblib.dump(groundwater_model, 'groundwater_model.pkl')
joblib.dump(preprocessor, 'preprocessor.pkl')

# Weather API function
def get_weather_data(lat, lon):
    api_key = '49357792e59c48d0af2122009242310'
    url = f"http://api.weatherapi.com/v1/current.json?key={api_key}&q={lat},{lon}"
    
    try:
        response = requests.get(url, timeout=10).json()
        current = response['current']
        return {
            'temp': current['temp_c'],
            'humidity': current['humidity'],
            'precip': current['precip_mm'] or 0.01,
            'windspeed': current['wind_mph'],
            'cloudcover': current['cloud'],
            'dew': current.get('dewpoint_c', current['temp_c'])
        }
    except Exception as e:
        print(f"Weather API Error: {e}")
        # Return average values as fallback
        return {
            'temp': 28.5, 
            'humidity': 65,
            'precip': 5.0,
            'windspeed': 12.0,
            'cloudcover': 50,
            'dew': 22.0
        }

# Prediction function
def predict_groundwater_level(lat, lon, state):
    # Get current weather
    weather = get_weather_data(lat, lon)
    current_date = datetime.datetime.now()
    
    # Get state baseline
    state_lower = state.lower()
    state_baseline = STATE_BASELINES.get(state_lower, STATE_BASELINES['default'])
    
    # Calculate temp range (estimate)
    temp_range = 8 + (weather['temp'] - 25) * 0.3  # Higher temps → wider range
    
    # Determine season
    month = current_date.month
    season = 1 if month in [3,4,5] else 2 if month in [6,7,8,9] else 3
    
    # Prepare feature vector
    features = pd.DataFrame([{
        'temp': weather['temp'],
        'humidity': weather['humidity'],
        'precip': weather['precip'],
        'windspeed': weather['windspeed'],
        'cloudcover': weather['cloudcover'],
        'dew': weather['dew'],
        'solarradiation': MAX_SOLAR_RADIATION * (1 - weather['cloudcover']/100) * 0.8,  # Estimate
        'year': current_date.year,
        'month': month,
        'state_baseline': state_baseline,
        'temp_range': temp_range,
        'season': season
    }])
    
    # Preprocess features
    processed_features = preprocessor.transform(features)
    
    # Predict proxy value
    proxy_value = groundwater_model.predict(processed_features)[0]
    
    # Convert to depth (Mbgl) - higher proxy → shallower depth
    depth = state_baseline * (2 - min(1.5, max(0.5, proxy_value * 2)))
    depth = max(1.0, min(25.0, depth))
    
    # Classification
    if depth < 5:
        category = "EXCESS"
    elif depth < 15:
        category = "NORMAL"
    else:
        category = "LOW"
    
    return round(depth, 2), category