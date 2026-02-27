"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import React, { useState } from "react"

function UsersAdsList() {
  const [adsList, setAdsList] = useState([])

  return (
    <div>
      <h2 className="font-bold text-2xl mb-2">My Ads</h2>

      {adsList?.length == 0 && (
        <div className="p-5 border-dashed border-2 rounded-lg">
          <Image
            src={"/signboard.png"}
            alt="empty"
            width={200}
            height={200}
          />
          <h2 className='text-xl'>You don't have any ads</h2>
          <Button>Create New Ads</Button>
        </div>
      )}

      
    </div>
  )
}

export default UsersAdsList

