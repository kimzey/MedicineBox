import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function SetTime() {
  const [medicines, setMedicines] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // ดึงข้อมูลยาจาก localStorage
    const data = JSON.parse(localStorage.getItem("medicineData")) || [];
    setMedicines(data);

    // กำหนดเวลาพื้นฐานเริ่มต้น (08:00) สำหรับแต่ละยา
    const initialTimes = {};
    data.forEach((medicine, index) => {
      initialTimes[index] = "08:00";
    });
    setSelectedTimes(initialTimes);
  }, []);

  const handleTimeChange = (index, time) => {
    setSelectedTimes((prev) => ({
      ...prev,
      [index]: time,
    }));
  };

  const handleAddMoreMedicine = () => {
    // กลับไปหน้ากรอกข้อมูล
    navigate("/medicine-form1");
  };

  const handleConfirm = () => {
    // ดึงข้อมูลยาเก่าจาก localStorage
    const existingMedicines = JSON.parse(localStorage.getItem("confirmedMedicineData")) || [];
    
    // รวมข้อมูลยาใหม่กับข้อมูลเก่าที่มีอยู่
    const updatedMedicines = medicines.map((medicine, index) => {
      // ค้นหายาที่มีเวลาเดียวกันในข้อมูลเก่าแล้วอัพเดต
      const existingMedicine = existingMedicines.find(item => item.medicineName === medicine.medicineName);
      return {
        ...medicine,
        time: selectedTimes[index],
        // ถ้ามียาเก่าที่ตรงกัน ก็จะรวมข้อมูลเก่ากับใหม่
        medicineDays: existingMedicine ? existingMedicine.medicineDays : medicine.medicineDays,
      };
    });
  
    // รวมข้อมูลยาใหม่กับข้อมูลยาเก่าที่มีอยู่แล้ว
    const allMedicines = [...existingMedicines, ...updatedMedicines];
  
    console.log("ข้อมูลที่ยืนยัน:", allMedicines);
  
    // บันทึกข้อมูลทั้งหมด (ข้อมูลเก่า + ข้อมูลใหม่) ลง localStorage
    localStorage.setItem("confirmedMedicineData", JSON.stringify(allMedicines));
  
    // ลบข้อมูลยาเดิมออกจาก localStorage (หรือหากต้องการสามารถเก็บข้อมูลนี้ไว้)
    localStorage.removeItem("medicineData");
  
    // แสดง SweetAlert2 เมื่อการเพิ่มยาเสร็จสมบูรณ์
    Swal.fire({
      title: 'สำเร็จ!',
      text: 'เพิ่มยาเข้าตารางสำเร็จ!',
      icon: 'success',
      confirmButtonText: 'ตกลง'
    }).then(() => {
      // นำผู้ใช้กลับไปหน้าหลัก
      navigate("/");
    });
  };
  
  
  

  return (
    <div className="container mx-auto py-10 flex flex-col justify-center items-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-sm sm:max-w-md p-6">
        <div className="flex items-center justify-between">
          <button className="text-gray-500" onClick={handleAddMoreMedicine}>
            <span >&lt;</span>
          </button>
          <p className="text-gray-800 font-bold">2 / 2</p>
          <button onClick={()=>{ navigate("/") }} className="text-gray-500">X</button>
        </div>

        <h1 className="text-center text-xl font-semibold my-4">ตารางยา</h1>

        {medicines.length === 0 ? (
          <p className="text-center text-gray-600">ไม่มีข้อมูลยา</p>
        ) : (
          <div className="space-y-4">
            {medicines.map((medicine, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 border rounded-lg bg-gray-100"
              >
                <div>
                  <div
                    className={`w-12 h-12 flex justify-center items-center rounded-full border  `}
                  >
                    <span className="text-gray-600">{medicine.selectedLogo}</span>
                  </div>
                  <p className="font-bold text-gray-800">
                    {medicine.medicineName}
                  </p>
                  <p className="text-gray-600">{`${medicine.medicineQuantity} เม็ด ${medicine.selectedMealTime}`}</p>
                  <p className="text-gray-600">{`${medicine.medicineDays} วัน`}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-700">เวลาทาน</label>
                  <input
                    type="time"
                    value={selectedTimes[index]}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className="border rounded-md p-2 text-gray-800"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleAddMoreMedicine}
          className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold mt-4"
        >
          + เพิ่มยา
        </button>

        <button
          onClick={handleConfirm}
          className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold mt-4"
        >
          เพิ่มยาเข้าตาราง
        </button>
      </div>
    </div>
  );
}

export default SetTime;
