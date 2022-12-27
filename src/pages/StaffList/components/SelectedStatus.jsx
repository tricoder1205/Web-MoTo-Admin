import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import axios from 'axios'
import { Fragment, useState } from 'react'
import { toast } from 'react-toastify'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SelectedStatus(props) {
  const { id, refreshData} = props
  
  const options = [
    { id: 3, name: 'Nghỉ'},
    { id: 0, name: 'Đang hoạt động'},
    { id: 2, name: 'Đang làm việc'}
  ]
  const [statusSelected, setStatusSelected] = useState(options[1])
  const handleChangeStatus = (status) => {
    axios.post(`/api/staff/status`, { id, status })
    .then(res => {
      if (res.data.success) {
        toast.success(res.data)
        refreshData()
      } else {
        toast.danger(res.data)
      }
    }).catch((e) => console.log(e.message))
  }

  return (
    <Listbox value={statusSelected} onChange={setStatusSelected}>
      {({ open }) => (
        <>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
              <span className="block truncate text-black">{statusSelected?.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options && options.map((person) => (
                  <Listbox.Option
                    key={person.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-black bg-indigo-600' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <div onClick={() => handleChangeStatus(person.id)}>
                      {person.id === 0 && <div className="m-0 btn btn-received">{person.name}</div>}
                      {person.id === 2 && <div className="m-0 btn btn-transport">{person.name}</div>}
                      {person.id === 3 && <div className="m-0 btn btn-cancel">{person.name}</div>}
                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-black' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
