import React, { useEffect } from 'react'
import { useAppContext } from '../../../AppContext'
import { useNavigate } from 'react-router-dom'
import { Card, Col, Row, Statistic } from 'antd'
import "./Dashboard.css"
function Dashboard() {
  const { registerUser, loginUser, loginData } = useAppContext()
  const navigate = useNavigate()
  const userName = loginData?.user_fullname

  // useEffect(()=>{
  //     if(!loginUser?.user_fullname) navigate("/")
  // },[loginData])
  return (
    <React.Fragment>
      <h1>Panel de administración</h1>
      <h2>Hola, {loginData?.user_fullname}</h2>
      <section className="cards-container">

        <article className='dashboard-cards'>
          <p className='dashboard-cards__title'>Nuevos usuarios</p>
          <p className='dashboard-cards__value'>5</p>
        </article>

        <article className='dashboard-cards'>
          <p className='dashboard-cards__title'>Ventas del mes</p>
          <p className='dashboard-cards__value'>15</p>
        </article>

        <article className='dashboard-cards'>
          <p className='dashboard-cards__title'>Total de ventas</p>
          <p className='dashboard-cards__value'>$ 15.000</p>
        </article>

        <article className='dashboard-cards'>
          <p className='dashboard-cards__title'>Nuevos usuarios</p>
          <p className='dashboard-cards__value'>5</p>
        </article>

      </section>
    </React.Fragment>
  )
}

export default Dashboard