import { DataGrid } from '@material-ui/data-grid';
import { listUsers } from 'actions/userAction';
import axios from 'axios';
import LoadingBox from 'components/LoadingBox';
import Modal from 'components/Modal';
import { useEffect, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { ImBin } from 'react-icons/im';
import { RiCheckboxCircleLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import MaintenanceDetail from './components/MaintenanceDetail';
import './maintenance-service.scss'

const MaintenanceService = () => {
    document.title = "Admin - Users"

    const [data, setData] = useState();
    const [modal, setModal] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [selectMainDetail, setSelectMainDetail] = useState('');
    const [idSelectDel, setIdSelectDel] = useState('');

    const fetchMaintenanceList = async () => {
        const services = await axios.get('/api/maintenance-service');
        const serviceList = services.data.data || [];
        setData(serviceList);
    }
    useEffect(() => {
        fetchMaintenanceList();
    }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(listUsers());
    }, [dispatch]);

    const handleShowModalDetail = (id) => {
        setModal(true)
        setSelectMainDetail(id)
    }

    const handleChangeStatusOrder = (id, status) => {
        axios.post(`api/maintenance-service/status`, { id, status })
        .then(res => {
            if (res.data.success) {
                fetchMaintenanceList()
                toast.success('Bạn đã xác nhận đơn hàng thành công.')
          }
        }).catch((e)=>{
          toast.error('Không thể kết nối máy chủ')
        })
    }

    const handleOpenModalDel = (id) => {
        setModalDelete(true);
        setIdSelectDel(id);
    }

    const handleDeleteMaintenance = () => {
        axios.delete(`api/maintenance-service/${idSelectDel}`)
        .then(res => {
            if (res.data.success) {
                fetchMaintenanceList()
                setModalDelete(false);
                toast.success(res.data.data)
            }
        }).catch((e)=>{
            setModalDelete(false);
            toast.error('Không thể kết nối máy chủ')
        })
    }

    const columns = [
        {
            field: 'id', headerName: 'Mã ĐH', width: 250, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.id}</span>
                )
            }
        },
        {
            field: 'name', headerName: 'Tên KH', width: 220, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="columnUser">
                        <span>
                            {params.row.name}
                        </span>
                    </div>
                )
            }
        },
        {
            field: 'staff', headerName: 'Tên Nhân Viên', width: 220, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="columnUser">
                        <span>
                            {params.row.staff}
                        </span>
                    </div>
                )
            }
        },
        {
            field: 'email', headerName: 'Email', width: 200, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.email}</span>
                )
            }
        },
        {
            field: 'phone', headerName: 'Số điện thoại', width: 250, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.phone}</span>
                )
            }
        },
        {
            field: 'address', headerName: 'Địa chỉ', width: 250, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.address}</span>
                )
            }
        },
        {
            field: 'dateTime', headerName: 'Ngày đặt', width: 250, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.dateTime}</span>
                )
            }
        },
        {
            field: 'time', headerName: 'Thời gian', width: 250, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.time}</span>
                )
            }
        },
        {
            field: 'status', headerName: 'Trạng thái', width: 250, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">
                        {params.row.status === 0 &&
                            <div className="flex items-center">
                                <span className="btn btn-pending">Chờ xử lý</span>
                                <span className="btn item-received text-xl" onClick={() => handleChangeStatusOrder(params.row.id, 2)}>
                                    <RiCheckboxCircleLine />
                                </span>
                            </div>}
                        {params.row.status === 5 &&
                            <div className="flex items-center">
                                <span className="btn btn-pending">Yêu cầu hủy đơn</span>
                                <span className="btn item-received text-xl" onClick={() => handleChangeStatusOrder(params.row.id, -1)}>
                                    <RiCheckboxCircleLine />
                                </span>
                            </div>}
                        {params.row.status === 1 && <div className="btn item-received">Hoàn tất</div>}
                        {params.row.status === 2 && <div className="btn item-transport">Đã tiếp nhận</div>}
                        {params.row.status === -1 && <div className="btn item-cancle">Đã hủy</div>}
                    </span>
                )
            }
        },
        {
            field: 'action', headerName: 'Actions', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="behavior">
                        <button className="btn btn-pending" onClick={()=>handleShowModalDetail(params.row.id)}>
                            <FaRegEdit />
                        </button>
                        <button className="btn btn-cancel" onClick={()=>handleOpenModalDel(params.row.id)}>
                            <ImBin />
                        </button>
                    </div>
                )
            }
        },
    ]

    return (
        <div className="userlist p-2">
            <Modal show={modalDelete} setShow={setModalDelete} size="sm:max-w-lg" title="Xác nhận xóa đơn bảo dưỡng">
                <div className="mt-2">
                <p className="text-xl text-gray-800">
                    Bạn có chắc chắn muốn xóa đơn bảo dưỡng?
                </p>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={ ()=> handleDeleteMaintenance() }
                >
                    Xác nhận
                </button>
                <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={()=>setModalDelete(false)}
                >
                    Bỏ qua
                </button>
                </div>
            </Modal>
            <Modal show={modal} setShow={setModal} title="Thông tin đơn hàng" size="sm:max-w-4xl">
                <MaintenanceDetail id={selectMainDetail} setModal={setModal} refreshTable={fetchMaintenanceList} />
            </Modal>
            <div className="userlist__header">
                <span className="userlist__header-title">Danh sách bảo dưỡng</span>
                <Link to='/create-maintenance' className="btn btn-info">Tạo mới</Link>
            </div>
            <div className="userlist__main">
                {data ?
                    <DataGrid
                        autoHeight
                        rowHeight={56}
                        disableSelectionOnClick
                        rows={data && data.map((item, index) => ({
                            id: item._id,
                            name: item.name,
                            email: item.email,
                            phone: item.phone,
                            address: item.address,
                            status: item.status,
                            staff: item.staff?.name,
                            dateTime: item.dateTime,
                            time: item.timeService
                        }))}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />: <LoadingBox />
                }
            </div>
        </div>
    )
}

export default MaintenanceService
