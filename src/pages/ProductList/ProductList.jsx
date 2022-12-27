import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';
import LoadingBox from 'components/LoadingBox';
import Modal from 'components/Modal';
import { useEffect, useState } from 'react';
import { ImBin } from 'react-icons/im';

import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import numberWithCommas from 'utils/numberWithCommas';

const ProductList = () => {

    document.title = "Admin - Products"

    const [data, setData] = useState();
    const [modal, setModal] = useState(false);
    const [idSelectDel, setIdSelectDel] = useState('');

    const fetchProductList = async () => {
        const products = await axios.get('/api/products');
        const ProductList = products.data || [];
        setData(ProductList);
    }
    useEffect(() => {
        fetchProductList();
    }, []);

    const handleOpenModalDel = (id) => {
        setModal(true);
        setIdSelectDel(id);
    }

    const handleDelete = (id) => {
        axios.delete(`/api/products/deleteProduct/${idSelectDel}`)
        .then(res => {
            if (res.data.success) {
                fetchProductList();
                setModal(false);
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
            field: 'id', headerName: 'Mã SP', width: 220, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.id}</span>
                )
            }
        },
        {
            field: 'name', headerName: 'Tên Xe', width: 220, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="columnImg">
                        <img className="columnImg__img" src={params.row.img} alt="" />
                        <span>
                            {params.row.name}
                        </span>
                    </div>
                )
            }
        },
        {
            field: 'brand', headerName: 'Thương hiệu', width: 200, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.brand}</span>
                )
            }
        },
        {
            field: 'type', headerName: 'Dòng xe', width: 200, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.type}</span>
                )
            }
        },
        {
            field: 'promotion_code', headerName: 'Mã khuyến mãi', width: 200, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.promotion_code}</span>
                )
            }
        },
        {
            field: 'price', headerName: 'Giá', width: 130, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">
                        {numberWithCommas(params.row.price)}₫
                    </span>
                )
            }
        },

        {
            field: 'power', headerName: 'Phân khúc', width: 200, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.power}</span>
                )
            }
        },
        {
            field: 'isAdmin', headerName: 'Admin', width: 200, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="behavior">
                        <Link to={`/product/${params.row.id}`}>
                            <button className="btn btn-info">Chi tiết</button>
                        </Link>
                        <button className="btn btn-cancel"
                            onClick={() => handleOpenModalDel(params.row.id)}
                            >
                            <ImBin />
                        </button>
                    </div>
                )
            }
        },
    ]

    return (
        <div className="productlist">
            <Modal show={modal} setShow={setModal} size="sm:max-w-lg" title="Xác nhận xóa sản phẩm">
                <div className="mt-2">
                <p className="text-xl text-gray-800">
                    Bạn có chắc chắn muốn xóa sản phẩm này?
                </p>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={ ()=> handleDelete() }
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
            <div className="productlist__header">
                <span className="productlist__header-title">Danh sách Xe Mo To</span>
                <Link to='/create-product' >
                    <button className="btn btn-info">Thêm sản sản phẩm</button>
                </Link>
            </div>
            {data ?
                <DataGrid
                    disableSelectionOnClick
                    rows={data && data.map((item, index) => ({
                        id: item._id,
                        name: item.name,
                        img: item.img,
                        brand: item.brand,
                        price: item.price,
                        power: item.power,
                        type: item.type,
                        promotion_code: item.promotion_id ? item.promotion_id.code : ''
                    }))}
                    columns={columns}
                    pageSize={10}
                    autoHeight
                    // rowsPerPageOptions={[5]}
                    rowsPerPageOptions={[10]}
                />: <LoadingBox />
            }
        </div>
    )
}

export default ProductList
