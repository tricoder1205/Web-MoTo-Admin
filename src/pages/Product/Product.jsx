import axios from 'axios';
import SelectField from 'components/custom-field/SelectField';
import Loading from 'components/Loading';
import LoadingBox from 'components/LoadingBox';
import Modal from 'components/Modal';
import { useEffect, useState } from 'react';
import { ImFolderUpload } from 'react-icons/im';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Product = () => {
    document.title = 'Admin - Thông tin sản phẩm';
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);
    const [modal, setModal] = useState(false);
    const [imageProduct, setImageProduct] = useState('');
    const [backgroundProduct, setBackgroundProduct] = useState('');
    const [imageColor, setImageColor] = useState({});
    const [nameColor, setNameColor] = useState({});
    const [nameDeleteColor, setNameDeleteColor] = useState({});
    
    const [powerSelected, setPowerSelected] = useState({
        label: '-- Chọn dung tích --',
        value: 0
    });

    const [brandOption, setBrandOption] = useState([])
    const [brandSelected, setBrandSelected] = useState({
        label: '-- Chọn dung tích --',
        value: 0
    });
    useEffect(() => {
        axios.get('/api/brand')
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
        label: '-- Chọn dung tích --',
        value: 0
    });
    useEffect(() => {
        axios.get('/api/vehicle-type')
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
        power: 0,
        description: '',
        dungtich: 0,
        momenxoan: 0,
        trongluong: 0,
        maluc: 0,
        link_youtube: '',
        content: ''
    });

    const listPower = [
        { label: '150', value: 150 },
        { label: '250', value: 250 },
        { label: '300', value: 300 },
        { label: '400', value: 400 },
        { label: '500', value: 500 },
        { label: '600', value: 600 },
        { label: '700', value: 700 },
        { label: '800', value: 800 },
        { label: '900', value: 900 },
        { label: '1000', value: 1000 },
        { label: '1001', value: 1000 }
    ]
    const handleSetPowerForm = (e) => {
        setPowerSelected(e);
        setFormData(prev => ({
            ...prev,
            power: e.value
        }))
    }
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

    const handleFetchDataProduct = (id) => {
        setLoadingPage(true)
        axios.get(`/api/products/${id}`)
        .then(res => {
            if(res.data.success) {
                const data = res.data.data;
                setProduct(data);
                setFormData(() => ({
                    img: data.img || '',
                    background_img: data.background_img || '',
                    name: data.name || '',
                    brand: data.brand || '',
                    type: data.type || '',
                    price: data.price || '',
                    description: data.description || '',
                    dungtich: data.dungtich || 0,
                    momenxoan: data.momenxoan || 0,
                    trongluong: data.trongluong || 0,
                    maluc: data.maluc || 0,
                    link_youtube: data.link_youtube || '',
                    content: data.content || ''
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
        handleFetchDataProduct(id);
    }, [id]);

    const [modalConfig, setModalConfig] = useState(false);

    const handleAddNewColor = () => {
        const form = new FormData();
        if (!nameColor || !imageColor) return toast.warning('Vui lòng điền đủ thông tin')
        
        form.append('image', imageColor, imageColor.name);
        form.append('name', nameColor);
        form.append('id', id);
        setLoading(true)
        axios.put('/api/products/add-color', form)
        .then(res => {
            if (res.data.success) {
                handleFetchDataProduct(id);
            }
            setLoading(false)
        }).catch((e)=> {
            setLoading(false)
            toast.error(e.message)
        })
    }

    const submitInfo = (e) => {
        e.preventDefault();
        axios.post('/api/products/update', {...formData, id})
        .then(res=>{
            if(res.data.success) {
                setProduct(res.data.data)
                toast.success('Cập nhật thành công.')
            }
        })
        .catch(e => {
            toast.error(e.message)
        })
        if (backgroundProduct) {
            const fb = new FormData()
            fb.append('type', 'background')
            fb.append('id', id)
            fb.append('image', backgroundProduct, backgroundProduct.name)
            axios.put('/api/products/updateProductImage', fb)
            .then(res=> {
                if(!res.data.success) {
                    toast.error('Hình ảnh cập nhật không thành công.')
                    setBackgroundProduct('')
                }
            }).catch(e=>{
                toast.error(e.message)
            })
        }
        if (imageProduct) {
            const fi = new FormData()
            fi.append('type', 'img')
            fi.append('id', id)
            fi.append('image', imageProduct, imageProduct.name)
            axios.put('/api/products/updateProductImage', fi)
            .then(res=> {
                if(!res.data.success) {
                    toast.error('Hình ảnh cập nhật không thành công.')
                    setImageProduct('')
                    
                }
            }).catch(e=>{
                toast.error(e.message)
            })
        }
    }

    const handleSetNameDeleteColor = (name, url) => {
        setModal(true)
        setNameDeleteColor({ name, url })
    }

    const handleDeleteColor = () => {
        axios.put('/api/products/remove-color', { id, name: nameDeleteColor.name, url: nameDeleteColor.url })
            .then(res=> {
                if(res.data.success) {
                    setModal(false)
                    handleFetchDataProduct(id)
                    toast.success('Xóa thành công.')
                }
            }).catch(e=>{
                toast.error(e.message)
            })
        
    }

    return (
        <>
            <Modal show={modal} setShow={setModal} size="sm:max-w-lg" title="Xác nhận xóa màu sản phẩm">
                <div className="mt-2">
                <p className="text-xl text-gray-800">
                    Bạn có chắc chắn muốn xóa màu sản phẩm?
                </p>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={ ()=> handleDeleteColor() }
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
            {loading && <Loading />}
            {/* {modalConfig && <AddConfig productId={id} close={setModalConfig} />} */}
            {
                !product && loadingPage ?  <LoadingBox /> :
                <div className="product">
                    <div className="product__title">
                        <div className="product__title-edit uppercase">Thông tin sản phẩm</div>
                    </div>
                    <div className="w-full flex justify-end items-center ">

                        <div className="updateForm__right-item">
                            <Link to={`/review/${id}`}>
                                <button className="btn btn-info">Đánh giá</button>
                            </Link>

                            <Link to={`/comment/${id}`}>
                                <button className="btn btn-pending">Bình luận</button>
                            </Link>
                        </div>
                        <div className="updateForm__right-item">
                            <Link to={`/product/config/${id}`} className="btn btn-cancel">
                                Thông số kỹ thuật
                            </Link>
                        </div>
                    </div>
                    <div className="product__content">
                        <form className="updateForm xl:flex-row md:flex-col sm:flex-col" onSubmit={submitInfo} >
                            {/* left */}
                            <div className="updateForm__left w-2/5 lg:w-full md:lg:w-full md:w-full">
                                <div className="updateForm__left-item">
                                    <label className="item__label">Mã sản phẩm: </label>
                                    <span className="id w-full">{id}</span>
                                </div>
                                <div className="updateForm__left-item">
                                    <label htmlFor="name" className="item__label">Tên xe</label>
                                    <input id="name" className="item__input" type="text" value={formData?.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value}))} />
                                </div>
                                <label className="item__label">Hình banner sản phẩm: </label>
                                <div className="updateForm__left-item fileImage">
                                    <div className="w-3/5">
                                        <img className="leftImg" src={formData?.background_img} alt="" />
                                    </div>
                                    <div className="w-2/5 flex">
                                        <label htmlFor="background_img" className="choose border w-full border-gray-300 px-8 py-2 text-white hover:cursor-pointer text-2xl rounded-md bg-sky-500 hover:bg-sky-400">
                                            <ImFolderUpload />
                                        </label>
                                        <input className="leftFile" accept="image/png, image/jpeg" id="background_img" hidden type="file" onChange={e => setBackgroundProduct(e.target.files[0])} />
                                        <span>{backgroundProduct?.name || backgroundProduct}</span>
                                    </div>
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
                                            <input className="leftFile" accept="image/png, image/jpeg" id="product_img" hidden type="file" onChange={e => setImageProduct(e.target.files[0])} />
                                            <span>{imageProduct?.name}</span>
                                        </div>
                                        <div className="mt-4">
                                            <div className="">
                                                <label htmlFor="name_color" className="w-full py-2">
                                                    Tên màu sắc
                                                </label>
                                                <input className="leftFile" id="name_color" type="text" onChange={(e) => setNameColor(e.target.value)}/>
                                            </div>
                                            <div className="flex">
                                                <label htmlFor="image_color" className="mr-2 h-fit border w-fit border-gray-300 p-2 text-white hover:cursor-pointer text-sm rounded-md bg-sky-500 hover:bg-sky-400">
                                                    <ImFolderUpload />
                                                </label>
                                                <input className="leftFile" accept="image/jpeg, image/png" hidden id="image_color" type="file" onChange={(e) => setImageColor(e.target.files[0])}/>
                                                <span>{imageColor?.name}</span>
                                            </div>
                                        </div>
                                        <p className="py-4">
                                            <span className="btn btn-info" onClick={handleAddNewColor}>Thêm màu</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="product__body-left">
                                    <div className="product__body-left-color">
                                        {
                                            product.name && product.color.map((item, index) => (
                                                <div key={index} className='btn' onClick={()=>handleSetNameDeleteColor(item.name_color)}>
                                                    <img src={item.url ? ` ${item.url}` : ''} alt='' />
                                                    <p>{item.name_color}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            {/* right  */}
                            <div className="updateForm__right w-3/5 lg:w-full md:lg:w-full md:w-full">
                                <div className="updateForm__right-item">
                                    <label htmlFor="price" className="item__label">Giá xe: (₫)</label>
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
                                    <label className="item__label">Dòng xe</label>
                                    <SelectField
                                        className="w-full"
                                        options={typeOption}
                                        selected={typeSelected}
                                        onChange={handleSetTypeForm} 
                                    />
                                </div>
                                <div className="updateForm__left-item items-center mb-2">
                                    <label className="item__label">Phân khúc</label>
                                    <SelectField
                                        className="w-full"
                                        options={listPower}
                                        selected={powerSelected}
                                        onChange={handleSetPowerForm}
                                    />
                                </div>
                                <div className="flex flex-wrap w-full">
                                    <div className="updateForm__left-item w-1/2 pr-2"> 
                                        <label htmlFor="dungtich" className="item__label">Sức mạnh: </label>
                                        <input id="dungtich" className="item__input" type="text" value={formData?.dungtich} onChange={(e) => setFormData(prev => ({ ...prev, dungtich: e.target.value}))} />
                                    </div>
                                    <div className="updateForm__left-item w-1/2 pr-2">
                                        <label htmlFor="momenxoan" className="item__label">Momen xoắn:</label>
                                        <input id="momenxoan" className="item__input" type="text" value={formData?.momenxoan} onChange={(e) => setFormData(prev => ({ ...prev, momenxoan: e.target.value}))} />
                                    </div>
                                    <div className="updateForm__left-item w-1/2 pr-2">
                                        <label htmlFor="trongluong" className="item__label">Trọng lượng:</label>
                                        <input id="trongluong" className="item__input" type="text" value={formData?.trongluong} onChange={(e) => setFormData(prev => ({ ...prev, trongluong: e.target.value}))} />
                                    </div>
                                    <div className="updateForm__left-item w-1/2 pr-2">
                                        <label htmlFor="maluc" className="item__label">Mã lực:</label>
                                        <input id="maluc" className="item__input" type="text" value={formData?.maluc} onChange={(e) => setFormData(prev => ({ ...prev, maluc: e.target.value}))} />
                                    </div>
                                </div>
                                <div className="updateForm__right-item">
                                    <label htmlFor="link_youtube" className="item__label">Link Youtube</label>
                                    <input id="link_youtube" className="item__input" type="text" value={formData?.link_youtube} onChange={(e) => setFormData(prev => ({ ...prev, link_youtube: e.target.value}))}/>
                                </div>
                                <div className="updateForm__right-item">
                                    <label htmlFor="content" className="item__label">Content</label>
                                    <input id="content" className="item__input" type="text" value={formData?.content} onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value}))}/>
                                </div>
                                <div className="updateForm__right-item">
                                    <label htmlFor="description" className="item__label">Mô tả chi tiết</label>
                                    <textarea
                                        id="description"
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

export default Product
