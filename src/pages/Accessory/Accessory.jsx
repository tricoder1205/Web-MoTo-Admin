import axios from 'axios';
import SelectField from 'components/custom-field/SelectField';
import Loading from 'components/Loading';
import LoadingBox from 'components/LoadingBox';
import { useEffect, useState } from 'react';
import { ImFolderUpload } from 'react-icons/im';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Accessory = () => {
    document.title = 'Admin - Thông tin sản phẩm';
    const { id } = useParams();
    const [product, setAccessory] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);
    const [imageAccessory, setImageAccessory] = useState('');

    const [brandOption, setBrandOption] = useState([])
    const [brandSelected, setBrandSelected] = useState({
        label: '-- Chọn thương hiệu --',
        value: 0
    });

    useEffect(() => {
        axios.get('/api/brand/accessory')
        .then(res => {
            if (res.data.success) {
                const data = res.data.data
                const options = data.map((item) => ({
                    label: item.name,
                    value: item.name
                }))
                setBrandOption(options)
            }
        }).catch()
    }, [])
    const [typeOption, setTypeOption] = useState([])
    const [typeSelected, setTypeSelected] = useState({
        label: '-- Chọn loại phụ tùng --',
        value: 0
    });
    useEffect(() => {
        axios.get('/api/accessory-type')
        .then(res => {
            if (res.data.success) {
                const data = res.data.data
                const options = data.map((item) => ({
                    label: item.name,
                    value: item.name
                }))
                setTypeOption(options)
            }
        }).catch()
    }, [])

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        type: '',
        price: '',
        description: ''
    });

    const handleSetBrandForm = (e) => {
        setBrandSelected(e);
        setFormData(prev => ({
            ...prev,
            brand: e.value
        }))
    }
    const handleSetTypeForm = (e) => {
        setTypeSelected(e);
        setFormData(prev => ({
            ...prev,
            type: e.value
        }))
    }

    const handleFetchDataAccessory = (id) => {
        setLoadingPage(true)
        axios.get(`/api/accessory/${id}`)
        .then(res => {
            if(res.data.success) {
                const data = res.data.data;
                setAccessory(data);
                setFormData(() => ({
                    img: data.img || '',
                    name: data.name || '',
                    brand: data.brand || '',
                    type: data.type || '',
                    price: data.price || '',
                    description: data.description || ''
                }))
                setBrandSelected({
                    label: data.brand,
                    value: data.brand
                })
                setTypeSelected({
                    label: data.type,
                    value: data.type
                })
            }
            setLoadingPage(false)
        }).catch((e)=> console.log(e))
    }

    useEffect(() => {
        handleFetchDataAccessory(id);
    }, [id])

    const submitInfo = (e) => {
        e.preventDefault();
        setLoadingPage(true)
        axios.post('/api/accessory/update', {...formData, id})
        .then(res=>{
            if(res.data.success) {
                setAccessory(res.data.data)
                setLoadingPage(false)
                toast.success('Cập nhật thành công.')
            }
            setLoadingPage(false)
        })
        .catch(e => {
            toast.error(e.message)
        })
        if (imageAccessory) {
            const fi = new FormData()
            fi.append('id', id)
            fi.append('image', imageAccessory, imageAccessory.name)
            axios.put('/api/accessory/updateAccessoryImage', fi)
            .then(res=> {
                if(!res.data.success) {
                    toast.error('Hình ảnh cập nhật không thành công.')
                    setImageAccessory('')
                    setLoadingPage(false)
                }
            }).catch(e=>{
                setLoadingPage(false)
                toast.error(e.message)
            })
        }
        setLoadingPage(false)
    }

    return (
        <>
            {loading && <Loading />}
            {
                loadingPage ?  <LoadingBox /> :
                <div className="product">
                    <div className="product__title">
                        <div className="product__title-edit uppercase">Thông tin sản phẩm</div>
                    </div>
                    <div className="w-full flex justify-end items-center ">

                        <div className="updateForm__right-item">
                            <Link to={`/review/${product._id}`}>
                                <button className="btn btn-info">Đánh giá</button>
                            </Link>

                            <Link to={`/comment/${product._id}`}>
                                <button className="btn btn-pending">Bình luận</button>
                            </Link>
                        </div>
                        <div className="updateForm__right-item">
                            <div
                                className="btn btn-cancel"
                                // onClick={() => setModalConfig(true)}
                            >
                                Cấu hình
                            </div>
                        </div>
                    </div>
                    <div className="product__content">
                        <form className="updateForm xl:flex-row md:flex-col sm:flex-col" onSubmit={submitInfo} >
                            {/* left */}
                            <div className="updateForm__left w-2/5 lg:w-full md:lg:w-full md:w-full">
                                <div className="updateForm__left-item">
                                    <label className="item__label">Mã sản phẩm: </label>
                                    <span className="id w-full">{product._id}</span>
                                </div>
                                <div className="updateForm__left-item">
                                    <label htmlFor="name" className="item__label">Tên phụ tùng</label>
                                    <input id="name" className="item__input" type="text" value={formData?.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value}))} />
                                </div>
                                <label className="item__label">Hình sản phẩm: </label>
                                <div className="updateForm__left-item fileImage">
                                    <div className="w-3/5">
                                        <img className="leftImg" src={formData?.img} alt="" />
                                    </div>
                                    <div className="w-2/5 w-full">
                                        <div className="flex">
                                            <label htmlFor="product_img" className="choose border w-full border-gray-300 px-8 py-2 text-white hover:cursor-pointer text-2xl rounded-md bg-sky-500 hover:bg-sky-400">
                                                <ImFolderUpload />
                                            </label>
                                            <input className="leftFile" accept="image/png, image/jpeg" id="product_img" hidden type="file" onChange={e => setImageAccessory(e.target.files[0])} />
                                            <span>{imageAccessory?.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* right  */}
                            <div className="updateForm__right w-3/5 lg:w-full md:lg:w-full md:w-full">
                                <div className="updateForm__right-item">
                                    <label htmlFor="price" className="item__label">Giá phụ tùng: (₫)</label>
                                    <input id="price" className="item__input" type="text" value={formData?.price} onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value}))}/>
                                </div>
                                <div className="updateForm__left-item">
                                    <label className="item__label">Thương hiệu</label>
                                    <SelectField
                                        className="w-full"
                                        options={brandOption}
                                        selected={brandSelected}
                                        onChange={handleSetBrandForm}
                                    />
                                </div>
                                <div className="updateForm__left-item">
                                    <label className="item__label">Loại phụ tùng</label>
                                    <SelectField
                                        className="w-full"
                                        options={typeOption}
                                        selected={typeSelected}
                                        onChange={handleSetTypeForm} 
                                    />
                                </div>
                                <div className="updateForm__right-item mt-4">
                                    <label htmlFor="content" className="item__label">Mô tả chi tiết</label>
                                    <textarea
                                        id="content"
                                        className="w-full border rounded-lg p-2 h-32 resize-none border-blue-700 outline-none"
                                        type="text"
                                        value={formData?.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value}))}/>
                                </div>
                                <button type="submit" className="rightUpdate">Cập nhật</button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>
    )
}

export default Accessory
