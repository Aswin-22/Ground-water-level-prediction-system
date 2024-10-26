import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import numpy as np


data = pd.read_excel("GWL.xlsx")


data = data.rename(columns={'GW Level(mbgl)': 'Water_Level'})


data.set_index('Date', inplace=True)

data['Water_Level'] = data['Water_Level'].ffill().bfill()



data.reset_index(inplace=True)



from sklearn.preprocessing import LabelEncoder
label_encoder = LabelEncoder()

# Encode the station names
data['Station_Encoded'] = label_encoder.fit_transform(data['Station Name'])
data['District_Encoded'] = label_encoder.fit_transform(data['District'])
data['State_Encoded'] = label_encoder.fit_transform(data['State'])


data['Year'] = data['Date'].dt.year
data['Month'] = data['Date'].dt.month


X = data[['State_Encoded','District_Encoded','Station_Encoded','Year','Month']]
y = data['Water_Level']

"""# Random Forest Model"""

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=100)
model.fit(X_train,y_train)

y_pred = model.predict(X_test)

def GWL_Predictor(state, district, station, year, month):
    state = label_encoder.fit_transform([state])[0]
    district = label_encoder.fit_transform([district])[0]
    station = label_encoder.fit_transform([station])[0]
    input_values = np.array([[state, district, station, year, month]])
    prediction = model.predict(input_values)
    
    # Ensure we're returning a single float value
    return float(prediction[0]) if prediction is not None and len(prediction) > 0 else 0.0