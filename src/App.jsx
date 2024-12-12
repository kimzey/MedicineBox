import { useState, useEffect ,useMemo  } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import mqtt from 'mqtt';

function Home() {
  const [groupedMedicines, setGroupedMedicines] = useState({});
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [mqttClient, setMqttClient] = useState(null);
  const [canSendTimeUp , setcanSendTimeUp ] = useState(true);

  const navigate = useNavigate();

  const mqttOptions = useMemo(() => ({
    url: "wss://6bece45f0a054de68c7f5f00fe90a1ab.s1.eu.hivemq.cloud:8884/mqtt",
    username: "kimzey",
    password: "MMI321project"
  }), []); // dependency array ว่าง หมายถึงสร้างเพียงครั้งเดียว

  useEffect(() => {
    // MQTT Connection
    const client = mqtt.connect(mqttOptions.url, {
      username: mqttOptions.username,
      password: mqttOptions.password
    });

    client.on('connect', () => {
      console.log('MQTT Connected');
      client.subscribe('medicine/timeup');
      setMqttClient(client);
    });

    // Message listener
    client.on('message', (topic, message) => {
      if (topic === 'medicine/timeup') {
        const response = message.toString();
        console.log(response);
        
        if (response === 'Success') {
          // Stop sending TimeUp if Success is received
          // client.unsubscribe('medicine/timeup');
          console.log("change Fasle");
          setcanSendTimeUp(false)
        }
      }
    });

    // Cleanup
    return () => {
      if (client) {
        client.end();
      }
    };
  },[mqttOptions] );

  useEffect(() => {
    // Previous localStorage and time-related code remains the same
    const data = JSON.parse(localStorage.getItem('confirmedMedicineData')) || [];
    const sortedData = data.sort((a, b) => a.time.localeCompare(b.time));

    const grouped = sortedData.reduce((acc, medicine) => {
      if (!acc[medicine.time]) acc[medicine.time] = [];
      acc[medicine.time].push(medicine);
      return acc;
    }, {});

    setGroupedMedicines(grouped);

    const updateTime = () => {
      const date = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      };
      const formattedDateTime = date.toLocaleString('th-TH', options);
      setCurrentDateTime(formattedDateTime);

      // Check medicine times for notifications
      Object.keys(grouped).forEach(medicineTime => {
        const currentTime = date.toLocaleTimeString('th-TH', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });

        if (medicineTime === currentTime && mqttClient) {
          // Send TimeUp for matching times
          // mqttClient.publish('medicine/timeup', JSON.stringify({
          //   medicines: grouped[medicineTime],
          //   timestamp: new Date().toISOString()
          // }));
          if(canSendTimeUp){
            mqttClient.publish('medicine/timeup',"TimeUp");
            // console.log("send");
          }
        }
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [mqttClient, canSendTimeUp]);

  // Rest of the component remains the same as in the original code
  const handleAddMedicine = () => {
    navigate('/medicine-form1');
  };

  const handleDeleteMedicine = (medicineName) => {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: `ต้องการลบยา ${medicineName} หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        const data = JSON.parse(localStorage.getItem('confirmedMedicineData')) || [];
        const updatedData = data.filter(medicine => medicine.medicineName !== medicineName);

        localStorage.setItem('confirmedMedicineData', JSON.stringify(updatedData));

        const grouped = updatedData.reduce((acc, medicine) => {
          if (!acc[medicine.time]) acc[medicine.time] = [];
          acc[medicine.time].push(medicine);
          return acc;
        }, {});
        setGroupedMedicines(grouped);

        Swal.fire('ลบสำเร็จ!', `${medicineName} ถูกลบจากรายการยาแล้ว.`, 'success');
      }
    });
  };

  return (
    <div className="container mx-auto py-10 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6 mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">สวัสดี!</h1>
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