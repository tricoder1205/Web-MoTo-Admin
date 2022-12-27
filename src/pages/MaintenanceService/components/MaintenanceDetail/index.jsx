import axios from "axios";
import InputField from "components/custom-field/InputField";
import SelectField from "components/custom-field/SelectField";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { toast } from "react-toastify";
import SelectedStatus from "./SelectedStatus";

export default function MaintenanceDetail(props) {
  const { id, refreshTable, setModal } = props;
  const [mainten, setMainten] = useState();
  const [loading, setLoading] = useState();
  const [listStaff, setListStaff] = useState(null);
  const [staffSelected, setStaffSelected] = useState({
    label: 'Nhân viên',
    value: 'NV000',
  })
  const [formData, setFormData] = useState({
    time: '',
    staff: '',
    description: ''
  })

  const getDataStaffApi = async () => {
    axios.get("api/staff")
    .then(res => {
      if (res.data.success) {
        const data = res.data.data
        const motoOptions = data.map((val) => ({
          label: val.name,
          img: val.image,
          value: val._id
        }))
        setListStaff(motoOptions)
      }
    }).catch ((e) => {
      toast.error('Không thể kết nối máy chủ')
    })
  }

  const getDataMaintenanceApi = async (id) => {
    axios.get(`api/maintenance-service/${id}`)
    .then((res) => {
      if (res.data.success) {
        const data = res.data.data
        setMainten(data);
        setStaffSelected({
          label: data.staff.name,
          value: data.staff._id,
        })
        setFormData(prev => ({
          ...prev,
          time: data.dateTime,
          staff: data.staff,
          description: data.description,
        }))
      } else {
        toast.error("Không thể kết nối máy chủ");
      }
      setLoading(false);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  useEffect(() => {
    getDataStaffApi()
  }, [])

  useEffect(() => {
    setLoading(true);
    getDataMaintenanceApi(id)
  }, [id]);
  const handleSelectStaff = (e) => {
    setStaffSelected(e)
    setFormData(prev => ({ ...prev, staff: e.value }))
  }

  const handleUpdateMaintenance= (e) => {
    e.preventDefault();
    let count=0
    Object.entries(formData).map(([key, val]) => {
      if (!val) {
        toast.warn('Vui lòng chọn ', key)
        return count 
      } else {
        return count++
      }
    })
    if(count === 3){
      axios.post('/api/maintenance-service/update-info',{
        id,
        ...formData
      }).then(res=> {
        if(res.data.success) {
          refreshTable()
          setModal(false)
          toast.success('Cập nhật thành công.')
        }
      }).catch((e) => {
        toast.error('Server error: ' + e.message);
      })
    }
  }

  return (
    <>
      <div className="maintenance-list-item">
        {loading ? (
          <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-slate-700 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-700 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          mainten && (
            <form onSubmit={handleUpdateMaintenance}>
              { mainten.status !== -1 && mainten.status !== 1 &&
                <div className="flex items-center justify-between border-b mb-2">
                  <span>Thay đổi trạng thái đơn hàng: </span>
                  <span className="w-1/2">
                    <SelectedStatus
                      id={id}
                      mainten={mainten}
                      refreshTable={refreshTable}
                      loading={setLoading}
                    />
                  </span>
                </div>
              }
              <div className="item-top">
                <div className="item-top-left">
                  <h2 className="text-lg">
                    <b>Mã đơn hàng: </b> <i>{mainten._id}</i>
                  </h2>
                  <p>
                    <AiOutlineClockCircle />
                    <i>
                      {" "}
                      Ngày đặt hàng:{" "}
                      {moment(mainten.createdAt).format("DD/MM/YYYY hh:mm")}
                    </i>
                  </p>
                </div>
                <div className="item-top-status_right">
                  <div
                    className={`btn btn-${
                      mainten.status === 0
                        ? "pending"
                        : mainten.status === 2
                        ? "transport"
                        : mainten.status === 1
                        ? "received"
                        : "cancel"
                    }`}
                  >
                    {mainten.status === 0
                      ? "Đang xử lý"
                      : mainten.status === 2
                      ? "Đã tiếp nhận"
                      : mainten.status === 1
                      ? "Đã hoàn tất"
                      : "Đã hủy"}
                  </div>
                </div>
              </div>
              <div className="item-content-main">
                <div className="item-content-main-info">
                  <p>
                    <b>Tên xe:</b> {mainten.product.name}
                  </p>
                  <p>
                    <b>Khung xe:</b> {mainten.product.engineNumber}
                  </p>
                  <p>
                    <b>Số Máy:</b> {mainten.product.frameNumber}
                  </p>
                </div>
                <div className="item-content-main-right">
                  <InputField
                    type="datetime-local"
                    label="Ngày bảo dưỡng:"
                    name="time"
                    defaultValue={moment(mainten.dateTime).format('YYYY-MM-DD h:mm:ss')}
                    required
                    disabled={mainten.status === -1 || mainten.status === 1}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="mr-10"
                  />
                  {
                    mainten.status === -1 || mainten.status === 1 ?
                    <InputField
                      type="text"
                      label="Nhân viên"
                      name="time"
                      defaultValue={mainten.staff.name}
                      disabled={true}
                      className="mr-10"
                    /> :
                    <SelectField
                      label="Nhân viên" //lable name
                      options={listStaff}
                      required 
                      selected={staffSelected}
                      onChange={handleSelectStaff}
                    />
                  }
                  <p>
                    <b>Chi tiết dịch vụ:</b>
                    <textarea
                      id="content"
                      className="w-full border rounded-lg p-2 h-32 resize-none border-blue-700 outline-none"
                      required
                      disabled={mainten.status === -1 || mainten.status === 1}
                      type="text"
                      value={formData?.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value}))}
                    />
                  </p>
                </div>
              </div>
              <div className="w-full text-right">
                {
                  mainten.status !== -1 && mainten.status !== 1 &&
                  <button type="submit" className="btn btn-info">Cập nhật</button>
                }
              </div>
            </form>
          )
        )}
      </div>
    </>
  );
}
