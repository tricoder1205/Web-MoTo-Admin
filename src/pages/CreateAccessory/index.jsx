import axios from 'axios';
import SelectField from 'components/custom-field/SelectField';
import Loading from 'components/Loading';
import { useEffect, useState } from 'react';
import { ImFolderUpload } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CreateAccessory () {
    document.title = 'Admin - Thông tin sản phẩm';
    const [loadingPage, setLoadingPage] = useState(false);
    const [imageAccessory, setImageAccessory] = useState('');
    const navigate = useNavigate()

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
        description: '',
        imageAccessory: ''
    });
    const handleSetImageForm = (e) => {
        setImageAccessory(e);
        setFormData(prev => ({
            ...prev,
            imageAccessory: e
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

    const submitInfo = (e) => {
        e.preventDefault();
        let count = 0 
        const fi = new FormData()
        setLoadingPage(true)
        Object.entries(formData).map(([key, val]) => {
            if (val) {
              return count += 1
            } else {
              return count
            }
        })
        if (count === 6) {
            fi.append('name', formData.name)
            fi.append('brand', formData.brand)
            fi.append('type', formData.type)
            fi.append('price', formData.price)
            fi.append('description', formData.description)
            fi.append('image', formData.imageAccessory, formData.imageAccessory.name)
    
            axios.put('/api/accessory/create', fi)
            .then(res=>{
                if(res.data.success) {
                    toast.success('Thêm mới thành công.')
                    setLoadingPage(false)
                    return navigate('/accessories')
                }
                setLoadingPage(false)
            })
            .catch(e => {
                toast.error(e.message)
                setLoadingPage(false)
            })
        } else {
            toast.warn('Điền đủ thông tin!!!')
            setLoadingPage(false)
        }
    }

    return (
        <>
            {loadingPage && <Loading />}
            <div className="product">
                <div className="product__title">
                    <div className="product__title-edit uppercase">Thêm mới sản phẩm</div>
                </div>
                <div className="product__content">
                    <form className="updateForm xl:flex-row md:flex-col sm:flex-col" onSubmit={submitInfo} >
                        {/* left */}
                        <div className="updateForm__left w-2/5 lg:w-full md:lg:w-full md:w-full">
                            <div className="updateForm__left-item">
                                <label htmlFor="name" className="item__label">Tên phụ tùng</label>
                                <input id="name" className="item__input" type="text" onChange={e => setFormData(prev => ({ ...prev, name: e.target.value}))} />
                            </div>
                            <label className="item__label text-xl">Hình sản phẩm: </label>
                            <div className="updateForm__left-item fileImage">
                                <div className="w-2/5 w-full">
                                    <div className="flex">
                                        <label htmlFor="product_img" className="choose border w-full border-gray-300 px-8 py-2 text-white hover:cursor-pointer text-2xl rounded-md bg-sky-500 hover:bg-sky-400">
                                            <ImFolderUpload />
                                        </label>
                                        <input className="leftFile" accept="image/png, image/jpeg" id="product_img" hidden type="file" onChange={e => handleSetImageForm(e.target.files[0])} />
                                        <span>{imageAccessory?.name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* right  */}
                        <div className="updateForm__right w-3/5 lg:w-full md:lg:w-full md:w-full">
                            <div className="updateForm__right-item">
                                <label htmlFor="price" className="item__label">Giá phụ tùng: (₫)</label>
                                <input id="price" className="item__input" type="text" onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value}))}/>
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
                                
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value}))}/>
                            </div>
                            <button type="submit" className="btn btn-info">Thêm mới</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
