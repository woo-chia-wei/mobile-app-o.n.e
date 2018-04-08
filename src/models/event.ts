export interface DealEvent{
    id: string
    title: string,
    description: string,
    postalCode: string,
    ownerId: string,
    category: string,
    startTime: Date,
    endTime: Date,
    url: string,
    address: string
}