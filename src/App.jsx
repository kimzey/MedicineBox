import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // นำเข้า sweetalert2

function Home() {
  const [groupedMedicines, setGroupedMedicines] = useState({});
  const [currentDateTime, setCurrentDateTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // ดึงข้อมูลยาจาก localStorage
    const data = JSON.parse(localStorage.getItem('confirmedMedicineData')) || [];
    // เรียงข้อมูลตามเวลา (time)
    const sortedData = data.sort((a, b) => a.time.localeCompare(b.time));

    // จัดกลุ่มยาโดยเวลา
    const grouped = sortedData.reduce((acc, medicine) => {
      if (!acc[medicine.time]) acc[medicine.time] = [];
      acc[medicine.time].push(medicine);
      return acc;
    }, {});

    setGroupedMedicines(grouped);

    // ฟังก์ชันสำหรับอัปเดตเวลา
    const updateTime = () => {
      const date = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      const formattedDateTime = date.toLocaleString('th-TH', options);
      setCurrentDateTime(formattedDateTime);
    };

    // เรียกใช้งาน updateTime ครั้งแรก
    updateTime();

    // ตั้ง interval ให้ทำการอัปเดตทุกๆ 1 วินาที
    const interval = setInterval(updateTime, 1000);

    // ล้าง interval เมื่อ component ถูกทำลาย
    return () => clearInterval(interval);
  }, []);

  const handleAddMedicine = () => {
    // ไปที่หน้าเพิ่มยา
    navigate('/medicine-form1');
  };

  const handleDeleteMedicine = (medicineName) => {
    // แสดง SweetAlert2 เพื่อยืนยันการลบ
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: `ต้องการลบยา ${medicineName} หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        // ดึงข้อมูลยาเก่าจาก localStorage
        const data = JSON.parse(localStorage.getItem('confirmedMedicineData')) || [];

        // ลบยาตามชื่อ
        const updatedData = data.filter(medicine => medicine.medicineName !== medicineName);

        // อัปเดตข้อมูลใน localStorage
        localStorage.setItem('confirmedMedicineData', JSON.stringify(updatedData));

        // อัปเดตสถานะการแสดงผล
        const grouped = updatedData.reduce((acc, medicine) => {
          if (!acc[medicine.time]) acc[medicine.time] = [];
          acc[medicine.time].push(medicine);
          return acc;
        }, {});
        setGroupedMedicines(grouped);

        // แสดงข้อความเมื่อการลบสำเร็จ
        Swal.fire('ลบสำเร็จ!', `${medicineName} ถูกลบจากรายการยาแล้ว.`, 'success');
      }
    });
  };

  return (
    <div className="container mx-auto py-10 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6 mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">สวัสดี!</h1>
        {/* แสดงวันที่และเวลาปัจจุบัน */}
        <p className="text-gray-600 mt-2 mb-6">{currentDateTime}</p>

        {Object.keys(groupedMedicines).length === 0 ? (
          <p className="text-center text-gray-600">ไม่มีข้อมูลยาในตาราง</p>
        ) : (
          Object.keys(groupedMedicines).map((time) => (
            <div key={time} className="mb-6">
              <p className="text-gray-700 font-bold text-lg">{time}</p>
              <div className="mt-2 space-y-4">
                {groupedMedicines[time].map((medicine, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm"
                  >
                    <div className="text-2xl mr-4">{medicine.selectedLogo}</div>
                    <div>
                      <p className="font-bold text-gray-800">{medicine.medicineName}</p>
                      <p className="text-gray-600">
                        {medicine.medicineQuantity} เม็ด {medicine.selectedMealTime}
                      </p>
                      <p className="text-gray-600">{medicine.medicineDays} วัน</p>
                    </div>
                    {/* ปุ่มลบที่ขวาสุด */}
                    <button
                      onClick={() => handleDeleteMedicine(medicine.medicineName)}
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        <button
          onClick={handleAddMedicine}
          className="fixed bottom-10 right-10 bg-blue-600 text-white rounded-full p-4 shadow-lg"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Home;
