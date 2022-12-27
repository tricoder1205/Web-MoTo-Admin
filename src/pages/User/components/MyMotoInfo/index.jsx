import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import './my-mo-to.scss';
import InputField from "components/custom-field/InputField";
import SelectField from "components/custom-field/SelectField";
import { toast } from "react-toastify";

export default function MyMotoInfo (props) {
  const { id, setLoadingPage } = props
  const [motoDetail, setMotoDetail] = useState('')
  const [transform, setTransform] = useState()
  const [maintenanceDetail, setMaintenanceDetail] = useState({})
  const [maintenanceDetailNext, setMaintenanceDetailNext] = useState('')
  const [listStaff, setListStaff] = useState(null);
  const [staffSelected, setStaffSelected] = useState({
    label: 'Ngẫu nhiên',
    value: 'NV000',
  })
  const fetchApiData = (id) => {
    axios.get(`/api/my-mo-to/${id}`)
    .then(res => {
        if(res.data.success){
          setMotoDetail(res.data.data);
        }
    })
  }

  useEffect(() => {
    fetchApiData(id)
  }, [id])

  const handleCheckStatus = (item) => {
    let result = {}
    if (item.status === 1) {
      result = {
        style: 'used',
        msg: 'Đã sử dụng' 
      }
    }
    if (item.status === 2) {
        result = {
          style: 'active-moto',
          msg: 'Hiện tại' 
        }
      }
    if (item.status === 0) {
      result = {
        style: 'normal',
        msg: '' 
      }
    }
    if (item.status === 3) {
      result = {
        style: 'disable',
        msg: 'Không dùng' 
      }
    }
    return result
  }
  

  useEffect(() => {
    axios.get("/api/staff")
    .then(res => {
      if (res.data.success) {
        const data = res.data.data
        const motoOptions = data.map((val) => ({
          label: val.name,
          value: val._id
        }))
        setListStaff(motoOptions)
      }
    }).catch ((e) => {
      toast.error('Không thể kết nối máy chủ')
    })
  }, [])
  const handleStaffChange = (e) => {
    setStaffSelected(e)
    setFormData(prev => ({...prev, staff: e.label}))
  }
  const handleSelectMaintenan = (item, index) => {
    setMaintenanceDetail(item)
    if(index < 9) {
      setMaintenanceDetailNext(motoDetail.maintenanceTimes[index + 1]._id)
    }
    setTransform({transform: 'translateY(0)', opacity: 1})
  }

  const [formData, setFormData] = useState({
    time: '',
    staff: staffSelected.label,
    description: ''
  })

  const handleUpdateInfoMaintenan = () => {
    setLoadingPage(true)
    let count=0
    Object.entries(formData).map(([key, val]) => {
      if(val !== ''){
        if (key === 'staff') {
          if (val.value !== 'NV000') {
            return count++;
          }
        } else {
          return count++;
        }
      }
      return toast.warn(key + ' Không được để trống');
    })
    if (count === 3) {
      axios.post('/api/maintenance-coupon/update', {
        ...formData,
        nextMaintenance: maintenanceDetailNext,
        id: maintenanceDetail._id
      })
      .then(res => {
        if (res.data.success) {
          fetchApiData(id)
          setLoadingPage(false)
          toast.success('Cập nhật thành công')
          setTransform(({ transform: 'translateY(200%)', opacity: 0 }))
        }
      }).catch ((e) => {
        setLoadingPage(false)
        toast.error('Không thể kết nối máy chủ')
      })
    }
    setLoadingPage(false)
}

return (
  <div>
  { motoDetail &&
    <div className="my-moto-info">
      <div className="content">
        <div className="content-item">
          <p className="item-name">Tên xe: </p>
          <span>{motoDetail.orderMoTo.name}</span>
        </div>
        <div className="content-item">
          <p className="item-name">Số Khung: </p>
          <span>{motoDetail.frameNumber }</span>
        </div>
        <div className="content-item">
          <p className="item-name">Số Máy: </p>
          <span>{motoDetail.engineNumber}</span>
        </div>
        <div className="content-item">
          <p className="item-name">Ngày nhận xe: </p>
          <span>{ moment(motoDetail.timeReceived).format('DD/MM/YYYY hh:mm') }</span>
        </div>
      </div>
      <h2 className="maintenance-title2">Lịch bảo dưỡng</h2>
      <div className="maintenance-schedule">
        {
            motoDetail.maintenanceTimes.map((item, index) => {
              return (
              <div
                key={index}
                className={`maintenance-item ${handleCheckStatus(item).style}`}
                onClick={() => handleSelectMaintenan(item, index)}>
                <p className="item-name">P{index + 1}</p>
                <span className="item-status">
                  { handleCheckStatus(item).msg}
                </span>
                <div className="item-date">
                  <p>Từ: {moment(Number(item.startDate)).format('DD/MM/YYYY')}</p>
                  <p>- {moment(item.finishDate).format('DD/MM/YYYY')}</p>
                </div>
              </div>
            )})
          }
      </div>
        <div className="over-detail-wrap" style={{ ...transform }}>
          <div className="over-detail" style={{ ...transform }}>
            <h1 className="over-detail-title">
              Chi tiết lịch sử sữa chữa
            </h1>
            {
              maintenanceDetail?.status === 1 ? 
              <div className="over-detail-content">
                <div className="content-item">
                  <b>Ngày làm dịch vụ:</b>
                  <p>{maintenanceDetail.timeUsed && moment(maintenanceDetail.timeUsed).format('DD/MM/YYYY hh:mm') }</p>
                </div>
                <div className="content-item">
                  <b>Kỹ thuật viên:</b>
                  <p>{maintenanceDetail && maintenanceDetail.staff}</p>
                </div>
                <div className="content-description">
                  <p><b>Mô tả:</b></p>
                  <textarea readOnly value={maintenanceDetail && maintenanceDetail.description} placeholder="Mô tả công việc..."/>
                </div>
              </div> : maintenanceDetail?.status === 2 ?
                <div className="over-detail-content">
                  <span className={`over-detail-status ${handleCheckStatus(maintenanceDetail).style}`}>
                    {handleCheckStatus(maintenanceDetail).msg}
                  </span>
                  <div className="content-item">
                    <InputField
                      label="Ngày làm dịch vụ:"
                      name="date_service"
                      type="datetime-local"
                      required
                      defaultValue={formData&& formData.updateAt}
                      onChange={(e) => setFormData(prev => ({...prev, time: e.target.value }))}
                    />
                  </div>
                  <div className="content-item w-full">
                      <SelectField
                        label="Kỹ thuật viên:" //lable name
                        options={listStaff}
                        selected={staffSelected}
                        onChange={handleStaffChange}
                      />
                  </div>
                  <div className="content-description">
                    <p><b>Mô tả:</b></p>
                    <textarea
                    value={formData && formData.description}
                    placeholder="Mô tả công việc..."
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value }))}
                    />
                  </div>
                </div> :
              <div className="over-detail-content">
                <span className={`over-detail-status ${handleCheckStatus(maintenanceDetail).style}`}>
                  {handleCheckStatus(maintenanceDetail).msg}
                </span>
                <div className="content-item">
                  <b>Ngày làm dịch vụ:</b>
                  <p>{maintenanceDetail && moment(maintenanceDetail.updateAt).format('DD/MM/YYYY')}</p>
                </div>
                <div className="content-item">
                  <b>Kỹ thuật viên:</b>
                  <p>{maintenanceDetail && maintenanceDetail.staff}</p>
                </div>
                <div className="content-description">
                  <p><b>Mô tả:</b></p>
                  <textarea readOnly value={maintenanceDetail && maintenanceDetail.description} placeholder="Mô tả công việc..."/>
                </div>
              </div> 
            } 
            <p className="w-full text-right my-4">
            {
              maintenanceDetail?.status === 2 && 
              <span
                className="btn btn-info"
                onClick={handleUpdateInfoMaintenan}>
                  Cập nhật
              </span>
              }
              <span
                className="btn btn-cancel"
                onClick={()=>setTransform(({
                  transform: 'translateY(200%)', opacity: 0
                  }))
                }>
                  Đóng
              </span>
            </p>
          </div>
      </div>
    </div>
    }
  </div>
)}
