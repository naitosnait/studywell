export interface Org {
  orgname: string
  shotname: string
  description: string
  INN: number
  OGRN: number
  address: string
  factaddress: string
  replies: any[]
  page_ids: number[]
  ambassadors: Ambassador[]
  photo: string
  org_activate: boolean
  tel: string
  email: string
  created_at: string
  updated_at: string
}

export interface Ambassador {
  username: string
  name: string
  surname: string
  email: string
  tel: string
  photo: string
  created_at: string
  updated_at: string
}


