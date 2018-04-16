export interface DealEvent{
    id: string
    title: string,
    description: string,
    postalCode: string,
    ownerId: string,
    category: string,
    startTime: number,
    endTime: number,
    url: string,
    address: string,
    longitude: number,
    latitude: number,
    createdTime: number,
    favourites: {}
}

export interface DealEventView{
    id: string
    title: string,
    description: string,
    postalCode: string,
    ownerId: string,
    category: string,
    startTime: number,
    endTime: number,
    url: string,
    address: string,
    longitude: number,
    latitude: number,
    favourite: boolean
}