import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';

import { DataGrid } from "@material-ui/data-grid";
import Loading from "components/Loading";
import LoadingBox from "components/LoadingBox";
import Modal from "components/Modal";
import MyMotoInfo from "./components/MyMotoInfo";
import './mymoto.scss';


export default function User(props) {
    const { id } = useParams()
    const [loadingPage, setLoadingPage] = useState(false);
    const [myMoTos, setMyMotos] = useState(false);
    const [myMoToDetail, setMyMoToDetail] = useState(false);
    const [motoId, setMotoId] = useState(false);
    
    // actions for comments    
    useEffect(() => {
        setLoadingPage(true);
        axios.get(`/api/my-mo-to/user/${id}`)
        .then(res => {
            if(res.data.success){
                setMyMotos(res.data.data)
            }
            setLoadingPage(false);
        })
    }, [id])

    const handleSelectMyMoto = (id) => {
        setMyMoToDetail(true)
        setMotoId(id)
    }

    const columns = [
        {
            field: 'id', headerName: 'Mã code', width: 250, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.id}</span>
                )
            }
        },
        {
            field: 'name', headerName: 'Tên xe', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="columnUser flex items-center">
                        <img className="columnUser__img w-16"
                            src={params.row.isAdmin ? params.row.image : params.row.image.split('\\').join('/')} alt="" />
                        <span>
                            {params.row.name}
                        </span>
                    </div>
                )
            }
        },
        {
            field: 'vehicle_type', headerName: 'Loại xe', width: 200, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.vehicle_type}</span>
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
            field: 'status', headerName: 'Trạng thái', width: 150, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="text">
                        {params.row.status === 1 && <div className="btn btn-received">Đang hoạt động</div>}
                        {params.row.status === 2 && <div className="btn btn-transport">Đang bán</div>}
                        {params.row.status === 3 && <div className="btn btn-cancel">Đã bán</div>}
                    </div>
                )
            }
        },
        {
            field: 'engineNumber', headerName: 'Số máy', width: 250, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.engineNumber}</span>
                )
            }
        },
        {
            field: 'frameNumber', headerName: 'Số khung', width: 250, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.frameNumber}</span>
                )
            }
        },
        {
            field: 'timeReceived', headerName: 'Thời gian nhận', width: 250, headerClassName: 'text', renderCell: (params) => {
                return (
                    <span className="text">{params.row.timeReceived}</span>
                )
            }
        },
        {
            field: 'action', headerName: 'Actions', width: 300, headerClassName: 'text', renderCell: (params) => {
                return (
                    <div className="behavior">
                        <button onClick={() => handleSelectMyMoto(params.row.id)} className="btn btn-info">Xem xe</button>
                    </div>
                )
            }
        },
    ]

    return (
        <div className="my-moto">
            <Link to="/users" className="btn btn-info">Quay lại</Link>
            <Modal show={myMoToDetail} setShow={setMyMoToDetail} title="Thông tin xe của khách hàng">
                <MyMotoInfo id={motoId} setLoadingPage={setLoadingPage}/>
            </Modal>
            {loadingPage && <Loading /> }
            <div className="userlist__header">
                <span className="userlist__header-title">Danh sách xe của khách hàng</span>
            </div>
            <div className="userlist__main">
                {myMoTos ?
                    <DataGrid
                        autoHeight
                        rowHeight={56}
                        disableSelectionOnClick
                        rows={myMoTos && myMoTos.map((user, index) => ({
                            id: user._id,
                            name: user.orderMoTo.name,
                            brand: user.orderMoTo.brand,
                            vehicle_type: user.orderMoTo.type,
                            image: user.orderMoTo.image,
                            status: user.orderMoTo.status,
                            frameNumber: user.frameNumber,
                            engineNumber: user.engineNumber,
                            timeReceived: user.timeReceived
                        }))}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />: <LoadingBox />
                }
            </div>
        </div>
    );
}
