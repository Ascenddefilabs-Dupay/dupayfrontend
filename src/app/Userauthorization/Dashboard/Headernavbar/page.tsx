'use client'
import React from 'react'
import Headernavbar from './headernavbar'

const page = () => {
  const userId = '12345'; // Replace with dynamic user ID as needed

  return (
    <Headernavbar userId={userId} />
  )
}

export default page