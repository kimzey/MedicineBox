import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ใช้สำหรับเปลี่ยนหน้า
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2

function MedicineForm1() {
  const [selectedMealTime, setSelectedMealTime] = useState(null);
  const [medicineName, setMedicineName] = useState('');
  const [medicineQuantity, setMedicineQuantity] = useState('');
  const [medicineDays, setMedicineDays] = useState('');
  const [error, setError] = useState('');
  const [selectedLogo, setSelectedLogo] = useState(null); // สถานะของโลโก้ที่เลือก
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนหน้า

  const handleLogoSelection = (logo) => {
    setSelectedLogo(logo); // เปลี่ยนโลโก้ที่เลือก
  };

  const handleMealTimeSelection = (value) => {
    setSelectedMealTime(value);
  };

  const handleSubmit = () => {
    // ตรวจสอบการกรอกข้อมูล
    if (!medicineName || !medicineQuantity || !medicineDays || !selectedMealTime || !selectedLogo) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง!',
      });
    } else {
      setError('');
      // เก็บข้อมูลใน localStorage
      const medicineData = JSON.parse(localStorage.getItem('medicineData')) || [];
      const newMedicine = {
        medicineName,
        medicineQuantity,
        medicineDays,
        selectedMealTime,
        selectedLogo,
      };
      localStorage.setItem('medicineData', JSON.stringify([...medicineData, newMedicine]));

      // แสดงข้อความการแจ้งเตือนสำเร็จ
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'ข้อมูลยาได้ถูกบันทึกแล้ว',
      });

      // เปลี่ยนไปหน้าถัดไป
      navigate('/medicine-form2'); // เปลี่ยนไปที่หน้าถัดไป
    }
  };

  return (
    <div className="container mx-auto py-10 flex flex-col justify-center items-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-sm sm:max-w-md p-6">
        <div className="flex items-center justify-between">
          <button className="text-gray-500">
            <span onClick={()=>{ navigate("/") }}>&lt;</span>
          </button>
          <p className="text-gray-800 font-bold">1 / 2</p>
          <button onClick={()=>{ navigate("/") }} className="text-gray-500" >X</button>
        </div>

        <h1 className="text-center text-xl font-semibold my-4">เพิ่มยาของคุณ</h1>

        <div className="flex justify-center space-x-4 my-4">
          <div
            onClick={() => handleLogoSelection('💊')}
            className={`w-12 h-12 flex justify-center items-center rounded-full border cursor-pointer ${selectedLogo === '💊' ? 'bg-blue-600' : 'bg-gray-100'}`}
          >
            <span className="text-gray-600">💊</span>
          </div>
          <div
            onClick={() => handleLogoSelection('🌿')}
            className={`w-12 h-12 flex justify-center items-center rounded-full border cursor-pointer ${selectedLogo === '🌿' ? 'bg-blue-600' : 'bg-gray-100'}`}
          >
            <span className="text-green-600">🌿</span>
          </div>
          <div
            onClick={() => handleLogoSelection('🧴')}
            className={`w-12 h-12 flex justify-center items-center rounded-full border cursor-pointer ${selectedLogo === '🧴' ? 'bg-blue-600' : 'bg-gray-100'}`}
          >
            <span className="text-blue-600">🧴</span>
          </div>
        </div>

        <div className="space-y-4 my-4">
          <div>
            <p className="text-gray-600">ชื่อ</p>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="ชื่อยา"
            />
          </div>
          <div>
            <p className="text-gray-600">จำนวนยา</p>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={medicineQuantity}
              onChange={(e) => setMedicineQuantity(e.target.value)}
              placeholder="จำนวนยา"
            />
          </div>
          <div>
            <p className="text-gray-600">จำนวนวัน</p>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={medicineDays}
              onChange={(e) => setMedicineDays(e.target.value)}
              placeholder="จำนวนวัน"
            />
          </div>
        </div>

        <div className="my-4">
          <p className="font-medium text-gray-700 mb-2">เลือกเวลา:</p>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="mealTime"
                value="ก่อนอาหาร"
                className="hidden"
                checked={selectedMealTime === 'ก่อนอาหาร'}
                onChange={() => handleMealTimeSelection('ก่อนอาหาร')}
              />
              <span
                className={`px-4 py-2 rounded-lg cursor-pointer border-2 ${selectedMealTime === 'ก่อนอาหาร' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-black'}`}
              >
                ก่อนอาหาร
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="mealTime"
                value="หลังอาหาร"
                className="hidden"
                checked={selectedMealTime === 'หลังอาหาร'}
                onChange={() => handleMealTimeSelection('หลังอาหาร')}
              />
              <span
                className={`px-4 py-2 rounded-lg cursor-pointer border-2 ${selectedMealTime === 'หลังอาหาร' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-black'}`}
              >
                หลังอาหาร
              </span>
            </label>
          </div>
        </div>

        {error && <p className="text-white text-sm text-center p-3 m-3 rounded-lg bg-red-400">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold"
        >
          ต่อไป
        </button>
      </div>
    </div>
  );
}

export default MedicineForm1;
