
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
import requests
pd.set_option('future.no_silent_downcasting', True)

df = pd.read_excel(r'D:\GWL_Project_Folder\DataSets\full_data.xlsx')

df['precip']= df['precip'].replace(0, None)

df['precip'] = df['precip'].bfill().infer_objects(copy=False)
df['soil_moisture_proxy'] = df['precip'] * (df['humidity'] / 100) * (1 - df['solarradiation']/max(df['solarradiation']))
df['groundwater_level_proxy'] = df['precip'] * (df['humidity'] / 100) * (1 - df['solarradiation'] / max(df['solarradiation']))

# Example: converting 'datetime' column
df['datetime'] = pd.to_datetime(df['datetime'])
df['month'] = df['datetime'].dt.month
df['year'] = df['datetime'].dt.year

df.drop(['datetime'], axis=1, inplace=True)

# Features and target
X = df[['temp', 'humidity','precip','windspeed', 
        'cloudcover', 'dew',  'solarradiation', 'soil_moisture_proxy', 'year']]
y = df['groundwater_level_proxy']

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

# Scaling the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Initialize the Random Forest Model
rf = RandomForestRegressor(n_estimators=100, random_state=42)

# Train the model
rf.fit(X_train_scaled, y_train)

# Predict and evaluate
y_pred_rf = rf.predict(X_test_scaled)
r2_score(y_test, y_pred_rf)

#weather data function
def get_weather_data(lat, lon): 
    api_key = '49357792e59c48d0af2122009242310'  # Replace with your API key
    url = f"http://api.weatherapi.com/v1/current.json?key={api_key}&q={lat},{lon}"
    response = requests.get(url).json()

    temp = response['current']['temp_c']
    humidity = response['current']['humidity']
    precipitation = response['current']['precip_mm']
    wind = response['current']['wind_mph']
    cloud = response['current']['cloud']
    dewpoint = response['current']['dewpoint_c']


    return {
        'temp': temp,
        'humidity': humidity,
        'precip': precipitation,
        'wind':wind,
        'cloud':cloud,
        'dewpoint':dewpoint
    }


#calculate soil moisture
def calculate_soil_moisture(precip, humidity, solar_radiation):
        
    soil_moisture_proxy = precip * (humidity / 100) * (1 - solar_radiation / max(1, solar_radiation))
    
    return soil_moisture_proxy


#solar radiation model
X1 = X.drop(['solarradiation','soil_moisture_proxy','year'],axis=1)
y=X['solarradiation']
X_train, X_test, y_train, y_test = train_test_split(X1, y, test_size=0.2, random_state=42)
model = RandomForestRegressor(n_estimators=100)

model.fit(X_train,y_train)

#function to predict
def predict_groundwater_Level(lat, lon):

    weather_data = get_weather_data(lat, lon)
    if weather_data is None:
        print("Error: Weather data could not be retrieved.")
        return None
    
    solar_radiation = model.predict([[weather_data['temp'], 
        weather_data['humidity'], 
        weather_data['precip'], 
        weather_data['wind'],
        weather_data['cloud'],
        weather_data['dewpoint']]])[0]

    soil_moisture_proxy = calculate_soil_moisture(
        weather_data['precip'], 
        weather_data['humidity'], 
        solar_radiation
    )
    

    features = np.array([[
        weather_data['temp'], 
        weather_data['humidity'], 
        weather_data['precip'], 
        weather_data['wind'],
        weather_data['cloud'],
        weather_data['dewpoint'],
        solar_radiation,
        soil_moisture_proxy,
        2024
    ]]).reshape(1, -1)
    

    scaled_features = scaler.transform(features)

    y_pred = rf.predict(scaled_features)[0]

    y_pred_str = str(y_pred)[:6] 
    y_pred = float(y_pred_str) 

    if y_pred < 3:
        return y_pred,"EXCESS"
    elif y_pred >5 & y_pred < 15:
        return y_pred,"NORMAL"
    elif y_pred >20:
        return y_pred,"LOW"
    

