import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';
import LoadingBox from 'components/LoadingBox';
import React, { useEffect, useState } from 'react';
import { ImBin } from 'react-icons/im';
import { RiCheckboxCircleLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const VehicleRegistration = () => {
    const [data, setData] = useState();
    // const [modal, setModal] = useState(false);

    const fetchVehicleRegistrationList = () => {
        axios.get('/api/vehicle-registration')
        .then(res => {
            if (res.data.success) {
            const data = res.data.data
            setData(data);
            }
        }).catch ((e) => {
            toast.error('Không thể kết nối máy chủ')
        })
    }

    useEffect(() => {
        fetchVehicleRegistrationList();
    }, []);
    
    const handleChangeStatusOrder = (id, status) => {
        axios.post(`api/vehicle-registration/status`, { id, status })
        .then(res => {
            if (res.data.success) {
                fetchVehicleRegistrationList()
                toast.success('Bạn đã xác nhận đơn hàng thành công.')
          }
        }).catch((e)=>{
          toast.error('Không thể kết nối máy chủ')
        })
    }

    const handleDelete = (id) => {
        let text = "Bạn có chắc chắn muốn xóa đơn này!";
        if (window.confirm(text) === true) {
            axios.delete(`/api/vehicle-registration/${id}`)
            .then(res => {
                if (res.data.success) {
                    setData(data.filter((item) => item._id !== id))
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                }
            }).catch(err => {
                toast.error('Không thể kết nối máy chủ');
            })
        }
    }
    const columns = [
        {
            field: 'user', headerName: 'Mã khách hàng', width: 280, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.user}</span>
                )
            }
        },
        {
            field: 'name', headerName: 'Tên khách hàng', width: 220, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.name}</span>
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
            field: 'product', headerName: 'Mã sản phẩm', width: 280, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.product}</span>
                )
            }
        },
        {
            field: 'time', headerName: 'Thời gian', width: 280, headerClassName: 'text', renderCell: (params) => {
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
                        <Link to={`/vehicle-registration/${params.row.id}`}>
                            <button className="btn btn-info">Chi tiết</button>
                        </Link>
                        <button className="btn btn-cancel" onClick={() => handleDelete(params.row.id)}>
                            <ImBin />
                        </button>
                    </div>
                )
            }
        },
    ]

    return (
        <div className="userlist p-2">
            <div className="userlist__header">
                <h1 className="userlist__header-title">Danh sách khách hàng đăng ký xe</h1>
            </div>
            <div className="userlist__main">
                {data ?
                    <DataGrid
                        autoHeight
                        rowHeight={56}
                        disableSelectionOnClick
                        rows={data && data.map((item, index) => ({
                            id: item._id, 
                            user: item.user,
                            product: item.product,
                            name: item.name,
                            image: item.image,
                            email: item.email,
                            phone: item.phone,
                            time: item.createdAt,
                            status: item.status
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

export default VehicleRegistration
