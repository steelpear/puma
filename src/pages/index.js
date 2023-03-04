import { useState } from 'react'
import styles from '@/styles/Home.module.css'
import { Loader } from '../components/Loader'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { FilterMatchMode } from 'primereact/api'
import { Image } from 'primereact/image'
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

  const nameBodyTemplate = (data) => {
    return <>
    <span style={{color:"black",fontWeight:"600"}}>{data.name}</span>
    <p style={{fontSize:"13px",margin:"0px",lineHeight:"15px"}}>
    {data.phone1 ? <>{data.phone1}<br></br></> : <></>}
    {data.phone2 ? <>{data.phone2}<br></br></> : <></>}
    {data.email ? <>{data.email}</> : <></>}
    </p>
    </>
  }

  const staffBodyTemplate = (data) => {
    return data.staff.map(item => {return <p style={{fontSize:"13px",margin:"0px",lineHeight:"15px"}}>{item}<br></br></p>})
  }

  const linkBodyTemplate = (data) => {
    return <><a href={`http://${data.href}`} target="_blank" style={{textDecoration:"none"}}>{data.href}</a></>
  }

  const siteBodyTemplate = (data) => {
    return <Image src="logo.svg" alt="portal" width="25" />
  }

  return (
    <>
      <main className={styles.main}>
        <DataTable value={data} size="small" selectionMode="single" dataKey="_id" stripedRows removableSort paginator responsiveLayout="scroll" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="Строки {first} - {last} из {totalRecords}" rows={50} rowsPerPageOptions={[50,100,data.length]} filters={filters} filterDisplay="row" globalFilterFields={['name','city','phone1','phone2','email','type']} header={header} emptyMessage="Ничего не найдено." style={{'width': '95%'}}>
          <Column header="Объект" body={nameBodyTemplate} sortable></Column>
          <Column field="city" header="Регион" sortable></Column>
          <Column field="type" header="Тип" sortable></Column>
          <Column header="Ссылка" body={linkBodyTemplate}></Column>
          <Column header="Менеджер" body={staffBodyTemplate}></Column>
          <Column header="Сайт" body={siteBodyTemplate}></Column>
        </DataTable>
      </main>
    </>
  )
}
