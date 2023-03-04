import { useState } from 'react'
import styles from '@/styles/Home.module.css'
import { Loader } from '../components/Loader'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { FilterMatchMode } from 'primereact/api'
import useSWR from 'swr'
        
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Home () {
  const [filters, setFilters] = useState({'global': { value: null, matchMode: FilterMatchMode.CONTAINS }})
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const { data, error, isLoading } = useSWR('http://portal/api/Puma/hotels', fetcher)

  if (error) return <div>Failed to load</div>
  if (isLoading) {return (<Loader />)}

  const onGlobalFilterChange = (e) => {
    const value = e.target.value
    let _filters = { ...filters }
    _filters['global'].value = value
    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  const header = () => {
    return (
      <div className="flex justify-content-end">
        <span className='p-input-icon-left p-input-icon-right'>
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Поиск" />
          {globalFilterValue ? <><i className="pi pi-times" onClick={clearFilter} style={{cursor: 'pointer'}} /></> : <><i className="pi pi-times" style={{color: 'lightgrey'}} /></>}
        </span>
      </div>
    )
  }

  const clearFilter = () => {
    setFilters({'global': { value: null, matchMode: FilterMatchMode.CONTAINS }})
    setGlobalFilterValue('')
  }

  return (
    <>
      <main className={styles.main}>
        <DataTable value={data} size="small" selectionMode="single" dataKey="_id" stripedRows removableSort paginator responsiveLayout="scroll" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="Строки {first} - {last} из {totalRecords}" rows={50} rowsPerPageOptions={[50,100,data.length]} filters={filters} filterDisplay="row" globalFilterFields={['name', 'city']} header={header} emptyMessage="Ничего не найдено." style={{'width': '95%'}}>
          <Column field="name" header="Название объекта" sortable style={{'width': '70%'}}></Column>
          <Column field="city" header="Город / Регион" sortable style={{'width': '30%'}}></Column>
        </DataTable>
      </main>
    </>
  )
}
