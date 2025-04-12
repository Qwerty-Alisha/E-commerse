import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAllProductsAsync, fetchProductbyFiltersAsync } from './productSlice'
import { Menu, MenuButton, MenuItems, MenuItem, Dialog, DialogPanel, DialogBackdrop, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, FunnelIcon, Squares2X2Icon, XMarkIcon, PlusIcon, MinusIcon, StarIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'

// 👉 Mobile Filters Component
function MobileFilters({ mobileFiltersOpen, setMobileFiltersOpen, filters, handleFilter }) {
  return (
    <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
      <DialogBackdrop className="fixed inset-0 bg-black/25" />
      <div className="fixed inset-0 z-40 flex">
        <DialogPanel className="relative ml-auto w-full max-w-xs overflow-y-auto bg-white py-4 pb-12 shadow-xl">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-400 p-2">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <form className="mt-4 border-t border-gray-200">
            {filters.map((section) => (
              <Disclosure key={section.id} as="div" className="border-t border-gray-200 px-4 py-6">
                <DisclosureButton className="flex w-full justify-between text-gray-900">
                  {section.name}
                  <PlusIcon className="h-5 w-5 data-[open]:hidden" />
                  <MinusIcon className="h-5 w-5 hidden data-[open]:block" />
                </DisclosureButton>
                <DisclosurePanel className="pt-6">
                  <div className="space-y-6">
                    {section.options.map((option, idx) => (
                      <div key={option.value} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`filter-mobile-${section.id}-${idx}`}
                          name={`${section.id}[]`}
                          onChange={(e) => handleFilter(e, section, option)}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <label htmlFor={`filter-mobile-${section.id}-${idx}`} className="text-sm text-gray-500">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

// 👉 Desktop Filters Component
function DesktopFilters({ filters, handleFilter }) {
  return (
    <form className="hidden lg:block">
      {filters.map((section) => (
        <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6">
          <DisclosureButton className="flex w-full justify-between text-gray-900">
            {section.name}
            <PlusIcon className="h-5 w-5 data-[open]:hidden" />
            <MinusIcon className="h-5 w-5 hidden data-[open]:block" />
          </DisclosureButton>
          <DisclosurePanel className="pt-6">
            <div className="space-y-4">
              {section.options.map((option, idx) => (
                <div key={option.value} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`filter-${section.id}-${idx}`}
                    name={`${section.id}[]`}
                    defaultChecked={option.checked}
                    onChange={(e) => handleFilter(e, section, option)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label htmlFor={`filter-${section.id}-${idx}`} className="text-sm text-gray-600">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </DisclosurePanel>
        </Disclosure>
      ))}
    </form>
  )
}

// 👉 Product Grid Component
function ProductGrid({ products }) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <Link to="/ProdDetails" key={product.id}>
              <div className="group relative">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:h-60"
                />
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">{product.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      <StarIcon className="w-5 h-5 inline" />
                      <span>{product.rating}</span>
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// 👉 Pagination Component
function Pagination() {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <a
          href="#"
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </a>
        <a
          href="#"
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
            <span className="font-medium">97</span> results
          </p>
        </div>
        <div>
          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
            <a
              href="#"
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon aria-hidden="true" className="size-5" />
            </a>
            <a
              href="#"
              aria-current="page"
              className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              1
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              2
            </a>
            <a
              href="#"
              className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
            >
              3
            </a>
            {/* <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
              ...
            </span>
            <a
              href="#"
              className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
            >
              8
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              9
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              10
            </a> */}
            <a
              href="#"
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon aria-hidden="true" className="size-5" />
            </a>
          </nav>
        </div>
      </div>
    </div>
  )
}

// 👉 Main Component
export default function Example() {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.product.products)
  const [filter, setFilter] = useState({})
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const sortOptions = [
    { name: 'Best Rating', sort: 'rating', order: 'desc' },
    { name: 'Price: Low to High', sort: 'price', order: 'asc' },
    { name: 'Price: High to Low', sort: 'price', order: 'desc' },
  ]

  const filters = [
    {
      id: 'category',
      name: 'Category',
      options: [
        {value: 'beauty', label: 'beauty', checked: false}, 
        {value: 'fragrances', label: 'fragrances', checked: false},
        {value: 'furniture', label: 'furniture', checked: false},
        {value: 'groceries', label: 'groceries', checked: false},
      ],
    },
    {
      id: 'brand',
      name: 'brand',
      options: [
        {value: 'Essence', label: 'Essence', checked: false},
        {value: 'Glamour Beauty', label: 'Glamour Beauty', checked: false},
        {value: 'Velvet Touch', label: 'Velvet Touch', checked: false},
        {value: 'Chic Cosmetics', label: 'Chic Cosmetics', checked: false},
        {value: 'Nail Couture', label: 'Nail Couture', checked: false},
        {value: 'Calvin Klein', label: 'Calvin Klein', checked: false},
        {value: 'Chanel', label: 'Chanel', checked: false},
        {value: 'Dior', label: 'Dior', checked: false},
        {value: 'Dolce & Gabbana', label: 'Dolce & Gabbana', checked: false},
        {value: 'Gucci', label: 'Gucci', checked: false},
        {value: 'Annibale Colombo', label: 'Annibale Colombo', checked: false},
        {value: 'Furniture Co.', label: 'Furniture Co.', checked: false},
        {value: 'Knoll', label: 'Knoll', checked: false},
        {value: 'Bath Trends', label: 'Bath Trends', checked: false},]
    },
    {
      id: 'size',
      name: 'Size',
      options: [
        { value: '2l', label: '2L', checked: false },
        { value: '6l', label: '6L', checked: false },
        { value: '12l', label: '12L', checked: false },
        { value: '18l', label: '18L', checked: false },
        { value: '20l', label: '20L', checked: false },
        { value: '40l', label: '40L', checked: true },
      ],
    },
  ]

  useEffect(() => {
    dispatch(fetchAllProductsAsync())
  }, [dispatch])

  const handleFilter = (e, section, option) => {
    const newFilter = { ...filter, [section.id]: option.value }
    setFilter(newFilter)
    dispatch(fetchProductbyFiltersAsync(newFilter))
  }

  const handleSort = (e, option) => {
    const newFilter = { ...filter, _sort: option.sort, _order: option.order }
    setFilter(newFilter)
    dispatch(fetchProductbyFiltersAsync(newFilter))
  }

  return (
    <div className="bg-white">
      <MobileFilters
        mobileFiltersOpen={mobileFiltersOpen}
        setMobileFiltersOpen={setMobileFiltersOpen}
        filters={filters}
        handleFilter={handleFilter}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b pb-3 pt-3">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">New Arrivals</h1>
          <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton className="inline-flex justify-center text-sm text-gray-700 hover:text-gray-900">
                Sort
                <ChevronDownIcon className="ml-1 h-5 w-5 text-gray-400" />
              </MenuButton>
              <MenuItems className="absolute right-0 z-10 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <MenuItem key={option.name}>
                      <p
                        onClick={(e) => handleSort(e, option)}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        {option.name}
                      </p>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>
            <button className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500">
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 lg:hidden"
            >
              <FunnelIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <section className="pb-24 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
            <DesktopFilters filters={filters} handleFilter={handleFilter} />
            <div className="lg:col-span-3">
              <ProductGrid products={products} />
            </div>
          </div>
        </section>

        <Pagination />
      </main>
    </div>
  )
}
