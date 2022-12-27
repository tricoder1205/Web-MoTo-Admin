import axios from 'axios';
import SelectField from 'components/custom-field/SelectField';
import { useEffect, useState } from 'react';
import { ImFolderUpload } from 'react-icons/im';
import {  useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const Product = () => {
    document.title = 'Admin - Thêm sản phẩm';
    
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
    const navigate = useNavigate ();

    const submitInfo = (e) => {
        e.preventDefault();
        let count = 0;
        Object.entries(formData).forEach(([key, val]) => {
            if (!val) {
                return count
            } else {
                count++;
            }
          })
          if(count === 12) {
            axios.post('/api/products/create', {...formData})
            .then(res=>{
                if(res.data.success) {
                    toast.success('Thêm mới thành công.')
                    return navigate(`/product/${res.data.data}`)
                }
            })
            .catch(e => {
                toast.error(e.message)
            })
          } else {
            return toast.warn('Vui lòng điền đầy đủ thông tin')
          }
    }
    return (
        <div className="product">
            <div className="product__title">
                <div className="product__title-edit uppercase">Thông tin sản phẩm</div>
            </div>
            <div className="product__content">
                <form className="updateForm xl:flex-row md:flex-col sm:flex-col" onSubmit={submitInfo} >
                    {/* left */}
                    <div className="updateForm__left w-2/5 lg:w-full md:lg:w-full md:w-full">
                        <div className="updateForm__left-item">
                            <label htmlFor="name" className="item__label">Tên xe</label>
                            <input id="name" className="item__input" type="text" onChange={e => setFormData(prev => ({ ...prev, name: e.target.value}))} />
                        </div>
                        <div className="updateForm__right-item">
                            <label htmlFor="price" className="item__label">Giá xe: (₫)</label>
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
                    </div>
                    {/* right  */}
                    <div className="updateForm__right w-3/5 lg:w-full md:lg:w-full md:w-full">
                        <div className="flex flex-wrap w-full">
                            <div className="updateForm__left-item w-1/2 pr-2"> 
                                <label htmlFor="dungtich" className="item__label">Sức mạnh: </label>
                                <input id="dungtich" className="item__input" type="text" onChange={(e) => setFormData(prev => ({ ...prev, dungtich: e.target.value}))} />
                            </div>
                            <div className="updateForm__left-item w-1/2 pr-2">
                                <label htmlFor="momenxoan" className="item__label">Momen xoắn:</label>
                                <input id="momenxoan" className="item__input" type="text" onChange={(e) => setFormData(prev => ({ ...prev, momenxoan: e.target.value}))} />
                            </div>
                            <div className="updateForm__left-item w-1/2 pr-2">
                                <label htmlFor="trongluong" className="item__label">Trọng lượng:</label>
                                <input id="trongluong" className="item__input" type="text" onChange={(e) => setFormData(prev => ({ ...prev, trongluong: e.target.value}))} />
                            </div>
                            <div className="updateForm__left-item w-1/2 pr-2">
                                <label htmlFor="maluc" className="item__label">Mã lực:</label>
                                <input id="maluc" className="item__input" type="text" onChange={(e) => setFormData(prev => ({ ...prev, maluc: e.target.value}))} />
                            </div>
                        </div>
                        <div className="updateForm__right-item">
                            <label htmlFor="link_youtube" className="item__label">Link Youtube</label>
                            <input id="link_youtube" className="item__input" type="text" onChange={(e) => setFormData(prev => ({ ...prev, link_youtube: e.target.value}))}/>
                        </div>
                        <div className="updateForm__right-item">
                            <label htmlFor="content" className="item__label">Content</label>
                            <input id="content" className="item__input" type="text" onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value}))}/>
                        </div>
                        <div className="updateForm__right-item">
                            <label htmlFor="description" className="item__label">Mô tả chi tiết</label>
                            <textarea
                                id="description"
                                className="w-full border rounded-lg p-2 h-32 resize-none border-blue-700 outline-none"
                                type="text"
                            
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value}))}/>
                        </div>
                        <button type="submit" className="rightUpdate">Cập nhật</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Product
