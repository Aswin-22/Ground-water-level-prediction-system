# Ground Water Level Prediction System

## Project Overview

This project predicts groundwater level indicators (EXCESS / NORMAL / LOW) based on weather and environmental proxies. It consists of:
- A **Flask** backend that trains a machine learning model (Random Forest) and serves prediction requests.
- A **React** frontend with pages for inputting locations, visualizing predictions on a map, and generating comparison graphs.
- Integration with external services: LocationIQ for geocoding and WeatherAPI for live weather data.
- A lightweight proxy of groundwater level via derived features like soil moisture and solar radiation.

## Prerequisites

- Python 3.10+ (or compatible 3.x)
- Node.js 18+ and npm/yarn
- Internet access for external APIs (LocationIQ, WeatherAPI)
- `full_data.xlsx` placed in backend root (same directory as `GWL_Predictor.py`)
- API keys:
  - LocationIQ
  - WeatherAPI



