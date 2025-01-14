import os
from flask import Flask, jsonify, render_template
import pandas as pd

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('ramakrishnaadmins.html')

@app.route('/api/dashboard-data', methods=['GET'])
def dashboard_data():
    file_path = r'C:\Users\jaga4\Downloads\newproject_split1\hospital_dashboard_data_ramakrishna.xlsx'

    if not os.path.exists(file_path):
        return jsonify({"error": "Excel file not found"}), 404

    try:
        df = pd.read_excel(file_path)
        data = {
            "appointments": len(df),
            "newPatients": 50,
            "medicinesSold": 500,
            "labTests": 100,
            "appointmentsList": df.to_dict('records'),
            "medicineNames": ["Paracetamol", "Vitamin Tablets", "Antacid Tablets", "Others"],
            "medicineCounts": [55, 25, 12, 8]
        }
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": f"Failed to read the Excel file: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
