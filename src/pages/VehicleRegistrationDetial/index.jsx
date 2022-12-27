import axios from 'axios';
import InputField from 'components/custom-field/InputField';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const VehicleRegistrationDetial = () => {
  const { id } = useParams()

  const [formData, setFormData] = useState(null); 

  useEffect(() => {
    axios.get(`/api/vehicle-registration/${id}`)
    .then(res => {
        if(res.data.success){
          setFormData(res.data.data)
        }
    })
}, [id])

return (
  <div className="">
    <div className="container">
      <div className="text-3xl py-4 border-b border-gray-400 px-2 w-full font-bold uppercase">
          <h1>Đăng ký xe</h1>
      </div>
      <div className="my-10 pt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-2xl leading-6 text-gray-900 font-bold">
                Thông tin cá nhân của khách hàng
              </h3>
            </div>
          </div>
          <div className="my-5 md:col-span-2 md:mt-0">
            <div className="shadow sm:rounded-md">
              <div className="bg-white px-4 py-5 sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <InputField
                      disabled={true}
                      label="Họ và tên của bạn"
                      name="first-name"
                      type="text"
                      // required
                      defaultValue={formData?.name}
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <InputField
                      disabled={true}
                      label="Số điện thoại"
                      name="phone"
                      type="text"
                      // required
                      defaultValue={formData?.phone}
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <InputField
                      disabled={true}
                      label="Email"
                      name="email"
                      type="text"
                      // required
                      defaultValue={formData?.email}
                      />
                  </div>
                  <div className="col-span-6 sm:col-span-4">
                    <InputField
                      disabled={true}
                      label="Số CMCD/CCCD"
                      name="cccd"
                      type="text"
                      // required
                      defaultValue={formData?.cccd}
                      />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <InputField
                      disabled={true}
                      label="Ngày cấp"
                      name="cccd_date"
                      type="text"
                      // required
                      defaultValue={formData?.cccd_date}
                      />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <InputField
                      disabled={true}
                      label="Nơi cấp"
                      name="cccd_address"
                      type="text"
                      // required
                      defaultValue={formData?.cccd_address}
                      />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <InputField
                      disabled={true}
                      label="Thành phố"
                      name="city"
                      type="text"
                      // required
                      defaultValue={formData?.city}
                      />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <InputField
                      disabled={true}
                      label="Quận/Huyện"
                      name="district"
                      type="text"
                      // required
                      defaultValue={formData?.district}
                      />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <InputField
                      disabled={true}
                      label="Xã/Phường"
                      name="ward"
                      type="text"
                      // required
                      defaultValue={formData?.ward}
                      />
                  </div>
                  <div className="col-span-3 sm:col-span-6">
                    <InputField
                      disabled={true}
                      label="Địa chỉ"
                      name="address"
                      type="text"
                      // required
                      defaultValue={formData?.address}
                      />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 mb-32 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-2xl leading-6 text-gray-900 font-bold">Đăng ký cho xe</h3>
              <p className="mt-1 text-sm text-gray-600"></p>
            </div>
          </div>
          <Link to={`/product/${formData?.product?.productId}`} className="mt-5 md:col-span-2 md:mt-0 flex justify-start" >
            <img className="w-48 h-32" src={formData?.product?.image} alt="" />
            <div className="ml-10">
              <div className="">
                <p className="font-bold w-32 inline-block">Mã sản phẩm: </p>
                <span>{formData?.product?._id}</span>
              </div>
              <div className="">
                <p className="font-bold w-32 inline-block">Tên xe: </p>
                <span>{formData?.product?.name}</span>
              </div>
              <div className="">
                <p className="font-bold w-32 inline-block">Thương hiệu: </p>
                <span>{formData?.product?.brand}</span>
              </div>
              <div className="">
                <p className="font-bold w-32 inline-block">Dòng xe: </p>
                <span>{formData?.product?.type}</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
}

export default VehicleRegistrationDetial
