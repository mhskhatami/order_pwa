export interface PeopleListDTO {
    personId: number,
    name: string,
    personAddresses: PersonAddressesDTO[]
}

export interface PersonAddressesDTO {
    personAddressId: number,
    title: string,
    address: string,
    latitude: number,
    longitude: number,
    mobile: number
}