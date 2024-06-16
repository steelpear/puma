import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/Home.module.css'
import { Loader } from '../components/Loader'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Badge } from 'primereact/badge'
import { FilterMatchMode } from 'primereact/api'
import { Image } from 'primereact/image'
import { ScrollTop } from 'primereact/scrolltop'
import { OverlayPanel } from 'primereact/overlaypanel'
import { InputMask } from "primereact/inputmask"
import { Button } from 'primereact/button'
import useSWR from 'swr'
import Cookies from 'js-cookie'
        
const fetcher = (...args) => fetch(...args).then((res) => res.json())
const punycode = require('punycode/')

export default function Home () {
  const op = useRef(null)
  const router = useRouter()
  const [filters, setFilters] = useState({'global': { value: null, matchMode: FilterMatchMode.CONTAINS }})
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const [phoneValue, setPhoneValue] = useState()
  const [phoneData, setPhoneData] = useState()
  const [phoneDataLoading, setPhoneDataLoading] = useState(false)
  const { data: hotels, error } = useSWR('https://broniryem.ru/api/Puma/hotels', fetcher)


  useEffect(() => {
    if (!Cookies.get('b46a4a041a02ad2194e24184e5034af9')) {router.push('/auth.php')}
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) return <div>Ошибка {error.message}</div>
  if (!hotels) {return (<Loader mutate={false} />)}

  const onGlobalFilterChange = (e) => {
    const value = e.target.value
    let _filters = { ...filters }
    _filters['global'].value = value
    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  const getPhoneInfo = async () => {
    setPhoneDataLoading(true)
    const reg = new RegExp(/[-()/\\ ]/g)
    const res = await fetch(`https://broniryem.ru/api/Puma/phoneinfo?num=${phoneValue.replace(reg,'')}`)
    const response = await res.json()
    setPhoneData(response)
    setPhoneDataLoading(false)
  }

  const closeOverlayPanel = (e) => {
    op.current.toggle(e)
    setPhoneData('')
    setPhoneValue('')
  }

  const header = () => {
    return <div className="flex align-items-center justify-content-between">
        <div className="flex align-items-center">
          <Image src="letter.svg" alt="autosatellite" width="15" style={{marginLeft:"10px"}}/>
          <span style={{ margin: "0 15px 0 5px", fontWeight: "600", fontSize: 13 }}>Автосателлит</span>
          <Image src="satellite.svg" alt="satellite" width="15" style={{marginLeft:"10px"}}/>
          <span style={{ margin: "0 15px 0 5px", fontWeight: "600", fontSize: 13 }}>Сателлит</span>
          <Image src="rocket.svg" alt="classic" width="15" />
          <span style={{ margin: "0 15px 0 5px", fontWeight: "600", fontSize: 13 }}>Классический</span>
          <Image src="aa.svg" alt="autonome" width="15" />
          <span style={{ margin: "0 15px 0 5px", fontWeight: "600", fontSize: 13 }}>Автономный</span>
          <Image src="logo.svg" alt="no site" width="15" />
          <span style={{ margin: "0 15px 0 5px", fontWeight: "600", fontSize: 13 }}>Нет сайта</span>
          <Badge value={hotels.length} />
          <div className="card flex justify-content-center">
            <Button className='ml-2' icon="pi pi-mobile" rounded text severity="info" aria-label="Region" onClick={(e) => op.current.toggle(e)} />
            <OverlayPanel ref={op} showCloseIcon style={{width:300}}>
              <div className="flex justify-content-center">
                <div>
                  <label htmlFor="phone" className="font-medium text-center block mb-2">Информация о номере</label>
                  <InputMask id="phone" value={phoneValue} onChange={(e) => setPhoneValue(e.target.value)} mask="9 (999) 999-99-99" placeholder="x (xxx) xxx-xx-xx" />
                </div>
              </div>
              <div className="flex align-items-center justify-content-between mt-2">
                <Button icon="pi pi-times" rounded text severity="danger" aria-label="Close" onClick={(e) => closeOverlayPanel(e)} tooltip="Очистить и закрыть" tooltipOptions={{ position: 'left' }} disabled={!phoneValue} />
                <Button icon="pi pi-check" rounded text severity="info" aria-label="GetInfo" onClick={() => getPhoneInfo()} tooltip="Получить информацию" tooltipOptions={{ position: 'right' }} loading={phoneDataLoading} disabled={!phoneValue} />
              </div>
              {phoneData &&
              <div>
                <div className='mb-1'>Номер: <span className="font-medium">{phoneData.full_num}</span></div>
                <div className='mb-1'>Оператор: <span className="font-medium">{phoneData.operator}</span></div>
                {phoneData.old_operator && <div className='mb-1'>Прошлый оператор: <span className="font-medium">{phoneData.old_operator}</span></div>}
                <div>Регион: <span className="font-medium">{phoneData.region}</span></div>
              </div>}
            </OverlayPanel>
          </div>
        </div>
        <div className="flex">
          <span className='p-input-icon-left p-input-icon-right'>
            <i className="pi pi-search" />
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Поиск" />
            {globalFilterValue ? <i className="pi pi-times" onClick={clearFilter} style={{ cursor: 'pointer' }} /> : <i className="pi pi-times" style={{ color: 'lightgrey' }} />}
          </span>
        </div>
      </div>
  }

  const clearFilter = () => {
    setFilters({'global': { value: null, matchMode: FilterMatchMode.CONTAINS }})
    setGlobalFilterValue('')
  }

  const nameBodyTemplate = (data) => {
    return <>
    <a href={`https://broniryem.ru/admin/collections/entry/5a5dc18e670fd819bca20da7/${data._id}`} target="_blank" style={{textDecoration:"none"}}><span style={{color:"black",fontWeight:"600"}}>{data.name}</span></a>
    <p style={{fontSize:"13px",margin:"0px",lineHeight:"15px"}}>
    {data.phone1 ? <>{data.phone1}<br></br></> : <></>}
    {data.phone2 ? <>{data.phone2}<br></br></> : <></>}
    {/* {data.email ? <>{data.email}</> : <></>} */}
    </p>
    </>
  }

  const staffBodyTemplate = (data) => {
    return data.staff && data.staff.length > 0 ? data.staff.map((item,index) => {return <p key={index} style={{fontSize:"13px",margin:"0px",lineHeight:"15px"}}>{item}<br></br></p>}) : <i className="pi pi-minus" />
  }

  const linkBodyTemplate = (data) => {
    if (data.site_type === "Сателлит" || data.site_type === "Автосателлит") {return data.sat_domain ? <a href={`http://${data.sat_domain}`} target="_blank" style={{textDecoration:"none"}}>{punycode.toUnicode(data.sat_domain)}</a> : <></>}
    else if (data.site_type === "Классический" || data.site_type === "Автономный") {return data.href ? <a href={`http://${data.href}`} target="_blank" style={{textDecoration:"none"}}>{punycode.toUnicode(data.href)}</a> : <></>}
    else if (data.site_type === "Нет сайта") {return data.portal_link ? <a href={`http://${data.portal_link.replace(/^https?:\/\//,'')}`} target="_blank" style={{textDecoration:"none"}}>{data.portal_link.replace(/^https?:\/\//,'')}</a> : <a href={`https://broniryem.ru/search?q=${data.name}`} target="_blank" style={{textDecoration:"none"}}>{`broniryem.ru/search?q=${data.name}`}</a>}
    else { return <></> }
  }

  const siteBodyTemplate = (data) => {
    if (data.site_type === "Сателлит") {return <div style={{textAlign:'center'}}><Image src="satellite.svg" alt="satellite" width="20" /></div>}
    else if (data.site_type === "Классический") {return <div style={{textAlign:'center'}}><Image src="rocket.svg" alt="classic" width="20" /></div>}
    else if (data.site_type === "Автономный") {return <div style={{textAlign:'center'}}><Image src="aa.svg" alt="autonome" width="20" /></div>}
    else if (data.site_type === "Автосателлит" || data.sat_template === "aleanus") {return <div style={{textAlign:'center'}}><Image src="letter.svg" alt="autosatellite" width="20" /></div>}
    else if (data.site_type === "Нет сайта") {return <div style={{textAlign:'center'}}><Image src="logo.svg" alt="nosite" width="20" /></div>}
    else {return <div style={{textAlign:'center'}}><Image src="nothing.svg" alt="none" width="20" /></div>}
  }

  return (
    <>
      <main className={styles.main}>
        <DataTable value={hotels} size="small" selectionMode="single" dataKey="_id" stripedRows removableSort paginator responsiveLayout="scroll" paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="Строки {first} - {last} из {totalRecords}" rows={50} rowsPerPageOptions={[50,100,hotels ? hotels.length : 0]} filters={filters} globalFilterFields={['name','city','phone1','phone2','email','type','staff','sat_domain','href','portal_link']} header={header} emptyMessage="Данных нет" style={{'width': '95%'}}>
          <Column header="Объект" body={nameBodyTemplate} sortable></Column>
          <Column field="city" header="Регион" sortable></Column>
          <Column field="type" header="Тип" sortable></Column>
          <Column header="Ссылка" body={linkBodyTemplate}></Column>
          <Column header="Менеджер" body={staffBodyTemplate}></Column>
          <Column header="Сайт" body={siteBodyTemplate}></Column>
        </DataTable>
      </main>
      <ScrollTop className="bg-gray-500" style={{right:"5px"}} />
    </>
  )
}
