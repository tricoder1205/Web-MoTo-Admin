import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';
import LoadingBox from 'components/LoadingBox';
import Modal from 'components/Modal';
import { useEffect, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { ImBin } from 'react-icons/im';
import { toast } from 'react-toastify';

const AccessoryType = () => {
    document.title = "Admin - Accessory - Type"

    const [data, setData] = useState();
    const [modal, setModal] = useState(false);
    const [nameAccessoryType, setNameAccessoryType] = useState(false);
    const [idSelectDel, setIdSelectDel] = useState('');
    const [modalAddAccessoryType, setModalAddVehicle] = useState(false);
    const [modalEditAccessoryType, setModalEditAccessoryType] = useState(false);
    const [idAccessoryType, setIdAccessoryType] = useState();

    const fetchAccessoryTypeList = () => {
        setData(null)
        axios.get('/api/accessory-type')
        .then(res => {
            if(res.data.success) {
                setData(res.data.data)
            }
        }).catch(err => console.log(err))
    }
    useEffect(() => {
        fetchAccessoryTypeList();
    }, []);

    const handleOpenModalDel = (id) => {
        setModal(true);
        setIdSelectDel(id);
    }
    
    const handleOpenModalEdit = (id) => {
        axios.get(`/api/accessory-type/${id}`, { name: nameAccessoryType })
        .then(res=> {
            if(res.data.success) {
                setIdAccessoryType(res.data.data);
                setModalEditAccessoryType(true);
            }
        }).catch((e) => {
            console.log(e.message)
        })
    }
    const handleDelete = () => {
        axios.delete(`/api/accessory-type/${idSelectDel}`)
        .then(res => {
            if (res.data.success) {
                fetchAccessoryTypeList();
                setModal(false);
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        }).catch(err => {
            toast.error('Không thể kết nối máy chủ');
        })
    }

    const handleAddVehicle = () => {
        axios.post('/api/accessory-type/create', { name: nameAccessoryType })
        .then(res => {
            if (res.data.success) {
                fetchAccessoryTypeList();
                setModalAddVehicle(false);
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        }).catch(err => {
            toast.error('Không thể kết nối máy chủ');
        })
    }

    const columns = [
        {
            field: 'id', headerName: 'Mã loại phụ tùng', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.id}</span>
                )
            }
        },
        {
            field: 'name', headerName: 'Tên loại phụ tùng', width: 300, headerClassName: 'text', renderCell: (params) => {
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
            field: 'action', headerName: 'Actions', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="behavior">
                        <button className="btn btn-pending" onClick={()=> handleOpenModalEdit(params.row.id)}>
                            <FaRegEdit />
                        </button>
                        <button className="btn btn-cancel" 
                            onClick={()=> handleOpenModalDel(params.row.id)}>
                            <ImBin />
                        </button>
                    </div>
                )
            }
        },
    ]

    return (
        <div className="userlist p-2">
            <Modal show={modal} setShow={setModal} size="sm:max-w-lg" title="Xác nhận xóa loại phụ tùng">
                <div className="mt-2">
                <p className="text-xl text-gray-800">
                    Bạn có chắc chắn muốn xóa loại phụ tùng?
                </p>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={()=> handleDelete()}
                >
                    Xác nhận
                </button>
                <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={()=> setModal(false)}
                >
                    Bỏ qua
                </button>
                </div>
            </Modal>
            <Modal show={modalAddAccessoryType} setShow={setModalAddVehicle} size="sm:max-w-lg" title="Thêm loại phụ tùng">
                <div className="form__item">
                    <label htmlFor="name" className="form__item__label text-lg font-bold">Tên loại phụ tùng</label>
                    <input
                        className="form__item__input"
                        type="text"
                        id="brand"
                        placeholder="Tên loại phụ tùng"
                        onChange={(e) => setNameAccessoryType(e.target.value) } />
                </div>
                <div className="w-full text-right">
                    <button className="btn btn-info" onClick={handleAddVehicle}>Thêm mới</button>
                </div>
            </Modal>
            <Modal show={modalEditAccessoryType} setShow={setModalEditAccessoryType} size="sm:max-w-lg" title="Thêm loại phụ tùng">
                <div className="form__item">
                    <label htmlFor="name" className="form__item__label text-lg font-bold">Chỉnh sửa loại phụ tùng</label>
                    <input
                        className="form__item__input"
                        type="text"
                        id="brand"
                        placeholder="Tên loại phụ tùng"
                        value={idAccessoryType?.name}
                        onChange={(e) => setNameAccessoryType(e.target.value) } />
                </div>
                <div className="w-full text-right">
                    <button className="btn btn-info" onClick={handleAddVehicle}>Thêm mới</button>
                </div>
            </Modal>
            <div className="userlist__header">
                <span className="userlist__header-title">Danh sách Loại Xe</span>
                <button className="btn btn-info" onClick={()=>setModalAddVehicle(true)}>Thêm mới loại xe</button>
            </div>
            <div className="userlist__main">
                {data ?
                    <DataGrid
                        autoHeight
                        rowHeight={56}
                        disableSelectionOnClick
                        rows={data && data.map((brand, index) => ({
                            id: brand._id,
                            name: brand.name
                            })
                        )}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />: <LoadingBox />
                }
            </div>
        </div>
    )
}

export default AccessoryType
