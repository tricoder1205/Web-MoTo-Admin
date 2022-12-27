import axios from "axios";
import { useEffect, useState } from "react";

import InputField from "components/custom-field/InputField";
import SelectField from "components/custom-field/SelectField";
import Loading from "components/Loading";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './maintenance.scss';

export default function Maintenance(props) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    useEffect(() => {
        scrollToTop();
    }, []);
  const [loadingPage, setLoadingPage] = useState(false)
  const [loadingTime, setLoadingTime] = useState(false);
  const [timeService, setTimeService] = useState([])
  const [timeServiceId, setTimeServiceId] = useState({})

  const [date, setDate] = useState()
  const toDay = new Date();

  const _initForm = {
    name: '',
    phone: '',
    email: '',
    address: '',
    user: '',
    product: 'id',
    staff: 'id',
    dateTime: ''
  }

  const navigate = useNavigate();
  const [formData, setFormData] = useState(_initForm);
  const [listStaff, setListStaff] = useState(null);
  const [staffSelected, setStaffSelected] = useState({
    label: 'Nhân viên',
    value: 'NV000',
  })

  const [listUser, setListUser] = useState(null);
  const [userSelected, setUserSelected] = useState({
    label: 'Người dùng',
    value: 'U000',
    id: ''
  })
  useEffect(() => {
    axios.get("api/users")
    .then(res => {
      if (res.data.success) {
        const data = res.data.data
        const motoOptions = data.map((val) => ({
          label: val.name,
          value: val._id,
          name:  val.name,
          phone:  val.phone,
          email:  val.email,
          address:  val.address,
        }))
        setListUser(motoOptions)
      }
    }).catch ((e) => {
      toast.error('Không thể kết nối máy chủ')
    })
  }, [])

  const [listVehicle, setListVehicle] = useState(null);
  const [vehicleSelected, setVehicleSelected] = useState({
    label: 'Chọn xe',
    value: 'MOTO000',
  })

  useEffect(() => {
    if(userSelected.value !== 'U000') {
      axios.get(`/api/my-mo-to/user/${userSelected.value}`)
      .then(res => {
        if (res.data.success) {
          const data = res.data.data
          const motoOptions = data.map((val) => ({
            label: val.name,
            value: val._id,
          }))
          setListVehicle(motoOptions)
        }
      }).catch ((e) => {
        toast.error('Không thể kết nối máy chủ')
      })
    }
  }, [userSelected])

  useEffect(() => {
    axios.get("api/staff")
    .then(res => {
      setLoadingPage(true)
      if (res.data.success) {
        const data = res.data.data
        const motoOptions = data.map((val) => ({
          label: val.name,
          img: val.image,
          value: val._id
        }))
        setListStaff(motoOptions)
        setLoadingPage(false)
      }
    }).catch ((e) => {
      toast.error('Không thể kết nối máy chủ')
    })
  }, [])

  const handleSelectUser= (e) => {
    setUserSelected(e)
    setFormData(prev=> ({
      ...prev,
      user: e.value,
      name: e.name,
      phone: e.phone,
      email: e.email,
      address: e.address,
    }))
  }
  const handleSelectVehicle= (e) => {
    setVehicleSelected(e)
    setFormData(prev=> ({
      ...prev,
      product: e.value,
    }))
  }

  function handleCheckOverService (item) {
    const timeStap = item.time.split('h')
    if (moment(toDay).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')) {
      if (toDay.getHours() > timeStap[0] || toDay.getMinutes() > timeStap[1]) {
        return 3
      } else {      
        if (item.staff.length === 0) {
          return 0
        }
        if (item.staff.length > 0) {
          const countStaff = item.staff.filter(prev => (prev.time === moment(date).format('YYYY-MM-DD')))
          if (countStaff.length === timeService.totalStaff) {
            return 3
          } else if (countStaff.findIndex(prev => prev.staff === staffSelected.value) === -1) {
            return 0
          } else {
            return 3
          }
        }
      }
    } else {      
      if (item.staff.length === 0) {
        return 0
      }
      if (item.staff.length > 0) {
        const countStaff = item.staff.filter(prev => (prev.time === moment(date).format('YYYY-MM-DD')))
        if (countStaff.length === timeService.totalStaff) {
          return 3
        } else if (countStaff.findIndex(prev => prev.staff === staffSelected.value) === -1) {
          return 0
        } else {
          return 3
        }
      }
    }
  }

  function fetchData() {
    axios.get('/api/time-service/')
    .then(res=> {
      if(res.data.success) {
        setTimeService(res.data.data)
      }
    }).catch((e) => {
      toast.error('Không thể kết nối máy chủ')
    })  
  }
  useEffect(()=> {
    fetchData()
  }, [])

  const handleChangeDate = (date) => {
    setLoadingTime(true);
    setDate(date);
    setTimeout(()=> {
      setLoadingTime(false)
      clearTimeout();
    }, 500)
  }
  const handleStaffChange = (staff) => {
    setLoadingTime(true);
    setStaffSelected(staff);
    setTimeout(()=> {
      setLoadingTime(false)
      clearTimeout();
    }, 500)
  }

  const handleSubmitFormMaintence = (e) => {
    e.preventDefault();
    const form = {
      name: formData?.name,
      phone: formData?.phone,
      email: formData?.email,
      address: formData?.address,
      product: formData.product,
      staff: staffSelected ? staffSelected.value : null,
      staff_name: staffSelected ? staffSelected.label : null,
      user: formData.user,
      time: {
        id: timeServiceId.id,
        time: timeServiceId.time
      },
      dateTime: date,
    }
    if (timeServiceId.id && formData.product && staffSelected.value !== 'NV000') {
      axios.post("api/maintenance-service/create", form)
      .then(res => {
        setLoadingPage(true)
        if (res.data.success) {
          toast.success(res.data.data)
        }
        setLoadingPage(false)
        toast.error(res.data.message)
        return navigate('/maintenance-service')
      }).catch((e) => {
        toast.error(e.message)
      })
    } else {
      toast.error('Vui lòng chọn đủ thông tin')
    }

  }
  
return (
    <div className="my-moto">
      {loadingPage && <Loading /> }
      <div className="text-3xl py-4 border-b border-gray-400 px-2 w-full font-bold uppercase">
        <h1>Tạo lịch bảo dưỡng</h1>
      </div>
      <div className="container mt-4">
          <form onSubmit={handleSubmitFormMaintence}>
            <div className="my-10 sm:mt-0">
              <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="content__title">
                    Thông tin cá nhân Khách Hàng
                  </h3>
                  <p className="mt-1 text-sm text-gray-600"></p>
                </div>
              </div>
              <div className="mt-5 md:col-span-2 md:mt-0">
                  <SelectField
                    label="Người dùng" //lable name
                    options={listUser}
                    selected={userSelected}
                    onChange={handleSelectUser}
                  />
                </div>
              </div>
            </div>
            <div className="my-10 sm:mt-0">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="px-4 sm:px-0">
                    <h3 className="content__title">
                      Chọn xe bảo dưỡng
                    </h3>
                    <p className="mt-1 text-sm text-gray-600"></p>
                  </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <SelectField
                    label="Xe bảo dưỡng" //lable name
                    options={listVehicle}
                    selected={vehicleSelected}
                    onChange={handleSelectVehicle}
                  />
                </div>
              </div>
            </div>
            <div className="mt-10 mb-32 sm:mt-0">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="px-4 sm:px-0">
                    <h3 className="content__title">Nhân viên bảo dưỡng</h3>
                  </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <SelectField
                    label="Nhân viên" //lable name
                    options={listStaff}
                    selected={staffSelected}
                    onChange={handleStaffChange}
                  />
                </div>
              </div>
            </div>
            <div className="my-10 sm:mt-0">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="px-4 sm:px-0">
                    <h3 className="content__title">Thời gian đến bảo dưỡng <span className="text-red-500">*</span></h3>
                    <p className="mt-2">
                      Thời gian quý khách có thể đặt lịch là từ: <b className="mt-1 text-red-500">8h00 - 16h30</b>.
                      Quý khách vui lòng chọn trong khoảng thời gian này.
                    </p>
                    <p>Cảm ơn quý khách</p>
                  </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <div className="w-[300px]">
                    <InputField
                        label="Ngày"
                        name="date"
                        type="date"
                        min={moment(toDay).format('YYYY-MM-DD')}
                        required
                        defaultValue={moment(toDay).format('YYYY-MM-DD')}
                        onChange={(e) => handleChangeDate(e.target.value)}
                    />
                  </div>
                  <div className="p-4">
                    { loadingTime ?
                    <div className="rounded-md py-4 max-w-sm w-full">
                        <div className="animate-pulse space-x-2 flex justify-start">
                            <div className="rounded-full bg-red-500 h-6 w-6"></div>
                            <div className="rounded-full bg-green-500 h-6 w-6"></div>
                            <div className="rounded-full bg-yellow-500 h-6 w-6"></div>
                        </div>
                    </div> : 
                    <div className="flex flex-wrap">
                      { timeService.timeService && timeService.timeService.map((item, index) => 
                        {
                          if (handleCheckOverService(item) === 3) {
                            return (
                              <span key={index} className="btn-time bg-gray-300 opacity-70">
                                {item.time}
                              </span>
                            )
                          } else {
                            return <span key={index}
                              className={`btn-time ${timeServiceId.id === item._id ? 'bg-sky-500 text-white' : ''}`}
                              onClick={()=> setTimeServiceId({ id: item._id, time: item.time })}
                              >
                              {item.time}
                            </span>
                          }
                        }
                      )}
                    </div>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="py-5 mb-32">
            <div className="flex justify-end">
              <button type="submit" className="btn btn-info">
                Tạo lịch bảo dưỡng
              </button>
            </div>
          </div>
          </form>
        </div>
      </div>
  );
}
