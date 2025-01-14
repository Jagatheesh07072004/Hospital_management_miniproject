import pandas as pd

# Specify the path to your Excel file
file_path = r'C:\Users\jaga4\Downloads\newproject_split1\hospital_dashboard_data_ramakrishna.xlsx'

try:
    # Read the Excel file using pandas
    df = pd.read_excel(file_path)

    # Print the first few rows of the data to check if it was read correctly
    print(df.head())
except Exception as e:
     print(f"Error reading the Excel file: {e}")